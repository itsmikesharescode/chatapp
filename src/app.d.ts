import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Session } from '@supabase/supabase-js';
import OpenAI from 'openai';

declare global {
	namespace App {
		interface Locals {
			prompAI: (content: string) => Promise<Stream<OpenAI.Chat.Completions.ChatCompletionChunk>>;
		}
	}
}

export {};
