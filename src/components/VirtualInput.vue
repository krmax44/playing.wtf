<template>
	<div>
		<component :is="name" v-bind="$attrs" v-on="$listeners" />

		<div class="flex bg-gray-100 outbreak">
			<a href="#!" class="btn" @click="$emit('reset')">
				<ResetIcon /> Reset notes
			</a>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import ResetIcon from 'icons/Restore.vue';

import piano from './VirtualKeyboard.vue';
import guitar from './VirtualFretboard.vue';

export default Vue.extend({
	props: {
		name: {
			type: String,
			default: 'piano'
		}
	},
	components: { piano, guitar, ResetIcon }
});
</script>

<style lang="postcss" scoped>
.outbreak {
	width: 100vw;
	margin-left: 50%;
	transform: translateX(-50%);
	@apply flex w-screen overflow-x-auto;
}
</style>
