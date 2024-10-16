// Define the Announcement schema
const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    message: {
      type: String,
      required: true,
    },
    enabled: {
      type: Boolean,
      default: false, // default to disabled
    },
  }, { timestamps: true });
  
  const Announcement = mongoose.model('Announcement', announcementSchema);
  
  module.exports = Announcement;

  
  
  