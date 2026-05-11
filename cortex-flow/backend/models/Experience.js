import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Company is required'],
    trim: true
  },
  location: {
    type: String,
    default: '',
    trim: true
  },
  startDate: {
    type: String,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: String,
    default: 'Present'
  },
  isCurrent: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  order: {
    type: Number,
    default: 0
  },
  icon: {
    type: String,
    default: ''
  },
  logo: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['experience', 'education'],
    default: 'experience'
  }
}, {
  timestamps: true
});

experienceSchema.index({ startDate: -1 });

const Experience = mongoose.model('Experience', experienceSchema);

export default Experience;
