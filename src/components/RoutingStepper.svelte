<script lang="ts">
	/**
	 * Steps through the same direct message on Meshtastic and MeshCore.
	 * Motion only happens in response to the buttons. Every step's meaning
	 * is carried by the text captions (announced via aria-live); the SVGs
	 * are decorative.
	 */
	type Step = { mt: string; mc: string };
	type Props = {
		steps: Step[];
		labels: {
			prev: string;
			next: string;
			reset: string;
			stepOf: string;
			legendClient: string;
			legendCompanion: string;
			legendRepeater: string;
			legendTx: string;
			legendQuiet: string;
		};
	};

	let { steps, labels }: Props = $props();
	let i = $state(0);
	const total = $derived(steps.length);

	// Seven radios along a ridge; 2 and 4 sit on high ground.
	const X = [40, 120, 200, 280, 360, 440, 520];
	const Y = [104, 96, 58, 92, 48, 94, 104];
	const NAMES = ['A', '1', '2', '3', '4', '5', 'B'];
	const terrain =
		'M0 124 C40 120 80 112 120 108 C160 104 175 66 200 66 C225 66 240 104 280 104 C320 104 335 56 360 56 C385 56 400 102 440 104 C480 106 520 116 560 120 L560 150 L0 150 Z';

	type Lane = {
		tx: number[][];
		edges: [number, number][][];
		/** Nodes that heard the packet but stay quiet (could have relayed). */
		quiet: number[][];
		kind: ('client' | 'companion' | 'repeater')[];
	};

	const common = {
		tx: [[0], [2], [4], [0, 2, 4]],
		edges: [
			[
				[0, 1],
				[0, 2],
			],
			[
				[2, 1],
				[2, 3],
				[2, 4],
			],
			[
				[4, 3],
				[4, 5],
				[4, 6],
			],
			[
				[0, 2],
				[2, 4],
				[4, 6],
			],
		] as [number, number][][],
	};

	const lanes: { id: 'mt' | 'mc'; name: string; lane: Lane }[] = [
		{
			id: 'mt',
			name: 'Meshtastic',
			lane: {
				...common,
				quiet: [[], [1], [3], []],
				kind: ['client', 'client', 'client', 'client', 'client', 'client', 'client'],
			},
		},
		{
			id: 'mc',
			name: 'MeshCore',
			lane: {
				...common,
				quiet: [[], [], [], []],
				kind: [
					'companion',
					'companion',
					'repeater',
					'companion',
					'repeater',
					'companion',
					'companion',
				],
			},
		},
	];

	const reached = (step: number) => step >= 2;
	const stepLabel = $derived(
		labels.stepOf.replace('{n}', String(i + 1)).replace('{total}', String(total)),
	);
</script>

