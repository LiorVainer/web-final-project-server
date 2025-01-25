import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';
import { FiltersSchema } from '../models/recommandation.model';

export const generateText = async (req: Request, res: Response) => {
    try {
        const text = await AIService.generateText(req.body.prompt);
        res.status(200).send(text);
    } catch (err) {
        res.status(500).send({
            message: 'Error generating response text from AI model',
            error: err,
        });
    }
};

export const streamText = async (req: Request, res: Response) => {
    try {
        const text = await AIService.streamText(req.body.prompt);
        res.status(200).send(text);
    } catch (err) {
        res.status(500).send({
            message: 'Error generating response stream from AI model',
            error: err,
        });
    }
};

export const generateObject = async (req: Request, res: Response) => {
    try {
        const object = await AIService.generateObject(req.body.prompt, {
            schema: FiltersSchema,
            saveOutputToFile: true,
        });
        res.status(200).send(object);
    } catch (err) {
        res.status(500).send({
            message: 'Error generating response object from AI model',
            error: err,
        });
    }
};

export const generateStreamObject = async (req: Request, res: Response) => {
    try {
        const object = await AIService.streamObject(req.body.prompt, {
            schema: FiltersSchema,
            saveOutputToFile: true,
        });
        res.status(200).send(object);
    } catch (err) {
        res.status(500).send({
            message: 'Error generating response object stream from AI model',
            error: err,
        });
    }
};
