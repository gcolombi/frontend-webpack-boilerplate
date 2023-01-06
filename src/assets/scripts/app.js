import { lifecycle } from './lifecycle';

document.addEventListener('DOMContentLoaded', () => {
	lifecycle.init();
});

window.addEventListener('resize', () => {
	if (!window.Store.environment.lifeCycleReady)
		return;

	window.Store.scrollbar.updateValues();
	window.Store.scrollbar.update();
}, true);