<div class="stepper">
	<div class="stepper__controls">
		<p class="stepper__count mono" aria-hidden="true">{stepLabel}</p>
		<div class="stepper__buttons">
			<button
				type="button"
				class="btn btn--secondary"
				onclick={() => (i = 0)}
				aria-disabled={i === 0}
			>
				{labels.reset}
			</button>
			<button
				type="button"
				class="btn btn--secondary"
				onclick={() => (i = Math.max(0, i - 1))}
				aria-disabled={i === 0}
			>
				{labels.prev}
			</button>
			<button
				type="button"
				class="btn btn--primary"
				onclick={() => (i = Math.min(total - 1, i + 1))}
				aria-disabled={i === total - 1}
			>
				{labels.next}
			</button>
		</div>
	</div>

	<div class="lanes" aria-live="polite">
		<p class="visually-hidden">{stepLabel}</p>
		{#each lanes as { id, name, lane } (id)}
			<figure class="lane lane--{id}">
				<figcaption>
					<span class="lane__name">{name}</span>
					<span class="lane__text">{steps[i][id]}</span>
				</figcaption>
				<svg viewBox="0 0 560 150" aria-hidden="true" focusable="false">
					<path d={terrain} class="terrain" />
					{#each lane.edges[i] as [a, b] (`${a}-${b}`)}
						<line x1={X[a]} y1={Y[a]} x2={X[b]} y2={Y[b]} class="edge" />
					{/each}
					{#each X as x, n (n)}
						{@const isTx = lane.tx[i].includes(n)}
						{@const isQuiet = lane.quiet[i].includes(n)}
						{@const kind = lane.kind[n]}
						<g
							class="node node--{kind}"
							class:is-tx={isTx}
							class:is-quiet={isQuiet}
							class:is-dest={n === 6 && reached(i)}
						>
							{#if isTx}
								<circle cx={x} cy={Y[n]} r="20" class="halo" />
							{/if}
							{#if kind === 'repeater'}
								<rect x={x - 10} y={Y[n] - 10} width="20" height="20" class="shape" />
							{:else}
								<circle cx={x} cy={Y[n]} r={kind === 'companion' ? 7 : 10} class="shape" />
							{/if}
							<text {x} y={Y[n] - 16} text-anchor="middle">{NAMES[n]}</text>
						</g>
					{/each}
				</svg>
			</figure>
		{/each}
	</div>

	<ul class="legend mono">
		<li><span class="key key--client" aria-hidden="true"></span>{labels.legendClient}</li>
		<li><span class="key key--companion" aria-hidden="true"></span>{labels.legendCompanion}</li>
		<li><span class="key key--repeater" aria-hidden="true"></span>{labels.legendRepeater}</li>
		<li><span class="key key--tx" aria-hidden="true"></span>{labels.legendTx}</li>
		<li><span class="key key--quiet" aria-hidden="true"></span>{labels.legendQuiet}</li>
	</ul>
</div>

<style>
	.stepper {
		display: grid;
		gap: var(--s-5);
	}

	.stepper__controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--s-3) var(--s-5);
	}

	.stepper__count {
		color: var(--c-text-2);
	}

	.stepper__buttons {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-2);
	}

	.stepper__buttons .btn {
		min-height: 44px;
		padding: 0.5rem 1rem;
		font-size: var(--t-sm);
		cursor: pointer;
	}

	.stepper__buttons .btn[aria-disabled='true'] {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.lanes {
		display: grid;
		gap: var(--s-4);
	}

	@media (min-width: 64rem) {
		.lanes {
			grid-template-columns: 1fr 1fr;
		}
	}

	.lane {
		--tone: var(--c-accent);
		margin: 0;
		display: grid;
		gap: var(--s-3);
		padding: var(--s-4);
		border: 1px solid var(--c-border);
		border-top: 2px solid var(--tone);
		border-radius: var(--r-card);
		background: var(--c-surface);
	}

	.lane--mc {
		--tone: var(--c-accent-2);
	}

	figcaption {
		display: grid;
		gap: var(--s-1);
		min-height: 5.25rem;
	}

	.lane__name {
		font-family: var(--f-display);
		font-weight: 650;
		font-size: var(--t-lg);
	}

	.lane__text {
		color: var(--c-text-2);
		font-size: var(--t-sm);
	}

	svg {
		width: 100%;
		height: auto;
	}

	.terrain {
		fill: var(--c-surface-2);
	}

	.edge {
		stroke: var(--tone);
		stroke-width: 2;
		stroke-dasharray: 6 5;
		stroke-linecap: round;
	}

	.shape {
		fill: var(--c-bg);
		stroke: var(--c-text-2);
		stroke-width: 2;
		transition:
			fill 200ms var(--ease-out),
			stroke 200ms var(--ease-out);
	}

	.node--repeater .shape {
		stroke: var(--tone);
		stroke-width: 2.5;
	}

	.is-tx .shape {
		fill: var(--tone);
		stroke: var(--tone);
	}

	.halo {
		fill: none;
		stroke: var(--tone);
		stroke-width: 1.5;
		opacity: 0.6;
	}

	.is-quiet .shape {
		stroke-dasharray: 3 3;
		stroke: var(--c-text);
	}

	.is-dest .shape {
		stroke: var(--c-text);
		stroke-width: 3;
	}

	text {
		font-family: var(--f-mono);
		font-size: 15px;
		font-weight: 500;
		fill: var(--c-text);
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-2) var(--s-5);
		color: var(--c-text-2);
	}

	.legend li {
		display: inline-flex;
		align-items: center;
		gap: var(--s-2);
	}

	.key {
		display: inline-block;
		flex: none;
		border: 2px solid var(--c-text-2);
	}

	.key--client {
		width: 12px;
		height: 12px;
		border-radius: 50%;
	}

	.key--companion {
		width: 9px;
		height: 9px;
		border-radius: 50%;
	}

	.key--repeater {
		width: 11px;
		height: 11px;
		border-color: var(--c-accent-2);
	}

	.key--quiet {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border-style: dashed;
		border-color: var(--c-text);
	}

	.key--tx {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border-color: var(--c-accent);
		background: var(--c-accent);
	}
</style>
