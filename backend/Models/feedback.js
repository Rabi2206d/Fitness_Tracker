import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const FeedbackSchema = new Schema({
  user: {
    type: ObjectId,
    ref: "user",
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  quality: {
    type: String,
    required: true
  },
  suggestion: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("feedback", FeedbackSchema);
