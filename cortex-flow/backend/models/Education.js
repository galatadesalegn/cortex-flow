import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  role: {
    type: String,
    required: [true, 'Degree/Role is required'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Institution is required'],
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    default: ''
  },
  duration: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  icon: {
    type: String,
    default: '🎓'
  },
  logo: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

educationSchema.index({ startDate: -1 });

const Education = mongoose.model('Education', educationSchema);

export default Education;
