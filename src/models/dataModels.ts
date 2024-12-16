import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  isMale: {
    type: String,
  },
  Age: {
    type: Number,
  },
  
  SkillsAcquired: {
      type: String,
    },
    
  HighestLevel: {
      type: String,
    },
  DateAdded: {
    type: Date,
  }
});

const data = mongoose.models.data || mongoose.model("data", dataSchema, 'data');

export default data;