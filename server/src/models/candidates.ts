import mongoose from "mongoose";
import bcrypt from "bcrypt";

const candidatesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "batches",
    },
    transcript: {
      type: String,
      required: true,
    },
    experience_analysis: {
      experience_match: {
        type: Number,
      },
      key_strengths: {
        type: [String],
      },
      missing_skills: {
        type: [String],
      },
      complexity_handled: {
        type: Number,
      },
      overall_fit_score: {
        type: Number,
      },
    },
    sentimental_analysis: {
      filler_words: {
        type: Object,
      },
      filler_word_percentage: {
        type: Number,
      },
      polarity_score: {
        type: Number,
      },
      overall_sentiment: {
        type: String,
      },
      grammar_mistakes: {
        type: [String],
      },
      grammar_accuracy: {
        type: Number,
      },
      overall_score: {
        type: Number,
      },
    },
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidatesSchema);

export default Candidate;
