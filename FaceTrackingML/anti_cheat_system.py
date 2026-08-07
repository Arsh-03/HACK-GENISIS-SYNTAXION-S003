import cv2
import base64
import json
import mediapipe as mp
import numpy as np
import sounddevice as sd
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

# --- Configuration & Thresholds ---
# Head Rotation Thresholds (degrees)
YAW_THRESHOLD = 20    # Looking too far left or right
PITCH_UP_THRESHOLD = 15   # Looking too far up (suspicious)
PITCH_DOWN_THRESHOLD = 38 # Looking down at paper/solving (allowed more range)
ROLL_THRESHOLD = 15   # Tilting head too far

# Lip Open Threshold (distance between inner lips)
# We calculate relative distance to account for distance from camera
LIP_DISTANCE_THRESHOLD = 0.035

# Audio Threshold (RMS amplitude)
AUDIO_THRESHOLD = 0.001  # Adjust based on mic sensitivity

# Exam-mode thresholds (stricter when multiple faces are detected)
EXAM_FACE_COUNT = 2
EXAM_MODE_YAW_THRESHOLD = 12
EXAM_MODE_LIP_DISTANCE_THRESHOLD = 0.03
EXAM_MODE_AUDIO_THRESHOLD = 0.0008


# System Status Flags
head_status = "Calibrating"
lip_status = "Calibrating"
audio_status = "Calibrating"
cheat_warnings = []

# Event logging for console reporting
events_log = []
events_lock = threading.Lock()
feed_lock = threading.Lock()
latest_feeds = {}
# rate-limit identical logs to avoid flooding
last_log_times = {}
LOG_MIN_INTERVAL = 1.0

def log_event(msg):
    now = time.time()
    last = last_log_times.get(msg, 0)
    if now - last < LOG_MIN_INTERVAL:
        return
    last_log_times[msg] = now
    ts = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(now))
    with events_lock:
        events_log.append((ts, msg))

def console_reporter():
    while True:
        time.sleep(5)
        with events_lock:
            entries = list(events_log)
            events_log.clear()
        print("\n--- Anti-Cheat Console Report ---")
        print(f"Time: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        try:
            print(f"Head: {head_status} | Mouth: {lip_status} | Audio: {audio_status}")
        except Exception:
            pass
        if entries:
            print("Recent events:")
            for ts, msg in entries:
                print(f"[{ts}] {msg}")
        else:
            print("No new events.")
        print("---------------------------------\n")


class FeedRelayHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200, content_type='application/json'):
        self.send_response(status)
        self.send_header('Content-Type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(204)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == '/api/feeds':
            with feed_lock:
                payload = list(latest_feeds.values())
            self._set_headers()
            self.wfile.write(json.dumps({"items": payload}).encode('utf-8'))
            return

        if parsed.path.startswith('/api/feeds/'):
            candidate_id = parsed.path.split('/api/feeds/', 1)[1]
            with feed_lock:
                payload = latest_feeds.get(candidate_id)
            if payload is None:
                self._set_headers(404)
                self.wfile.write(json.dumps({"error": "feed not found"}).encode('utf-8'))
                return
            self._set_headers()
            self.wfile.write(json.dumps(payload).encode('utf-8'))
            return

        if parsed.path.startswith('/api/feeds/') and parsed.path.endswith('/stream'):
            candidate_id = parsed.path.split('/api/feeds/', 1)[1].rsplit('/stream', 1)[0]
            self.send_response(200)
            self.send_header('Content-Type', 'multipart/x-mixed-replace; boundary=frame')
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            last_frame_bytes = None
            while True:
                with feed_lock:
                    payload = latest_feeds.get(candidate_id)

                frame_url = payload.get('frameUrl') if payload else None
                frame_bytes = None
                if frame_url and frame_url.startswith('data:image'):
                    try:
                        _, encoded = frame_url.split(',', 1)
                        frame_bytes = base64.b64decode(encoded)
                    except Exception:
                        frame_bytes = None

                if frame_bytes and frame_bytes != last_frame_bytes:
                    try:
                        self.wfile.write(b'--frame\r\n')
                        self.wfile.write(b'Content-Type: image/jpeg\r\n')
                        self.wfile.write(f'Content-Length: {len(frame_bytes)}\r\n\r\n'.encode('utf-8'))
                        self.wfile.write(frame_bytes)
                        self.wfile.write(b'\r\n')
                        self.wfile.flush()
                        last_frame_bytes = frame_bytes
                    except Exception:
                        break

                time.sleep(0.2)
            return

        self._set_headers(404)
        self.wfile.write(json.dumps({"error": "not found"}).encode('utf-8'))

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path != '/api/feeds':
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "not found"}).encode('utf-8'))
            return

        content_length = int(self.headers.get('Content-Length', '0'))
        raw_body = self.rfile.read(content_length).decode('utf-8')
        try:
            payload = json.loads(raw_body or '{}')
        except json.JSONDecodeError:
            self._set_headers(400)
            self.wfile.write(json.dumps({"error": "invalid json"}).encode('utf-8'))
            return

        candidate_id = payload.get('candidateId')
        if not candidate_id:
            self._set_headers(400)
            self.wfile.write(json.dumps({"error": "candidateId is required"}).encode('utf-8'))
            return

        payload['updatedAt'] = time.time()
        with feed_lock:
            latest_feeds[candidate_id] = payload

        self._set_headers(200)
        self.wfile.write(json.dumps({"ok": True}).encode('utf-8'))


