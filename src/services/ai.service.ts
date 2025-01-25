import { CoreMessage, generateObject, generateText, streamObject, streamText } from 'ai';
import { AIConfig } from '../constants/ai.const';
import { AIServiceType, SchemaConfig } from '../types/ai.types';
import { getPublicIpAddress } from '../utils/ip.utils';
import geoip from 'geoip-lite';

class AIServiceProvider implements AIServiceType {
    async generateText(prompt: string) {
        try {
            const { text } = await generateText({
                ...AIConfig.generateText,
                prompt,
            });

            return text;
        } catch (error) {
            console.log('Error Trying To Generate Text From AI Model', error);
            throw error;
        }
    }

    async streamText(prompt: string) {
        try {
            const { textStream, text } = streamText({
                ...AIConfig.generateText,
                prompt,
            });

            for await (const textPart of textStream) {
                console.log(textPart);
            }

            return await text;
        } catch (error) {
            console.log('Error Trying Streaming Text From AI Model', error);
            throw error;
        }
    }

    async generateObject<T>(prompt: string, { schema, schemaName, schemaDescription }: SchemaConfig<T>) {
        try {
            const metadataMessages = await this.generateMetadataMessages();
            const configMessages = (AIConfig.generateObject.messages ?? []) as CoreMessage[];
            const userMessage: CoreMessage = { role: 'user', content: prompt };

            const messages: CoreMessage[] = [...configMessages, ...metadataMessages, userMessage];

            const { object, request } = await generateObject({
                ...AIConfig.generateObject,
                schema,
                schemaName,
                schemaDescription: schemaDescription ?? schema._def.description,
                messages,
            });

            console.log({ request });

            return object;
        } catch (error) {
            console.log('Error Trying To Generate Text From AI Model', error);
            throw error;
        }
    }

    async streamObject<T>(prompt: string, { schema, schemaName, schemaDescription }: SchemaConfig<T>) {
        try {
            const metadataMessages = await this.generateMetadataMessages();
            const configMessages = (AIConfig.generateObject.messages ?? []) as CoreMessage[];
            const userMessage: CoreMessage = { role: 'user', content: prompt };

            const messages: CoreMessage[] = [...configMessages, ...metadataMessages, userMessage];

            const { partialObjectStream, object } = streamObject({
                ...AIConfig.streamObject,
                schema,
                schemaName: schema._def.description,
                schemaDescription: schemaDescription ?? schema._def.description,
                messages,
            });

            for await (const partialObject of partialObjectStream) {
                console.log(partialObject);
            }

            return object;
        } catch (error) {
            console.log('Error Trying To Generate Text From AI Model', error);
            throw error;
        }
    }

    generateMetadataMessages = async (): Promise<CoreMessage[]> => {
        const currentDate = new Date(Date.now()).toLocaleString();
        const currentIpAddress = await getPublicIpAddress();
        const geo = geoip.lookup(currentIpAddress);

        return [
            {
                role: 'system',
                content: `Current Date is ${currentDate}`,
            },
            {
                role: 'system',
                content: `My current home starting trip country is ${geo?.country}`,
            },
        ];
    };

    static create() {
        return new AIServiceProvider();
    }
}

export const AIService = AIServiceProvider.create();
