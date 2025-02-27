import { Request, Response } from "express";
import { MatchRepository } from "../repositories/match.repository";

export const matchController = {
  // Create a new match
  createMatch: async (req: Request, res: Response) => {
    try {
      const match = await MatchRepository.create(req.body);
      res.status(200).send(match);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  // Get all matches
  getAll: async (req: Request, res: Response) => {
    const requestQuery = req.query;
    let query = {};

    if (requestQuery.homeTeam || requestQuery.awayTeam) {
      query = {
        $or: [
          { homeTeam: { $regex: requestQuery.homeTeam, $options: "i" } },
          { awayTeam: { $regex: requestQuery.awayTeam, $options: "i" } },
        ],
      };
    }

    try {
      const matches = await MatchRepository.find(query);
      res.status(200).send(matches);
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
