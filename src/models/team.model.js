import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      required: true,
    },
    coach: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } 
);

const Team = mongoose.model('Team', teamSchema);

export default Team;