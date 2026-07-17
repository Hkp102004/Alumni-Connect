const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['job', 'internship'],
      default: 'job',
    },
    location: { type: String, trim: true },
    description: { type: String, required: true },
    applyLink: { type: String, trim: true }, // external link, optional
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    applicants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        appliedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ['applied', 'shortlisted', 'rejected', 'hired'],
          default: 'applied',
        },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Opportunity', opportunitySchema);
