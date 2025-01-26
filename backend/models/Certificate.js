import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Certificate name is required'],
    trim: true
  },
  issuer: {
    type: String,
    required: [true, 'Issuer is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  image: {
    type: String,
    default: null
  },
  link: {
    type: String,
    default: null
  },
  category: {
    type: String,
    enum: ['Web', 'Mobile', 'AI/ML', 'UI/UX', 'Cloud', 'Data Science', 'DevOps', 'Cybersecurity', 'Other'],
    default: 'Other'
  },
  certificateId: {
    type: String,
    default: null,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

certificateSchema.index({ createdAt: -1 });
certificateSchema.index({ featured: -1 });

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;