def start_feed_relay_server():
    try:
        server = ThreadingHTTPServer(('127.0.0.1', 8765), FeedRelayHandler)
    except OSError as e:
        print(f"Warning: Live feed relay unavailable ({e}). Invigilator browser sync will fall back to local sharing only.")
        return

    print('Live feed relay server listening at http://127.0.0.1:8765')
    server.serve_forever()


relay_thread = threading.Thread(target=start_feed_relay_server, daemon=True)
relay_thread.start()

# Start console reporter thread
reporter_thread = threading.Thread(target=console_reporter, daemon=True)
reporter_thread.start()

# --- Audio Capture Setup ---
current_volume = 0.0
audio_lock = threading.Lock()

def audio_callback(indata, frames, time_info, status):
    global current_volume
    if status:
        pass
    # Calculate Root Mean Square (RMS) of the audio segment
    rms = np.sqrt(np.mean(indata**2))
    with audio_lock:
        current_volume = float(rms)

# Start background audio thread
def start_audio_stream():
    try:
        # Standard sample rate, 1 channel (mono)
        stream = sd.InputStream(
            samplerate=16000,
            channels=1,
            callback=audio_callback,
            blocksize=1024
        )
        with stream:
            while True:
                time.sleep(0.1)
    except Exception as e:
        print(f"Warning: Audio device error ({e}). Microphone checks disabled.")

audio_thread = threading.Thread(target=start_audio_stream, daemon=True)
audio_thread.start()

# --- MediaPipe Initialization ---
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    max_num_faces=2,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# 3D generic head model points (in world coordinates)
# Used for cv2.solvePnP to estimate head pose
model_points = np.array([
    (0.0, 0.0, 0.0),             # Nose tip
    (0.0, -330.0, -65.0),        # Chin
    (-225.0, 170.0, -135.0),     # Left eye corner
    (225.0, 170.0, -135.0),      # Right eye corner
    (-150.0, -150.0, -125.0),    # Left mouth corner
    (150.0, -150.0, -125.0)      # Right mouth corner
], dtype=np.float32)


