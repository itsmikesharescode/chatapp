<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { type SubmitFunction } from '@sveltejs/kit';
	import { LoaderCircle, Send } from 'lucide-svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { onMount } from 'svelte';

	const { data } = $props();

	interface ChatChamber {
		sender: string;
		text: string;
	}

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
				data: { botReply: { sender: string; text: string } };
			};

			switch (status) {
				case 200:
					chatChamber.push(botReply);
					sendChatLoader = false;
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
</script>

<div class="mx-auto p-[1rem] md:max-w-[800px]">
	<div class="flex min-h-screen flex-col gap-[5px]">
		{#each chatChamber as chamber}
			<div
				class={chamber.sender !== 'Mike Torotot Omega Robot'
					? 'flex flex-row-reverse p-2'
					: 'flex p-2'}
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
						<p>{chamber.sender}</p>
					</div>

					<div class=" max-w-fit rounded-lg border-[1px] bg-secondary p-[10px]">
						<p>{chamber.text}</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
	<form method="post" action="?/sendChat" use:enhance={sendChat} class="sticky bottom-5">
		<div class="flex items-center gap-[10px]">
			<Textarea
				class="border-slate-700"
				disabled={sendChatLoader}
				name="textField"
				placeholder="Say something..."
				bind:value={textField}
			/>
			<Button
				disabled={sendChatLoader}
				type="submit"
				onclick={() => {
					chatChamber.push({
						sender: 'Mike',
						text: textField
					});

					textField = '';
				}}
			>
				{#if sendChatLoader}
					<LoaderCircle class="animate-spin" />
				{:else}
					<Send />
				{/if}
			</Button>
		</div>
	</form>
</div>
