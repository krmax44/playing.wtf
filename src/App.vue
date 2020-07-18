<template>
	<div class="min-h-screen flex flex-col container mx-auto">
		<div class="flex flex-1">
			<div class="container mt-16">
				<SiteHeader />

				<main class="pt-4 md:pt-6">
					Do you ever fiddle around on your instrument, finding something that
					sounds good but are wondering, what exactly the ducking crap you're
					playing? Wonder no more, thanks to technology! ✨

					<div class="flex mt-8 flex-wrap md:flex-no-wrap">
						<div class="card">
							<div>
								<h2>Notes</h2>

								<div class="mt-4" :class="{ italic: !noteNames }">
									{{ noteNames || 'no notes selected' }}
								</div>

								<div class="option">
									<SiteSwitch v-model="settings.showOctave">
										Show octave
									</SiteSwitch>
								</div>
							</div>
						</div>

						<div class="card">
							<div>
								<h2>Intervals</h2>

								<div class="my-4" v-if="intervalNames">
									<p>Intervals from one note to the next:</p>
									<p class="ml-2">{{ intervalNames }}</p>
								</div>

								<div class="my-4 italic" v-else>
									no notes selected
								</div>
							</div>
						</div>

						<div class="card">
							<div>
								<h2>Chords</h2>

								<div class="my-4" :class="{ italic: !chordNames }">
									{{ chordNames || 'no chords detected' }}
								</div>
							</div>
						</div>

						<div class="card">
							<div>
								<h2>Options</h2>

								<div class="option">
									<SiteSwitch v-model="settings.sharps">
										Use sharps
									</SiteSwitch>
								</div>

								<div class="option">
									<SiteSwitch v-model="settings.fretboard">
										Use fretboard
									</SiteSwitch>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>

		<VirtualInput
			v-model="selected"
			@reset="selected = []"
			:name="settings.fretboard ? 'guitar' : 'piano'"
			:sharps="settings.sharps"
		/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import SiteHeader from '@/components/SiteHeader.vue';
import SiteSwitch from '@/components/SiteSwitch.vue';
import VirtualInput from '@/components/VirtualInput.vue';
import { detect } from '@tonaljs/chord-detect';
import { midiToNoteName } from '@tonaljs/midi';
import { distance } from '@tonaljs/interval';

export default Vue.extend({
	components: { SiteHeader, SiteSwitch, VirtualInput },
	data() {
		return {
			selected: [] as number[],
			settings: {
				showOctave: true,
				sharps: true,
				fretboard: false
			}
		};
	},
	computed: {
		noteNames(): string {
			return [...this.selected]
				.sort()
				.map(n => {
					const pitchClass = !this.settings.showOctave;
					const sharps = this.settings.sharps;
					return midiToNoteName(n, { pitchClass, sharps });
				})
				.join(', ');
		},
		chordNames(): string {
			const noteNames = [...this.selected].sort().map(n => midiToNoteName(n));
			const chordNames = detect(noteNames);

			return chordNames.join(', ');
		},
		intervalNames(): string {
			const notes = [...this.selected].sort();
			const intervals = notes.map((n, i) => {
				const note = midiToNoteName(n);
				const next = midiToNoteName(notes[i + 1]);
				console.log(note, next);
				return distance(note, next);
			});
			intervals.pop();

			return intervals.join(', ');
		}
	}
});
</script>

<style lang="postcss">
@import '~@/assets/styles/app.pcss';
</style>
