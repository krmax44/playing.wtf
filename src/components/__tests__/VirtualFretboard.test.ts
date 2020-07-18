import { mount } from '@vue/test-utils';
import VirtualFretboard from '../VirtualFretboard.vue';

function createWrapper(propsData: any = {}) {
	return mount(VirtualFretboard, {
		propsData
	});
}

const aSharp3String =
	'.fretboard .fret:nth-child(4) > .string-container:nth-child(3)';

describe('VirtualFretboard', () => {
	it('shows sharps', () => {
		const wrapper = createWrapper({ sharps: true });
		const string = wrapper.find(aSharp3String);

		expect(string.attributes('title')).toBe('A#3');
	});

	it('shows flats', () => {
		const wrapper = createWrapper({ sharps: false });
		const string = wrapper.find(aSharp3String);
		expect(string.attributes('title')).toBe('Bb3');
	});

	it('locks in notes', async () => {
		const wrapper = createWrapper();
		const string = wrapper.find(aSharp3String);
		string.trigger('click');

		const dot = wrapper.find(
			'.fretboard .fret:nth-child(4) > .dots-feedback > .dot:nth-child(3)'
		);

		await wrapper.vm.$nextTick();

		expect(dot.classes('selected')).toBe(true);
		expect(wrapper.emitted().input[0]).toEqual([[58]]);
	});
});
