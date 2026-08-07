export const PROCTOR_THRESHOLDS = {  
  // Vision (MediaPipe)  
  FACE_DETECTION_SUSTAINED_FRAMES: 15, // Require 15 consecutive frames (~1.5s) to flag multiple faces  
  YAW_ANGLE_THRESHOLD: 28,            // Degrees head turn before flagging pitch/yaw violation  
  PITCH_ANGLE_THRESHOLD: 22,  
    
  // Audio (Web Audio API)  
  // Increase decibel threshold in loud hackathon rooms  
  AUDIO_RMS_SPIKE_THRESHOLD: import.meta.env.VITE_VENUE_NOISE === "loud" ? 0.25 : 0.10,  
  AUDIO_SUSTAINED_MS: 1200,            // Sound must last > 1.2 seconds (ignores quick claps/drops)  
    
  // Tab Switch  
  TAB_SWITCH_STRIKE_DELAY_MS: 500  
};
