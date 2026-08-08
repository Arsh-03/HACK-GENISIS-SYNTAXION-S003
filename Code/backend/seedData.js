import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './db.js';
import User from './models/User.js';
import Exam from './models/Exam.js';
import CandidateAttempt from './models/CandidateAttempt.js';
import { Alert, Incident, Log, Seat } from './models/Telemetry.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    const userCount = await User.countDocuments();
    
    // Always seed standard admin and a few test users if not enough
    if (userCount < 2) {
      console.log('Seeding initial users...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);

      await User.create([
        {
          full_name: 'Admin User',
          email: 'admin@example.com',
          password_hash: hashedPassword,
          role: 'ADMIN',
          is_active: true
        },
        {
          full_name: 'Aarav Sharma',
          email: 'aarav.sharma@university.edu',
          password_hash: hashedPassword,
          role: 'STUDENT',
          roll_number: 'CBT-2026-0891',
          assigned_center_id: 'CENTER_DEMO_01'
        },
        {
          full_name: 'Sophia Chen',
          email: 'sophia.chen@university.edu',
          password_hash: hashedPassword,
          role: 'STUDENT',
          roll_number: 'CBT-2026-0412',
          assigned_center_id: 'CENTER_DEMO_01'
        }
      ]);
    }

    const examCount = await Exam.countDocuments();
    if (examCount === 0) {
      console.log('Seeding initial exams...');
      await Exam.create({
        exam_code: 'NEET_UG_2026',
        title: 'National Eligibility cum Entrance Test (UG) 2026',
        total_duration_minutes: 180,
        total_marks: 720,
        blueprint: {
          Physics: { required_count: 45, section_weightage: 0.25 },
          Chemistry: { required_count: 45, section_weightage: 0.25 },
          Biology_Botany: { required_count: 45, section_weightage: 0.25 },
          Biology_Zoology: { required_count: 45, section_weightage: 0.25 }
        },
        target_difficulty_distribution: {
          Easy: 0.35,
          Medium: 0.45,
          Hard: 0.20
        },
        status: 'UPCOMING',
        start_time: new Date('2026-08-08T09:00:00Z'),
        end_time: new Date('2026-08-08T12:00:00Z')
      });
    }

    const db = mongoose.connection.db;
    const questionsCollection = db.collection('questions');
    const questionCount = await questionsCollection.countDocuments();
    if (questionCount === 0) {
      console.log('Seeding initial questions...');
      const subjects = ['Physics', 'Chemistry', 'Biology_Botany', 'Biology_Zoology'];
      const topics = {
        Physics: ['Mechanics', 'Thermodynamics', 'Optics', 'Electromagnetism'],
        Chemistry: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry'],
        Biology_Botany: ['Cell Biology', 'Genetics', 'Ecology', 'Plant Physiology'],
        Biology_Zoology: ['Human Physiology', 'Zoology', 'Evolution', 'Biotechnology']
      };
      const difficulties = ['Easy', 'Medium', 'Hard'];
      const questions = [];
      for (let i = 1; i <= 200; i++) {
        const subject = subjects[i % 4];
        const topic = topics[subject][i % 4];
        const difficulty = difficulties[i % 3];
        questions.push({
          sequence_id: i,
          subject,
          topic,
          difficulty,
          question_text: `Sample ${subject} question ${i}: This is a ${difficulty.toLowerCase()} level question about ${topic}. Select the correct answer.`,
          options: [
            `Option A for question ${i}`,
            `Option B for question ${i}`,
            `Option C for question ${i}`,
            `Option D for question ${i}`
          ],
          correct_option_index: i % 4,
          media_url: ''
        });
      }
      await questionsCollection.insertMany(questions);
      console.log(`Seeded ${questions.length} questions.`);
    }

    const attemptCount = await CandidateAttempt.countDocuments();
    if (attemptCount === 0) {
      console.log('Seeding initial candidate attempts & telemetry...');
      
      const admin = await User.findOne({ email: 'admin@example.com' });
      const aarav = await User.findOne({ email: 'aarav.sharma@university.edu' });
      const exam = await Exam.findOne({ exam_code: 'NEET_UG_2026' });

      if (aarav && exam) {
        await CandidateAttempt.create({
          candidate_id: aarav._id,
          exam_id: exam._id,
          session_id: 'DAY_01_SHIFT_01_MORNING',
          terminal_id: 'TRM-04-12',
          status: 'CRITICAL',
          violationType: 'Multiple Faces Detected',
          riskScore: 94,
          examProgress: 68,
          answeredCount: 34,
          totalQuestions: 50,
          activityTimeline: [
            { time: "10:42:15 AM", type: "CRITICAL", text: "Second person detected in webcam stream." },
            { time: "10:35:01 AM", type: "WARNING", text: "Window unfocus / Alt-Tab event registered." }
          ]
        });
      }

      await Seat.create([
        { deskNumber: "Desk 01", seatId: "S-101", terminalId: "TRM-01-01", candidateName: "Aarav Sharma", candidateId: "CBT-2026-0891", status: "CRITICAL" },
        { deskNumber: "Desk 02", seatId: "S-102", terminalId: "TRM-01-02", candidateName: "Sophia Chen", candidateId: "CBT-2026-0412", status: "WARNING" }
      ]);

      await Alert.create([
        { category: "Multiple Faces", severity: "CRITICAL", timestamp: "10:42:15 AM", student: "Aarav Sharma", candidateId: "CBT-2026-0891", terminalId: "TRM-04-12", recommendedAction: "Issue Immediate Warning & Inspect Stream" }
      ]);
      
      await Incident.create([
        { time: "10:42:15 AM", student: "Aarav Sharma", candidateId: "CBT-2026-0891", alertType: "Multiple Faces Detected", description: "Secondary person identified standing behind candidate chair.", evidence: "Webcam Frame #18420", status: "New", assignedInvigilator: "Dr. H. Vance" }
      ]);

      await Log.create([
        { time: "10:42:15 AM", candidate: "Aarav Sharma", type: "CRITICAL", text: "AI Detector: Second person detected in webcam stream." }
      ]);
    }

    console.log('Data seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
