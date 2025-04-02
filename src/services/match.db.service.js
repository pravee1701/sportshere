import matchModel from "../models/match.model.js";

export const saveCompleteMatchToDB = async (matchId, matchData) =>{
    const match = await matchModel.create({
        matchId,
        ...matchData
    })
    return match;
};

export const getCompletedMatchesFromDB = async ()=>{
    return await matchModel.find();
}