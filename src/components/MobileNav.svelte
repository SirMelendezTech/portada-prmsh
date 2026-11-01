<script lang="ts">
	import { onMount } from 'svelte';

	type Item = {
		label: string;
		href: string;
		target?: string;
		rel?: string;
		lang?: string;
		'aria-current'?: 'page';
	};

	type Props = {
		items: Item[];
		cta: Item;
		openLabel: string;
		closeLabel: string;
		newTabLabel: string;
		navLabel: string;
	};

	let { items, cta, openLabel, closeLabel, newTabLabel, navLabel }: Props = $props();

	let open = $state(false);
	let button: HTMLButtonElement | undefined = $state();
	let panel: HTMLDivElement | undefined = $state();

	function close(returnFocus = false) {
		open = false;
		if (returnFocus) button?.focus();
	}

	function onKeydown(e: KeyboardEvent) {
		if (open && e.key === 'Escape') close(true);
	}

	function onDocClick(e: MouseEvent) {
		if (!open) return;
		const t = e.target as Node;
		if (panel?.contains(t) || button?.contains(t)) return;
		close();
	}

	$effect(() => {
		if (open) panel?.querySelector<HTMLElement>('a')?.focus();
	});

	onMount(() => {
		// Close if the viewport grows past the mobile breakpoint.
		const mq = window.matchMedia('(min-width: 48rem)');
		const onChange = () => mq.matches && close();
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});
</script>

<svelte:window onkeydown={onKeydown} onclick={onDocClick} />

<div class="mnav">
	<button
		bind:this={button}
		class="mnav__toggle"
		type="button"
		aria-expanded={open}
		aria-controls="mnav-panel"
		onclick={() => (open = !open)}
	>
		<span class="visually-hidden">{open ? closeLabel : openLabel}</span>
		<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
			{#if open}
				<path
					d="M6 6l12 12M18 6 6 18"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
				/>
			{:else}
				<path d="M4 8h16M4 16h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
			{/if}
		</svg>
	</button>

	<div id="mnav-panel" class="mnav__panel" bind:this={panel} hidden={!open}>
		<nav aria-label={navLabel}>
			<ul>
				{#each items as item (item.href)}
					<li>
						<a
							href={item.href}
							target={item.target}
							rel={item.rel}
							lang={item.lang}
							aria-current={item['aria-current']}
							onclick={() => close()}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
		<a class="btn btn--primary mnav__cta" href={cta.href} target={cta.target} rel={cta.rel}>
			{cta.label}
			<span class="visually-hidden">{newTabLabel}</span>
		</a>
	</div>
</div>

<style>
	.mnav__toggle {
		display: grid;
		place-items: center;
		width: 48px;
		height: 48px;
		margin-right: -12px;
		border: 0;
		background: transparent;
		color: var(--c-text);
		cursor: pointer;
		border-radius: var(--r-control);
	}

	.mnav__panel {
		position: absolute;
		left: 0;
		right: 0;
		top: 100%;
		padding: var(--s-4) var(--gutter) var(--s-6);
		background: var(--c-bg);
		border-bottom: 1px solid var(--c-border);
	}

	.mnav__panel[hidden] {
		display: none;
	}

	.mnav__panel a:not(.btn) {
		display: flex;
		align-items: center;
		min-height: 52px;
		border-bottom: 1px solid var(--c-border);
		color: var(--c-text);
		text-decoration: none;
		font-size: var(--t-lg);
	}

	.mnav__cta {
		width: 100%;
		margin-top: var(--s-5);
	}
</style>
