import { google } from '@ai-sdk/google';
import { AIGlobalConfig, AIMethodConfigKeys, AIServiceMethod, AIServiceMethodsConfig } from '../types/ai.types';

const model = google(process.env.AI_MODEL ?? 'gemini-2.0-flash-exp');

export const AIConfigParams = ['model', 'maxTokens', 'messages', 'temperature'] satisfies AIMethodConfigKeys[];

export const GlobalConfig: AIGlobalConfig = {
    model,
    maxTokens: parseFloat(process.env.AI_MAX_TOKENS ?? '1000'),
    temperature: parseFloat(process.env.AI_TEMPERATURE ?? '0.5'),
};

export const AIConfig: AIServiceMethodsConfig = {
    generateText: {
        ...GlobalConfig,
    },
    streamText: {
        ...GlobalConfig,
    },
    generateObject: {
        ...GlobalConfig,
    },
    streamObject: {
        ...GlobalConfig,
    },
};

export const AIServiceMethodToKebabCase = {
    generateObject: 'generate-object',
    generateText: 'generate-text',
    streamObject: 'stream-object',
    streamText: 'stream-text',
} satisfies Record<AIServiceMethod, string>;
