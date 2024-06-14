<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { type SubmitFunction } from '@sveltejs/kit';
	import { LoaderCircle, Send } from 'lucide-svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { scale } from 'svelte/transition';
	import type { ChatChamber } from '$lib/types.js';

	const { data } = $props();

	let chatChamber: ChatChamber[] = $state([]);
	let textField = $state('');
	let sendChatLoader = $state(false);

	const sendChat: SubmitFunction = () => {
		sendChatLoader = true;
		return async ({ result, update }) => {
			const {
				status,
				data: { botReply }
			} = result as {
				status: number;
				type: string;
				data: { botReply: ChatChamber };
			};

			switch (status) {
				case 200:
					chatChamber.push(botReply);
					sendChatLoader = false;
					textField = '';
					break;

				case 400:
					sendChatLoader = false;
					break;

				case 401:
					sendChatLoader = false;
					break;
			}
			await update();
		};
	};

	onMount(() => {
		chatChamber.push(data.messages);
	});

	function handleSubmit() {
		chatChamber.push({
			sender: 'Mike',
			text: textField,
			date: new Date().toLocaleTimeString()
		});
	}
</script>

<div class="mx-auto p-[1rem] md:max-w-[800px]">
	<div class="flex min-h-screen flex-col gap-[5px]">
		{#each chatChamber as chamber (chamber)}
			<div
				class={chamber.sender !== 'Mike Torotot Omega Robot'
					? 'flex flex-row-reverse p-2'
					: 'flex p-2'}
				animate:flip={{ duration: 700 }}
				transition:scale
			>
				<div class="grid gap-[10px]">
					<div
						class={chamber.sender !== 'Mike Torotot Omega Robot'
							? 'flex flex-row-reverse items-center gap-[10px]'
							: 'flex items-center gap-[10px]'}
					>
						<Avatar.Root>
							<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
							<Avatar.Fallback>CN</Avatar.Fallback>
						</Avatar.Root>
						<div class="">
							<p class="font-semibold">{chamber.sender}</p>
							<p class="text-sm text-muted-foreground">{chamber.date}</p>
						</div>
					</div>

					<div
						class=" max-w-fit rounded-lg border-[1px] {chamber.sender !== 'Mike Torotot Omega Robot'
							? 'bg-secondary'
							: 'bg-outline'} p-[10px]"
					>
						<pre style="white-space: pre-wrap;">{chamber.text}</pre>
					</div>
				</div>
			</div>
		{/each}
	</div>
	<form
		onsubmit={handleSubmit}
		method="post"
		action="?/sendChat"
		use:enhance={sendChat}
		class="sticky bottom-5 mt-[5dvh]"
	>
		<div class="flex items-center gap-[10px]">
			<input name="textField" type="hidden" value={JSON.stringify(chatChamber)} />
			<Textarea
				class="border-slate-700"
				disabled={sendChatLoader}
				placeholder="Say something..."
				bind:value={textField}
			/>
			<Button disabled={sendChatLoader || textField.length < 1} type="submit">
				{#if sendChatLoader}
					<LoaderCircle class="animate-spin" />
				{:else}
					<Send />
				{/if}
			</Button>
		</div>
	</form>
</div>
