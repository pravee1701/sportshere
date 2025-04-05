import * as tf from '@tensorflow/tfjs-node';

const trainModel = async () => {
    const trainingData = tf.tensor2d([
        [2.5, 1.0],
        [1.0, 2.5],
        [1.5, 1.5],
        [3.0, 0.5],
        [0.5, 3.0],
    ]);

    const outputData = tf.tensor2d([
        [0.8, 0.2],
        [0.2, 0.8],
        [0.5, 0.5],
        [0.9, 0.1],
        [0.1, 0.9],
    ]);

    const model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [2], units: 4, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 2, activation: 'softmax' }));

    model.compile({
        optimizer: tf.train.adam(),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });

    await model.fit(trainingData, outputData, { epochs: 100, verbose: 0 });
    return model;
};


export const predictMatchOutcome = async (team1AvgScore, team2AvgScore) => {
    const model = await trainModel();
    const input = tf.tensor2d([[team1AvgScore, team2AvgScore]]);
    const prediction = model.predict(input);
    const probabilities = prediction.arraySync()[0];

    return {
        team1WinProbability: Math.round(probabilities[0] * 100),
        team2WinProbability: Math.round(probabilities[1] * 100),
    }
}