def main():
    global head_status, lip_status, audio_status, cheat_warnings

    # Initialize Camera
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    print("Anti-Cheating Camera System Started.")
    print("Press 'q' to quit, and 'c' to recalibrate.")

    # Calibration parameters
    calibrated = False
    calibration_frames = 0
    sum_yaw = 0.0
    sum_pitch = 0.0
    sum_roll = 0.0
    baseline_yaw = 0.0
    baseline_pitch = 0.0
    baseline_roll = 0.0
    diff_yaw = 0.0
    diff_pitch = 0.0
    diff_roll = 0.0


    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            print("Failed to grab frame.")
            break

        # Flip the frame horizontally for a natural selfie-view
        frame = cv2.flip(frame, 1)
        h, w, c = frame.shape

        # Convert the BGR image to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(rgb_frame)

        active_warnings = []

        # --- Video Check ---
        # Determine number of faces and whether we should enter "exam" (stricter) mode
        exam_mode = False
        face_count = 0
        if results.multi_face_landmarks:
            face_count = len(results.multi_face_landmarks)
            exam_mode = face_count >= EXAM_FACE_COUNT

            # Select thresholds depending on mode
            cur_yaw_threshold = EXAM_MODE_YAW_THRESHOLD if exam_mode else YAW_THRESHOLD
            cur_lip_distance_threshold = EXAM_MODE_LIP_DISTANCE_THRESHOLD if exam_mode else LIP_DISTANCE_THRESHOLD
            cur_audio_threshold = EXAM_MODE_AUDIO_THRESHOLD if exam_mode else AUDIO_THRESHOLD

            # --- Audio Check (use current threshold)
            with audio_lock:
                vol = current_volume

            if vol > cur_audio_threshold:
                audio_status = "TALKING / NOISE"
                active_warnings.append("High Audio Level Detected")
            else:
                audio_status = "OK"

            # If multiple faces are present treat as ERROR and skip per-face analysis
            if face_count >= EXAM_FACE_COUNT:
                head_status = "ERROR"
                lip_status = "ERROR"
                msg = f"Multiple Faces Detected ({face_count}) - ERROR"
                active_warnings.append(msg)
                log_event(msg)
                # Draw prominent centered error banner
                cv2.rectangle(frame, (w // 2 - 260, h // 2 - 60), (w // 2 + 260, h // 2 + 60), (0, 0, 255), -1)
                cv2.putText(frame, "ERROR: MULTIPLE FACES DETECTED", (w // 2 - 240, h // 2), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
                # Mark all detected faces with red markers
                for extra in results.multi_face_landmarks:
                    for lm_idx in (4, 33, 263):
                        lm = extra.landmark[lm_idx]
                        cx, cy = int(lm.x * w), int(lm.y * h)
                        cv2.circle(frame, (cx, cy), 4, (0, 0, 200), -1)
            else:
                # Use primary (first) detected face for pose/lip analysis
                face_landmarks = results.multi_face_landmarks[0]
                landmarks = face_landmarks.landmark

                # 1. Head Pose Estimation
                image_points = np.array([
                    (landmarks[4].x * w, landmarks[4].y * h),     # Nose tip
                    (landmarks[152].x * w, landmarks[152].y * h), # Chin
                    (landmarks[33].x * w, landmarks[33].y * h),   # Left eye corner
                    (landmarks[263].x * w, landmarks[263].y * h), # Right eye corner
                    (landmarks[61].x * w, landmarks[61].y * h),   # Left mouth corner
                    (landmarks[291].x * w, landmarks[291].y * h)  # Right mouth corner
                ], dtype=np.float32)

                focal_length = w
                center = (w / 2, h / 2)
                camera_matrix = np.array([
                    [focal_length, 0, center[0]],
                    [0, focal_length, center[1]],
                    [0, 0, 1]
                ], dtype=np.float32)

                dist_coeffs = np.zeros((4, 1))

                success_pnp, rotation_vector, translation_vector = cv2.solvePnP(
                    model_points, image_points, camera_matrix, dist_coeffs, flags=cv2.SOLVEPNP_ITERATIVE
                )

                if success_pnp:
                    (nose_end_point2D, jacobian) = cv2.projectPoints(
                        np.array([(0.0, 0.0, 500.0)]), rotation_vector, translation_vector, camera_matrix, dist_coeffs
                    )

                    rmat, _ = cv2.Rodrigues(rotation_vector)
                    angles, _, _, _, _, _ = cv2.RQDecomp3x3(rmat)
                    pitch = angles[0]
                    yaw = angles[1]
                    roll = angles[2]

                    if not calibrated:
                        head_status = f"Calibrating ({calibration_frames}/30)"
                        sum_yaw += yaw
                        sum_pitch += pitch
                        sum_roll += roll
                        calibration_frames += 1
                        if calibration_frames >= 30:
                            baseline_yaw = sum_yaw / 30.0
                            baseline_pitch = sum_pitch / 30.0
                            baseline_roll = sum_roll / 30.0
                            calibrated = True
                    else:
                        diff_yaw = yaw - baseline_yaw
                        diff_pitch = pitch - baseline_pitch
                        diff_roll = roll - baseline_roll

                        if abs(diff_yaw) > cur_yaw_threshold:
                            head_status = "LOOKING AWAY"
                            msg = "Head Turned / Looking Away"
                            active_warnings.append(msg)
                            log_event(msg)
                        else:
                            head_status = "OK"

                    p1 = (int(image_points[0][0]), int(image_points[0][1]))
                    p2 = (int(nose_end_point2D[0][0][0]), int(nose_end_point2D[0][0][1]))
                    cv2.line(frame, p1, p2, (0, 255, 0) if head_status == "OK" else (0, 0, 255), 2)
                    if calibrated:
                        cv2.putText(frame, f"Y: {int(diff_yaw)} P: {int(diff_pitch)}", (p1[0] - 40, p1[1] - 20),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1)

                # 2. Lip Distance Calculation
                eye_dist = np.linalg.norm(
                    np.array([landmarks[33].x - landmarks[263].x, landmarks[33].y - landmarks[263].y])
                )
                lip_dist = np.linalg.norm(
                    np.array([landmarks[13].x - landmarks[14].x, landmarks[13].y - landmarks[14].y])
                )
                normalized_lip_dist = lip_dist / (eye_dist if eye_dist > 0 else 1)

                if normalized_lip_dist > cur_lip_distance_threshold:
                    lip_status = "SPEAKING / OPEN"
                    msg = "Mouth Moving / Open"
                    active_warnings.append(msg)
                    log_event(msg)
                else:
                    lip_status = "OK"

                lip_points = [13, 14, 78, 308]
                for lp in lip_points:
                    cx, cy = int(landmarks[lp].x * w), int(landmarks[lp].y * h)
                    cv2.circle(frame, (cx, cy), 2, (0, 255, 255) if lip_status == "OK" else (0, 0, 255), -1)
        else:
            head_status = "NO FACE DETECTED"
            lip_status = "NO FACE DETECTED"
            active_warnings.append("No Face In Frame")

        # --- Dashboard Overlay Rendering ---
        # Background bar for stats
        cv2.rectangle(frame, (10, 10), (320, 170), (0, 0, 0), -1)
        cv2.rectangle(frame, (10, 10), (320, 170), (255, 255, 255), 1)

        # Status text
        cv2.putText(frame, "ANTI-CHEAT DASHBOARD", (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1, cv2.LINE_AA)
        
        # Head Status
        if not calibrated:
            h_color = (0, 255, 255)
        else:
            h_color = (0, 255, 0) if head_status == "OK" else (0, 0, 255)
        cv2.putText(frame, f"Head Pose: {head_status}", (20, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.5, h_color, 1, cv2.LINE_AA)
        
        # Lip Status
        l_color = (0, 255, 0) if lip_status == "OK" else (0, 0, 255)
        cv2.putText(frame, f"Mouth Status: {lip_status}", (20, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.5, l_color, 1, cv2.LINE_AA)

        # Audio Status & Meter
        a_color = (0, 255, 0) if audio_status == "OK" else (0, 0, 255)
        cv2.putText(frame, f"Audio Status: {audio_status}", (20, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.5, a_color, 1, cv2.LINE_AA)
        
        # Draw volume meter bar
        bar_width = int(min(vol / AUDIO_THRESHOLD, 1.0) * 100)
        cv2.rectangle(frame, (20, 135), (120, 145), (100, 100, 100), -1)
        cv2.rectangle(frame, (20, 135), (20 + bar_width, 145), a_color, -1)

        # Calibration Prompt overlay
        if not calibrated:
            cv2.rectangle(frame, (w // 2 - 220, h - 80), (w // 2 + 220, h - 20), (0, 0, 0), -1)
            cv2.rectangle(frame, (w // 2 - 220, h - 80), (w // 2 + 220, h - 20), (0, 255, 255), 2)
            cv2.putText(frame, "CALIBRATING: LOOK STRAIGHT AT CAMERA", (w // 2 - 200, h - 45),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1, cv2.LINE_AA)

        # Warnings Display (Red box on top right if there are active violations)
        if active_warnings and calibrated:
            # Draw warnings
            y_offset = 30
            for warn in list(set(active_warnings)):
                cv2.rectangle(frame, (w - 300, y_offset - 15), (w - 10, y_offset + 10), (0, 0, 255), -1)
                cv2.putText(frame, warn, (w - 290, y_offset), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1, cv2.LINE_AA)
                y_offset += 35
            # Log all unique active warnings for console reporter (rate-limited inside log_event)
            for warn in list(set(active_warnings)):
                log_event(warn)

        # Show Exam Mode indicator if active
        if exam_mode:
            cv2.rectangle(frame, (w - 200, h - 60), (w - 10, h - 10), (0, 128, 255), -1)
            cv2.putText(frame, "EXAM MODE: MULTIPLE FACES", (w - 190, h - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1, cv2.LINE_AA)

        # Display output
        cv2.imshow("Anti-Cheating Camera AI", frame)

        # Key listener
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        elif key == ord('c'):
            calibrated = False
            calibration_frames = 0
            sum_yaw = 0.0
            sum_pitch = 0.0
            sum_roll = 0.0

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
