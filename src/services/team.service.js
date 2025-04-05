import Match from "../models/match.model.js"

export const calculateTeamAvgScore = async (teamName) => {
    try {
        const matches = await Match.find({ $or: [{team1: teamName}, {team2: teamName}],
        status: 'completed'});

        if(matches.length === 0){
            console.log(`No completed matches found for ${teamName}`);
            return 0;
        }

        let totalScore = 0;
        let totalMatches = 0;

        matches.forEach((match) => {
            if(match.team1 === teamName){
                totalScore += match.score1;
            } else {
                totalScore += match.score2;
            }
            totalMatches++;
        })

        return totalScore / totalMatches;
    } catch (error) {
        console.error(`Error calculating average score for ${teamName}:`, error);
        throw error;
    }
}

export const getTeamAverageScore = async (teamName, sport) => {
    try {
        const avgScore = await calculateTeamAvgScore(teamName);

        if(avgScore > 0){
            return avgScore;
        }
        return 0;
    } catch (error) {
        console.error(`Error getting average score for ${teamName}:`, error);
        throw error;
    }
}