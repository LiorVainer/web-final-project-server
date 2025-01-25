import { generateObject, generateText, streamObject, streamText } from 'ai';
import { ZodSchema } from 'zod';
import { AIConfigParams } from '../constants/ai.const';

export type SchemaConfig<T> = {
    schema: ZodSchema<T>;
    schemaName?: string;
    schemaDescription?: string;
};

type AIServiceMethods = {
    generateText: typeof generateText;
    streamText: typeof streamText;
    generateObject: typeof generateObject;
    streamObject: typeof streamObject;
};

type AIServiceMethod = keyof AIServiceMethods;

export type AIServiceType = {
    [K in keyof AIServiceMethods]: (...args: any) => any;
};

export type AIMethodConfigKeys = keyof Parameters<typeof streamText>[0];

const BaseServiceMethod = 'generateText' satisfies AIServiceMethod;

export type AIGlobalConfig = Pick<
    Parameters<AIServiceMethods[typeof BaseServiceMethod]>[0],
    (typeof AIConfigParams)[number]
>;

export type AIServiceMethodsConfig = {
    [K in keyof AIServiceMethods]: Pick<Parameters<AIServiceMethods[K]>[0], (typeof AIConfigParams)[number]>;
};
