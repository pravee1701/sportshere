import dotenv from 'dotenv';
dotenv.config();

export const API_CONFIG = {
    football: {
        baseUrl: process.env.FOOTBALL_BASE_URL,
        headers: {
            'x-rapidapi-host': 'v3.football.api-sports.io',
            'x-rapidapi-key': process.env.RAPID_API_KEY,
        },
        liveEndpoint:'/fixtures',
    },
    basketball: {
        baseUrl: process.env.BASKETBALL_BASE_URL,
        headers: {
            'x-rapidapi-host': 'v3.basketball.api-sports.io',
            'x-rapidapi-key': process.env.RAPID_API_KEY,
        },
        liveEndpoint:'/games',
    },
};