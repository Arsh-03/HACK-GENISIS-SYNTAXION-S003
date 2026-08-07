import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  category: String,
  severity: { type: String, enum: ['WARNING', 'CRITICAL', 'INFO'] },
  timestamp: String,
  student: String,
  candidateId: String,
  terminalId: String,
  recommendedAction: String,
  createdAt: { type: Date, default: Date.now }
});

export const Alert = mongoose.model('Alert', alertSchema);

const incidentSchema = new mongoose.Schema({
  time: String,
  student: String,
  candidateId: String,
  alertType: String,
  description: String,
  evidence: String,
  status: { type: String, enum: ['New', 'Acknowledged', 'Escalated', 'Resolved'] },
  assignedInvigilator: String,
  createdAt: { type: Date, default: Date.now }
});

export const Incident = mongoose.model('Incident', incidentSchema);

const logSchema = new mongoose.Schema({
  time: String,
  candidate: String,
  type: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
});

export const Log = mongoose.model('Log', logSchema);

const seatSchema = new mongoose.Schema({
  deskNumber: String,
  seatId: String,
  terminalId: String,
  candidateName: String,
  candidateId: String,
  status: String
});

export const Seat = mongoose.model('Seat', seatSchema);
