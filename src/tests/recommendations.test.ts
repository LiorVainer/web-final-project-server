import request from "supertest";
import { initApp } from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import { RecommendationRepository } from "../repositories/recommendation.repository";
import { UserRepository } from "../repositories/user.repository";

let app: Express;
let userAccessToken = "";
let recommendationId = "";
let createdBy = "";

const testRecommendation = {
  homeTeam: "Team A",
  awayTeam: "Team B",
  matchDate: new Date().toISOString(),
  league: "Premier League",
  country: "England",
  stadium: "Wembley Stadium",
  title: "Exciting Match!",
  description: "This will be an intense match between top teams.",
  likes: [],
  comments: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const testUser = {
  email: "test1@user.com",
  password: "testpassword",
  username: "testuser",
  pictureId: "testpicture",
};

beforeAll(async () => {
  app = await initApp();
  await UserRepository.deleteMany();
  await RecommendationRepository.deleteMany();

  // Register and login user
  await request(app).post("/auth/register").send(testUser);
  const loginResponse = await request(app).post("/auth/login").send(testUser);
  createdBy = loginResponse.body._id;
  userAccessToken = loginResponse.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Recommendation API Integration Tests", () => {
  test("creates a new recommendation", async () => {
    const response = await request(app)
      .post("/recommendations")
      .set("Authorization", `JWT ${userAccessToken}`)
      .send({
        ...testRecommendation,
        createdBy,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(testRecommendation.title);
    recommendationId = response.body._id;
    expect(recommendationId).toBeDefined();
  });

  test("retrieves all recommendations", async () => {
    const response = await request(app).get("/recommendations");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  test("retrieves a recommendation by ID", async () => {
    const response = await request(app).get(
      `/recommendations/${recommendationId}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(recommendationId);
  });

  test("updates a recommendation", async () => {
    const response = await request(app)
      .put(`/recommendations/${recommendationId}`)
      .set("Authorization", `JWT ${userAccessToken}`)
      .send({ title: "Updated Recommendation Title" });

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Updated Recommendation Title");
  });

  test("adds a comment to a recommendation", async () => {
    const response = await request(app)
      .post(`/recommendations/${recommendationId}/comments`)
      .set("Authorization", `JWT ${userAccessToken}`)
      .send({ userId: "testUserId", content: "Great match!" });


    expect(response.statusCode).toBe(200);
    expect(response.body.comments.length).toBeGreaterThanOrEqual(1);
  });

  test("likes a recommendation", async () => {
    const response = await request(app)
      .post(`/recommendations/${recommendationId}/like`)
      .set("Authorization", `JWT ${userAccessToken}`)
      .send({ userId: "testUserId" });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.likes).toContain("testUserId");
  });

  test("unlikes a recommendation", async () => {
    const response = await request(app)
      .post(`/recommendations/${recommendationId}/unlike`)
      .set("Authorization", `JWT ${userAccessToken}`)
      .send({ userId: "testUserId" });

    expect(response.statusCode).toBe(200);
    expect(response.body.likes).not.toContain("testUserId");
  });

  test("deletes a recommendation", async () => {
    const response = await request(app)
      .delete(`/recommendations/${recommendationId}`)
      .set("Authorization", `JWT ${userAccessToken}`);

    expect(response.statusCode).toBe(200);
  });
});
