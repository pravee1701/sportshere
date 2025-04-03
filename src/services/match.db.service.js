import matchModel from "../models/match.model.js";

export const saveCompleteMatchToDB = async (matchId, matchData) => {
    try {
        // Ensure the match is marked as completed
        matchData.status = "completed";
        matchData.endTime = new Date();

        // Update the match if it exists, or create a new one
        const match = await matchModel.findOneAndUpdate(
            { matchId }, 
            { $set: matchData }, 
            { new: true, upsert: true } 
        );

        console.log("Match saved to DB:", match);
        return match;
    } catch (error) {
        console.error("Error saving match to DB:", error.message);
        throw new Error(`Failed to save match to DB: ${error.message}`);
    }
};

export const getCompletedMatchesFromDB = async () => {
    return await matchModel.find();
}

export const deleteCompletedMatchFromDB = async (matchId) => {
    return await matchModel.findOneAndDelete({ matchId });
};

export const getCompletedMatchFromDB = async (matchId) => {
    return await matchModel.findOne({ matchId });
};

export const saveMatchToDB = async (matchId, matchData) => {
    try {
        const existingMatch = await matchModel.findOne({ matchId });

        if (existingMatch) {
            return await matchModel.findOneAndUpdate({ matchId }, matchData, { new: true });
        } else {
            const match = new matchModel({ matchId, ...matchData });
            return await match.save();
        }
    } catch (error) {
        console.error('Error saving match to MongoDB:', error);
        throw error;
    }
};