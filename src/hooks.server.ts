import type { Handle } from '@sveltejs/kit';
import OpenAI from 'openai';

const nvdiaKey: string = import.meta.env.VITE_NVDIA_KEY;
const nvdiaUrl: string = import.meta.env.VITE_NVDIA_URL;

export const handle: Handle = async ({ event, resolve }) => {
	const openai = new OpenAI({
		apiKey: nvdiaKey,
		baseURL: nvdiaUrl
	});

	event.locals.prompAI = async (content: string) => {
		const completion = await openai.chat.completions.create({
			model: 'meta/llama3-70b-instruct',
			messages: [{ role: 'user', content }],
			temperature: 0.5,
			top_p: 1,
			max_tokens: 1024,
			stream: true
		});

		let responseText = '';
		for await (const chunk of completion) {
			responseText += chunk.choices[0]?.delta?.content || '';
		}

		return responseText;
	};

	return resolve(event);
};
