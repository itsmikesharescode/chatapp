import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { prompAI } }) => {
	const reply = await prompAI('wew');

	return {
		reply
	};
};
