import mongoose from 'mongoose';

const generationHistorySchema = new mongoose.Schema({
  exam_id: { type: String, required: true },
  exam_code: { type: String, required: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  question_count: { type: Number, required: true },
  status: { type: String, enum: ['PENDING', 'GENERATING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
  mode: { type: String, enum: ['live', 'demo', 'fallback', 'actual'], default: 'live' },
  error_message: { type: String },
  paper_data: { type: mongoose.Schema.Types.Mixed },
  generated_by: { type: String, default: 'System' },
  generation_latency_ms: { type: Number },
  balance_score: { type: Number },
  questions_count: { type: Number },
  difficulty_ratio: { type: String },
  created_at: { type: Date, default: Date.now }
}, {
  collection: 'generation_history'
});

const GenerationHistory = mongoose.model('GenerationHistory', generationHistorySchema);
export default GenerationHistory;
