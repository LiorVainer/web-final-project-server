import request from 'supertest';
import { initServer } from '../server';
import mongoose from 'mongoose';
import { UserRepository } from '../repositories/user.repository';
import { UserWithTokens } from '../types/user.types';
import testUsers from './users_tests.json';
import { Application } from 'express';

let app: Application;

const testUser: UserWithTokens = {
    email: 'test1@user.com',
    password: 'testpassword',
    username: 'testuser',
    picture: 'testpicture',
};

beforeAll(async () => {
    const res = await initServer();
    app = res.app;
    await UserRepository.deleteMany();

    const registerResponse = await request(app).post('/auth/register').send(testUser);
    expect(registerResponse.statusCode).toBe(200);

    const loginResponse = await request(app).post('/auth/login').send(testUser);
    testUser.accessToken = loginResponse.body.accessToken;
    testUser._id = loginResponse.body._id;
    expect(testUser.accessToken).toBeDefined();
});

afterAll(async () => {
    await mongoose.connection.close();
});

let userId = '';

describe('User API Integration Tests', () => {
    test('creates a new user with email and password', async () => {
        const response = await request(app).post('/users').send(testUsers[0]);

        expect(response.statusCode).toBe(201);
        expect(response.body.email).toBe(testUsers[0].email);
        expect(response.body.email).not.toBe(testUsers[1].email);

        userId = response.body._id;
        expect(userId).toBeDefined();
    });

    test('retrieves all users from the database', async () => {
        const response = await request(app).get('/users');

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
    });

    test('retrieves a user by their ID', async () => {
        const response = await request(app).get(`/users/${userId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(userId);
        expect(response.body.email).toBe(testUsers[0].email);
    });

    test("updates a user's password using their ID", async () => {
        const response = await request(app)
            .put(`/users/${userId}`)
            .set({ authorization: 'JWT ' + testUser.accessToken })
            .send({ password: 'updatedpassword' });

        expect(response.statusCode).toBe(200);
    });

    test('deletes a user by their ID', async () => {
        const response = await request(app)
            .delete(`/users/${userId}`)
            .set({ authorization: 'JWT ' + testUser.accessToken });

        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(userId);
    });
});
