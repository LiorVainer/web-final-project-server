import request from 'supertest';
import { initServer } from '../server';
import mongoose from 'mongoose';
import { Express } from 'express';
import { MatchExperience } from '../models/match-experience.model';
import { UserWithTokens } from '../types/user.types';

let app: Express;
let matchExperienceId = '';

const testMatchExperience: Partial<MatchExperience> = {
    homeTeam: 'Team A',
    awayTeam: 'Team B',
    matchDate: new Date(),
    league: 'Premier League',
    country: 'England',
    stadium: 'Wembley Stadium',
    title: 'Exciting Match!',
    description: 'This will be an intense match between top teams.',
    likes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
};

const testUser: UserWithTokens = {
    email: 'test1@user.com',
    password: 'testpassword',
    username: 'testuser',
    picture: 'testpicture',
};

beforeAll(async () => {
    const res = await initServer();
    app = res.app;
    // await MatchExperienceRepository.deleteMany();

    const registerResponse = await request(app).post('/auth/register').send(testUser);
    expect(registerResponse.statusCode).toBe(200);

    const loginResponse = await request(app).post('/auth/login').send(testUser);
    testUser.accessToken = loginResponse.body.accessToken;
    testUser._id = loginResponse.body._id;
    testMatchExperience.createdBy = loginResponse.body._id;
    expect(testUser.accessToken).toBeDefined();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('MatchExperience API Integration Tests', () => {
    test('creates a new matchExperience', async () => {
        const { createdBy, ...rest } = testMatchExperience;
        const response = await request(app)
            .post('/match-experiences')
            .set('Authorization', `Bearer ${testUser.accessToken}`)
            .send(rest);

        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(testMatchExperience.title);
        matchExperienceId = response.body._id;
        expect(matchExperienceId).toBeDefined();
    });

    test('retrieves all matchExperiences', async () => {
        const response = await request(app)
            .get('/match-experiences')
            .set('Authorization', `Bearer ${testUser.accessToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.experiences.length).toBeGreaterThanOrEqual(1);
    });

    test('retrieves a matchExperience by ID', async () => {
        const response = await request(app)
            .get(`/match-experiences/${matchExperienceId}`)
            .set('Authorization', `Bearer ${testUser.accessToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(matchExperienceId);
    });

    test('updates a matchExperience', async () => {
        const response = await request(app)
            .put(`/match-experiences/${matchExperienceId}`)
            .set('Authorization', `Bearer ${testUser.accessToken}`)
            .send({ title: 'Updated MatchExperience Title' });

        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe('Updated MatchExperience Title');
    });

    test('adds a comment to a matchExperience', async () => {
        const response = await request(app)
            .post(`/match-experiences/${matchExperienceId}/comments`)
            .set('Authorization', `Bearer ${testUser.accessToken}`)
            .send({ userId: testUser._id, content: 'Great match!' });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).not.toBeNull();
    });

    test('likes a matchExperience', async () => {
        const response = await request(app)
            .post(`/match-experiences/${matchExperienceId}/like`)
            .set('Authorization', `Bearer ${testUser.accessToken}`)
            .send({ userId: testUser._id });

        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBeTruthy();
    });

    test('unlikes a matchExperience', async () => {
        const response = await request(app)
            .post(`/match-experiences/${matchExperienceId}/unlike`)
            .set('Authorization', `Bearer ${testUser.accessToken}`)
            .send({ userId: testUser._id });

        expect(response.statusCode).toBe(200);
        expect(response.body.ok).toBeTruthy();
    });

    test('deletes a matchExperience', async () => {
        const response = await request(app)
            .delete(`/match-experiences/${matchExperienceId}`)
            .set('Authorization', `Bearer ${testUser.accessToken}`);

        expect(response.statusCode).toBe(200);
    });
});
