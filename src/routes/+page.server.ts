import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { prompAI } }) => {
	const initialReply = await prompAI(
		'Give me some trivia about svelte and then persuade me. maximum of 20 words.'
	);

	return {
		messages: { sender: 'Mike Torotot Omega Robot', text: initialReply }
	};
};

export const actions: Actions = {
	sendChat: async ({ locals: { prompAI }, request }) => {
		const formData = await request.formData();
		const textField = formData.get('textField') as string;

		try {
			const reply = await prompAI(textField);

			return {
				botReply: { sender: 'Mike Torotot Omega Robot', text: reply }
			};
		} catch (error) {
			return fail(401, { msg: 'There is an error, check your server' });
		}
	}
};
