import { google } from '@ai-sdk/google';
import { AIGlobalConfig, AIMethodConfigKeys, AIServiceMethod, AIServiceMethodsConfig } from '../types/ai.types';

const model = google('gemini-2.0-flash-exp');

export const AIConfigParams = ['model', 'maxTokens', 'messages', 'temperature'] satisfies AIMethodConfigKeys[];

export const GlobalConfig: AIGlobalConfig = {
    model,
    maxTokens: 1000,
    temperature: 0,
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
