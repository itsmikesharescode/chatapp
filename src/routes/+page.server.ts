import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { ChatChamber } from '$lib/types';

export const load: PageServerLoad = async ({ locals: { prompAI } }) => {
	const initialReply = await prompAI('Hello');

	return {
		messages: {
			sender: 'Mike Torotot Omega Robot',
			text: initialReply,
			date: new Date().toLocaleTimeString()
		}
	};
};

export const actions: Actions = {
	sendChat: async ({ locals: { prompAI }, request }) => {
		const formData = await request.formData();
		const textField = JSON.parse(formData.get('textField') as string) as ChatChamber[];

		try {
			const reply = await prompAI(textField.map((v) => v.text).join(','));

			return {
				botReply: {
					sender: 'Mike Torotot Omega Robot',
					text: reply,
					date: new Date().toLocaleTimeString()
				}
			};
		} catch (error) {
			return fail(401, { msg: 'There is an error, check your server' });
		}
	}
};
