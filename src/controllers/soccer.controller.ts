import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import { Country, League, Team, Venue } from "../types/soccer.types";

dotenv.config();

export const currSeason = process.env.SEASON || new Date().getFullYear() - 1;

export const soccerApiClient = axios.create({
  baseURL: "https://v3.football.api-sports.io",
  headers: {
    "x-apisports-key": process.env.API_KEY || "",
  },
});

export const soccerController = {
  getCountries: async (_req: Request, res: Response) => {
    const response = await soccerApiClient.get("/countries");

    if (response.data.errors.length) {
      res.status(500).json({
        message: "Error fetching countries",
        error: response.data.errors,
      });
    }

    res.status(200).json(response.data.response as Country[]);
  },

  getLeagues: async (req: Request, res: Response) => {
    const { country } = req.query;

    const response = await soccerApiClient.get("/leagues", {
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

    res
      .status(200)
      .json(response.data.response as { league: League; country: Country }[]);
  },

  getVenues: async (req: Request, res: Response) => {
    const { country } = req.query;

    const response = await soccerApiClient.get("/venues", {
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

    res.status(200).json(response.data.response as Venue[]);
  },

  getTeams: async (req: Request, res: Response) => {
    const { league } = req.query;

    const response = await soccerApiClient.get("/teams", {
      params: {
        league,
        season: currSeason,
      },
    });

    if (response.data.errors.length) {
      res.status(500).json({
        message: "Error fetching teams",
        error: response.data.errors,
      });
    }

    res
      .status(200)
      .json(response.data.response as { team: Team; venue: Venue }[]);
  },
};
