<!--
	DecryptedText, from Svelte Bits (https://github.com/DavidHDev/svelte-bits).
	Copyright (c) 2026 David Haz. MIT + Commons Clause License Condition v1.0.

	Adapted for PRMSH:
	- Screen readers always get the final text (upstream exposed the
	  scrambled string to assistive tech mid-animation).
	- Runs once when scrolled into view; hover/click modes removed.
	- Skipped entirely under prefers-reduced-motion.
	- Optional start delay so several labels can decode in sequence.
	- Server render outputs the final text, so no layout shift and no
	  scrambled text without JS.
-->
<script lang="ts">
	import { onMount } from 'svelte';

	type Props = {
		text: string;
		/** ms between frames */
		speed?: number;
		/** ms to wait after entering the viewport */
		delay?: number;
		characters?: string;
		class?: string;
	};

	let {
		text,
		speed = 38,
		delay = 0,
		characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·-',
		class: className = '',
	}: Props = $props();

	// svelte-ignore state_referenced_locally
	let display = $state(text);
	let revealed = $state(Number.POSITIVE_INFINITY);
	let el: HTMLSpanElement | undefined = $state();

	const pool = $derived(characters.split(''));

	function scramble(count: number) {
		return text
			.split('')
			.map((ch, i) =>
				ch === ' ' || i < count ? ch : pool[Math.floor(Math.random() * pool.length)],
			)
			.join('');
	}

	function run() {
		revealed = 0;
		display = scramble(0);
		const id = setInterval(() => {
			revealed += 1;
			if (revealed >= text.length) {
				clearInterval(id);
				display = text;
				revealed = Number.POSITIVE_INFINITY;
				return;
			}
			display = scramble(revealed);
		}, speed);
		return () => clearInterval(id);
	}

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !el) return;
		let stop: (() => void) | undefined;
		let timer: ReturnType<typeof setTimeout> | undefined;
		const io = new IntersectionObserver(
			(entries) => {
				if (!entries.some((e) => e.isIntersecting)) return;
				io.disconnect();
				timer = setTimeout(() => (stop = run()), delay);
			},
			{ threshold: 0.1 },
		);
		io.observe(el);
		return () => {
			io.disconnect();
			clearTimeout(timer);
			stop?.();
		};
	});
</script>

<span bind:this={el} class="decrypt {className}">
	<span class="visually-hidden">{text}</span>
	<span aria-hidden="true"
		>{#each display.split('') as char, i (i)}<span class:pending={i >= revealed}>{char}</span
			>{/each}</span
	>
</span>

<style>
	.decrypt {
		display: inline-block;
		white-space: pre;
	}

	.pending {
		color: var(--c-text-2);
		opacity: 0.55;
	}
</style>
