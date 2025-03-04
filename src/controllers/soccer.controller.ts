import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const axiosInstance = axios.create({
  baseURL: "https://v3.football.api-sports.io",
  headers: {
    "x-apisports-key": process.env.API_KEY || "",
  },
});

export const soccerController = {
  getCountries: async (_req: Request, res: Response) => {
    const response = await axiosInstance.get("/countries");

    if (response.data.errors.length) {
      res.status(500).json({
        message: "Error fetching countries",
        error: response.data.errors,
      });
    }

    res.status(200).json(response.data.response);
  },

  getLeagues: async (req: Request, res: Response) => {
    const { country } = req.query;

    const response = await axiosInstance.get("/leagues", {
      params: {
        country,
      },
    });

    if (response.data.errors.length) {
      res.status(500).json({
        message: "Error fetching leagues",
        error: response.data.errors,
      });
    }

    res.status(200).json(response.data.response);
  },

  getVenues: async (req: Request, res: Response) => {
    const { country } = req.query;

    const response = await axiosInstance.get("/venues", {
      params: {
        country,
      },
    });

    if (response.data.errors.length) {
      res.status(500).json({
        message: "Error fetching venues",
        error: response.data.errors,
      });
    }

    res.status(200).json(response.data.response);
  },

  getTeams: async (req: Request, res: Response) => {
    const { league } = req.query;

    const response = await axiosInstance.get("/teams", {
      params: {
        league,
        season: 2024,
      },
    });

    if (response.data.errors.length) {
      res.status(500).json({
        message: "Error fetching teams",
        error: response.data.errors,
      });
    }

    res.status(200).json(response.data.response);
  },
};
