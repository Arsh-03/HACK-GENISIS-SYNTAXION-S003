import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  exam_code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  total_duration_minutes: { type: Number, default: 180 },
  total_marks: { type: Number, default: 720 },
  marking_scheme: {
    correct_marks: { type: Number, default: 4 },
    incorrect_marks: { type: Number, default: -1 },
    unattempted_marks: { type: Number, default: 0 }
  },
  blueprint: { type: mongoose.Schema.Types.Mixed },
  target_difficulty_distribution: { type: mongoose.Schema.Types.Mixed },
  status: { type: String, enum: ['UPCOMING', 'RUNNING', 'COMPLETED', 'PAUSED'], default: 'UPCOMING' },
  start_time: { type: Date },
  end_time: { type: Date }
}, {
  collection: 'exams'
});

const Exam = mongoose.model('Exam', examSchema);
export default Exam;
