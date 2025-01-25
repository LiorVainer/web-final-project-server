import { google } from '@ai-sdk/google';
import { AIGlobalConfig, AIMethodConfigKeys, AIServiceMethodsConfig } from '../types/ai.types';

const model = google('gemini-2.0-flash-exp');

export const AIConfigParams = ['model', 'maxTokens', 'messages'] satisfies AIMethodConfigKeys[];

export const GlobalConfig: AIGlobalConfig = {
    model,
    maxTokens: 1000,
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
