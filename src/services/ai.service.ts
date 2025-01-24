import { google } from "@ai-sdk/google";
import {
  generateObject,
  generateText,
  smoothStream,
  streamObject,
  streamText,
} from "ai";
import { FiltersSchema } from "../models/recommandation.model";
import { ZodSchema } from "zod";

const model = google("gemini-1.5-pro-latest");

type SchemaConfig = {
  schema: ZodSchema;
  schemaName?: string;
  schemaDescription?: string;
};

export const AIService = {
  async generateText(prompt: string) {
    try {
      const { text } = await generateText({
        model,
        prompt,
      });

      return text;
    } catch (error) {
      console.log("Error Trying To Generate Text From AI Model", error);
      throw error;
    }
  },

  async streamText(prompt: string) {
    try {
      const messages = [];
      const { textStream, fullStream } = streamText({
        model,
        prompt,
        onFinish: (event) => {
          console.log("Stream Finished With Reason", event.finishReason);
        },
        // experimental_transform: smoothStream(),
      });

      for await (const textPart of textStream) {
        console.log(textPart);
        messages.push(textPart);
      }

      return messages.join("\n");
    } catch (error) {
      console.log("Error Trying Streaming Text From AI Model", error);
      throw error;
    }
  },

  async generateObject(
    prompt: string,
    { schema, schemaName, schemaDescription }: SchemaConfig
  ) {
    try {
      const { object } = await generateObject({
        model,
        schema,
        schemaName,
        schemaDescription: schemaDescription ?? schema._def.description,
        prompt,
        maxTokens: 1000,
      });

      return object;
    } catch (error) {
      console.log("Error Trying To Generate Text From AI Model", error);
      throw error;
    }
  },

  async streamObject(
    prompt: string,
    { schema, schemaName, schemaDescription }: SchemaConfig
  ) {
    try {
      const { partialObjectStream, object } = await streamObject({
        model,
        schema,
        schemaName: schema._def.description,
        schemaDescription: schemaDescription ?? schema._def.description,
        prompt,
        maxTokens: 1000,
      });

      for await (const partialObject of partialObjectStream) {
        console.log(partialObject);
      }

      return object;
    } catch (error) {
      console.log("Error Trying To Generate Text From AI Model", error);
      throw error;
    }
  },
};
