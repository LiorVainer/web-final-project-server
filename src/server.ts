import bodyParser from "body-parser";
import express, { Express } from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.route";
import usersRoutes from "./routes/users.route";
import matchExperienceRoutes from "./routes/matchExperience.route";
import dotenv from "dotenv";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import cors from "cors";
import { handleErrorMiddleware } from "./middlewares/error.middleware";
import fileRoutes from "./routes/file.route";
import soccerRoutes from "./routes/soccer.route";

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: " Sport Scanner REST API",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./src/routes/*.ts"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/matchExperiences", matchExperienceRoutes);
app.use("/soccer", soccerRoutes);
app.use("/file", fileRoutes);
app.use("/public", express.static("public"));

export const initApp = async (): Promise<Express> => {
  const dbConnect = process.env.DB_CONNECT;
  if (!dbConnect) {
    throw new Error("DB_CONNECT is not defined in .env file");
  }

  try {
    await mongoose.connect(dbConnect);
    return app;
  } catch (error) {
    throw error;
  }
};

app.use(handleErrorMiddleware);
