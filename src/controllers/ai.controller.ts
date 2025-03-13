import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';

export const aiController = {
    generateText: async (req: Request, res: Response): Promise<Response> => {
        try {
            const prompt = req.query.prompt as string;
            const response = await AIService.generateText(prompt);
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error fetching response from AI:', error);
            return res.status(500).json({ error: 'Error fetching response from AI' });
        }
    },
};
