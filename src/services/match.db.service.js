import matchModel from "../models/match.model.js";

export const saveCompleteMatchToDB = async (matchId, matchData) => {
    try {
        matchData.status = "completed"
        matchData.endTime = new Date();
        const match = await matchModel.create({
            matchId,
            ...matchData
        });
        console.log("Match created:", match);
        return match
    } catch (error) {
        console.error("Error creating match:", error.message);
        throw new Error("Failed to save data in db")
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