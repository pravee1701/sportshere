import { getLiveScores } from "./src/services/liveScores.service.js";

const testLiveScores = async () => {
  try {
    const footballScores = await getLiveScores('football');
    // console.log('Football Scores:', footballScores);

    // const basketballScores = await getLiveScores('basketball');
    // console.log('Basketball Scores:', basketballScores);
  } catch (error) {
    console.error('Error testing live scores:', error);
  }
};

testLiveScores();