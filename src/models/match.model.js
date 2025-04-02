import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
  {
    matchId: {
      type: String,
      required: true,
      unique: true,
    },
    team1: {
      type: String,
      required: true,
    },
    team2: {
      type: String,
      required: true,
    },
    score1: {
      type: Number,
      default: 0,
    },
    score2: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['ongoing', 'completed', 'scheduled'],
      default: 'scheduled',
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
  },
  { timestamps: true } 
);

const Match = mongoose.model('Match', matchSchema);

export default Match;