import mongoose from 'mongoose';

const candidateAttemptSchema = new mongoose.Schema({
  candidate_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  exam_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
  session_id: { type: String },
  terminal_id: { type: String },
  status: { type: String, enum: ['IN_PROGRESS', 'SUBMITTED', 'WARNING', 'CRITICAL', 'NORMAL', 'OFFLINE'], default: 'NORMAL' },
  cameraActive: { type: Boolean, default: true },
  micActive: { type: Boolean, default: true },
  heartbeatStatus: { type: String, default: 'LIVE' },
  verificationStatus: { type: String, default: 'VERIFIED' },
  faceMatchScore: { type: String },
  examProgress: { type: Number, default: 0 },
  answeredCount: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  violationType: { type: String, default: 'None' },
  riskScore: { type: Number, default: 0 },
  activityTimeline: [{
    time: String,
    type: { type: String },
    text: String
  }],
  started_at: { type: Date, default: Date.now },
  submitted_at: { type: Date }
}, {
  collection: 'candidate_attempts'
});

const CandidateAttempt = mongoose.model('CandidateAttempt', candidateAttemptSchema);
export default CandidateAttempt;
