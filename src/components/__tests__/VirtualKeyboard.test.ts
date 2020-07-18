import { mount } from '@vue/test-utils';
import VirtualKeyboard from '../VirtualKeyboard.vue';

describe('VirtualKeyboard', () => {
	const wrapper = mount(VirtualKeyboard);
	const d2Key = wrapper.findAll('.keyboard .white').at(1);

	it('locks in notes', async () => {
		d2Key.trigger('click');
		d2Key.trigger('click');

		expect(wrapper.emitted().input[0]).toEqual([[38]]);
		expect(wrapper.emitted().input[1]).toEqual([[]]);
	});

	it('shows key labels', () => {
		expect(d2Key.text()).toBe('D');
	});
});
