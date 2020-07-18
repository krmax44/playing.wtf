<template>
	<div class="container">
		<div class="guitar">
			<img
				src="@/assets/images/guitar-head.svg"
				alt="Guitar head"
				class="head"
			/>
			<div class="fretboard">
				<div
					class="fret"
					v-for="{ fret, width, strings } in frets"
					:key="fret"
					:style="{ width: `${width}%` }"
				>
					<div
						class="string-container"
						v-for="({ note, name }, string) in strings"
						:title="name"
						:key="string"
						@click="input(note, string, fret)"
					>
						<div class="string" />
					</div>

					<div class="dots">
						<div
							class="dot"
							v-if="[3, 5, 7, 9, 12, 15, 17, 19].includes(fret)"
						/>
						<div class="dot" v-if="fret === 12" />
					</div>

					<div class="dots dots-feedback">
						<div
							class="dot"
							:class="{
								selected: isSelected(note, string, fret)
							}"
							v-for="({ note }, string) in strings"
							:key="string"
						/>
					</div>
				</div>
			</div>
			<div class="body">
				<div class="fret">
					<div
						class="string-container"
						v-for="(a, string) in new Array(6)"
						:key="string"
					>
						<div class="string" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { midiToNoteName } from '@tonaljs/midi';

// see https://en.wikipedia.org/wiki/Guitar_tunings#Standard
// E2, A2, D3, G3, B3, E4
const BASENOTES = [40, 45, 50, 55, 59, 64].reverse();

// fret widths - sums up to 100%
const FRETW = [1, 8, 8, 7, 7, 6, 6, 6, 6, 5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 3, 2];

type GuitarNote = { note: number; fret: number; string: number };

const notesAreEqual = (
	s: GuitarNote,
	note: number,
	string: number,
	fret: number
) => s.note === note && s.string === string && s.fret === fret;

export default Vue.extend({
	props: {
		sharps: Boolean,
		value: [] as PropType<number[]>
	},
	data() {
		return {
			selected: [] as Array<GuitarNote>
		};
	},
	computed: {
		frets() {
			return FRETW.map((width, fret) => {
				const strings = new Array(6).fill(undefined).map((a, string) => {
					const note = BASENOTES[string] + fret;
					const name = midiToNoteName(note, { sharps: this.sharps });
					return { note, name };
				});

				return { width, strings, fret };
			});
		}
	},
	methods: {
		input(note: number, string: number, fret: number) {
			const i = this.selected.findIndex(s =>
				notesAreEqual(s, note, string, fret)
			);

			if (i !== -1) {
				this.selected.splice(i, 1);
			} else {
				const k = this.selected.findIndex(s => s.string === string);
				if (k !== -1) this.selected.splice(k, 1);

				this.selected.push({ note, string, fret });
			}

			this.$emit(
				'input',
				this.selected.map(n => n.note)
			);
		},
		isSelected(note: number, string: number, fret: number) {
			return this.selected.some(s => notesAreEqual(s, note, string, fret));
		}
	},
	watch: {
		value() {
			if (this.value.length === 0) {
				this.selected = [];
			}
		}
	}
});
</script>

<style lang="postcss" scoped src="./VirtualFretboard.pcss"></style>
