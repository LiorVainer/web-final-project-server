import request from 'supertest';
import { initServer } from '../server';
import mongoose from 'mongoose';
import { UserRepository } from '../repositories/user.repository';
import { UserWithTokens } from '../types/user.types';
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

describe('User API Integration Tests', () => {
    test("updates a user's password using their ID", async () => {
        const response = await request(app)
            .put(`/users/${testUser._id}`)
            .set({ authorization: 'JWT ' + testUser.accessToken })
            .send({ password: 'updatedpassword' });

        expect(response.statusCode).toBe(200);
    });
});
