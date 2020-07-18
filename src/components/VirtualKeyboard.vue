<template>
	<div class="keyboard">
		<div
			class="key no-drag"
			v-for="({ note, noteName, octave, halftone, after }, i) in notes"
			:key="i"
		>
			<div class="white" :class="classes(note)" @click="keyPressed(note)">
				<span v-if="noteName === 'C'">
					{{ `C${octave}` }}
				</span>
				<span v-else class="text-gray-400">
					{{ noteName }}
				</span>
			</div>
			<div
				v-if="halftone"
				class="black"
				:class="classes(halftone)"
				@click="keyPressed(halftone)"
			>
				<span class="key-labels">
					<span v-if="sharps">{{ noteName }}♯</span>
					<span v-else>{{ after }}♭</span>
				</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { toMidi } from '@tonaljs/midi';

const scale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const NOTES = Array(4)
	.fill(scale)
	.flat()
	.map((n, i) => {
		let octave = Math.floor(i / 7);
		const step = i - octave * 7;
		octave += 2;
		const note = toMidi(`${n}${octave}`);
		const halftone = ['E', 'B'].includes(n) ? false : toMidi(`${n}#${octave}`);
		const before = scale[step === 0 ? scale.length - 1 : step - 1];
		const after = scale[step === scale.length - 1 ? 0 : step + 1];

		return { note, halftone, noteName: n, octave, before, after };
	});

export default Vue.extend({
	props: {
		value: Array as PropType<number[]>,
		sharps: Boolean
	},
	data() {
		return {
			notes: NOTES,
			selected: [] as number[]
		};
	},
	methods: {
		keyPressed(note: number) {
			const i = this.selected.indexOf(note);
			if (i === -1) {
				this.selected.push(note);
			} else {
				this.selected.splice(i, 1);
			}

			this.$emit('input', [...this.selected]);
		},
		classes(note: number) {
			return {
				selected: this.selected.includes(note)
			};
		}
	},
	watch: {
		value() {
			this.selected = this.value;
		}
	}
});
</script>

<style lang="postcss" scoped>
.keyboard {
	width: 100vw;
	margin-left: 50%;
	transform: translateX(-50%);
	@apply flex w-screen overflow-x-auto;
}

.keyboard .key {
	min-width: 50px;
	height: 300px;
	@apply w-full relative;

	div {
		@apply w-full h-full;
	}

	.white {
		@apply flex border rounded bg-white h-full justify-center items-end pb-2 text-gray-600;
	}

	.black {
		width: calc(100% / 1.5);
		height: calc(100% / 3 * 1.5);
		left: calc(100% / 1.5);
		top: 0;
		@apply bg-black shadow-md rounded absolute z-10;

		.key-labels {
			@apply flex flex-col h-full justify-end items-center text-white opacity-50;
		}
	}

	.white:active,
	.white.selected {
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1) inset, 0 0 3px rgba(0, 0, 0, 0.1);
	}

	.black:active,
	.black.selected {
		box-shadow: 0 0 10px rgba(255, 255, 255, 0.8) inset,
			0 0 10px rgba(255, 255, 255, 0.5);
	}
}
</style>
