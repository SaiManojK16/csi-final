const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  progress: {
    faSimulation: {
      solved: { type: Number, default: 0 },
      total: { type: Number, default: 10 },
      percentage: { type: Number, default: 0 },
      problems: [{
        problemId: String,
        status: { type: String, enum: ['solved', 'attempted', 'unsolved'], default: 'unsolved' },
        attempts: { type: Number, default: 0 },
        lastAttempt: Date,
        bestScore: Number,
      }]
    },
    mcqs: {
      solved: { type: Number, default: 0 },
      total: { type: Number, default: 20 },
      percentage: { type: Number, default: 0 },
      quizzes: [{
        quizId: String,
        status: { type: String, enum: ['completed', 'attempted', 'not_started'], default: 'not_started' },
        attempts: { type: Number, default: 0 },
        lastAttempt: Date,
        bestScore: Number,
        answers: [Number], // Array of selected answer indices
      }]
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: {
    type: String,
    default: undefined,
  },
  resetPasswordExpires: {
    type: Date,
    default: undefined,
  },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update progress
userSchema.methods.updateProgress = function(type, data) {
  if (type === 'fa') {
    this.progress.faSimulation.solved = data.solved || this.progress.faSimulation.solved;
    this.progress.faSimulation.percentage = Math.round(
      (this.progress.faSimulation.solved / this.progress.faSimulation.total) * 100
    );
  } else if (type === 'mcq') {
    this.progress.mcqs.solved = data.solved || this.progress.mcqs.solved;
    this.progress.mcqs.percentage = Math.round(
      (this.progress.mcqs.solved / this.progress.mcqs.total) * 100
    );
  }
};

module.exports = mongoose.model('User', userSchema);

