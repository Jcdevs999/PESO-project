import mongoose from "mongoose";

const TestSchema = new mongoose.Schema({
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

const Test = mongoose.models.Test || mongoose.model("Test", TestSchema, 'Test');

export default Test;