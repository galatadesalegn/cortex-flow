import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  icon: {
    type: String,
    default: '🖥️'
  },
  lucideIcon: {
    type: String,
    default: 'Monitor'
  },
  title: {
    type: String,
    required: [true, 'Please provide a service title'],
    trim: true
  },
  subtitle: {
    type: String,
    required: [true, 'Please provide a service subtitle'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a service description'],
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['active', 'draft', 'archived'],
    default: 'active'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
