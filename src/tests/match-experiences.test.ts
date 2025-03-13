import request from "supertest";
import { initApp } from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import { MatchExperienceRepository } from "../repositories/match-experience.repository";
import { UserRepository } from "../repositories/user.repository";

let app: Express;
let userAccessToken = "";
let matchExperienceId = "";
let createdBy = "";

const testMatchExperience = {
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
  picture: "testpicture",
};

beforeAll(async () => {
  app = await initApp();
  await UserRepository.deleteMany();
  await MatchExperienceRepository.deleteMany();

  // Register and login user
  await request(app).post("/auth/register").send(testUser);
  const loginResponse = await request(app).post("/auth/login").send(testUser);
  createdBy = loginResponse.body._id;
  userAccessToken = loginResponse.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("MatchExperience API Integration Tests", () => {
  test("creates a new matchExperience", async () => {
    const response = await request(app)
      .post("/match-experiences")
      .set("Authorization", `JWT ${userAccessToken}`)
      .send({
        ...testMatchExperience,
        createdBy,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(testMatchExperience.title);
    matchExperienceId = response.body._id;
    expect(matchExperienceId).toBeDefined();
  });

  test("retrieves all matchExperiences", async () => {
    const response = await request(app).get("/match-experiences");

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });

  test("retrieves a matchExperience by ID", async () => {
    const response = await request(app).get(
      `/match-experiences/${matchExperienceId}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(matchExperienceId);
  });

  test("updates a matchExperience", async () => {
    const response = await request(app)
      .put(`/match-experiences/${matchExperienceId}`)
      .set("Authorization", `JWT ${userAccessToken}`)
      .send({ title: "Updated MatchExperience Title" });

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Updated MatchExperience Title");
  });

  test("adds a comment to a matchExperience", async () => {
    const response = await request(app)
      .post(`/match-experiences/${matchExperienceId}/comments`)
      .set("Authorization", `JWT ${userAccessToken}`)
      .send({ userId: "testUserId", content: "Great match!" });

    expect(response.statusCode).toBe(200);
    expect(response.body.comments.length).toBeGreaterThanOrEqual(1);
  });

  test("likes a matchExperience", async () => {
    const response = await request(app)
      .post(`/match-experiences/${matchExperienceId}/like`)
      .set("Authorization", `JWT ${userAccessToken}`)
      .send({ userId: "testUserId" });

    expect(response.statusCode).toBe(200);
    expect(response.body.likes).toContain("testUserId");
  });

  test("unlikes a matchExperience", async () => {
    const response = await request(app)
      .post(`/match-experiences/${matchExperienceId}/unlike`)
      .set("Authorization", `JWT ${userAccessToken}`)
      .send({ userId: "testUserId" });

    expect(response.statusCode).toBe(200);
    expect(response.body.likes).not.toContain("testUserId");
  });

  test("deletes a matchExperience", async () => {
    const response = await request(app)
      .delete(`/match-experiences/${matchExperienceId}`)
      .set("Authorization", `JWT ${userAccessToken}`);

    expect(response.statusCode).toBe(200);
  });
});
