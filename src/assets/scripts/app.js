import { lifecycle } from './lifecycle';

document.addEventListener('DOMContentLoaded', () => {
	lifecycle.init();
});

window.addEventListener('resize', () => {
	if (!window.Store.environment.lifeCycleReady)
		return;

    /* Dispatchs "breakpointChanged" event */
    const responsive = window.Store.environment.responsive;
    const activeBreakpoint = responsive.activeBreakpoint.name;

    if (activeBreakpoint !== responsive.currentThreshold?.name) {
        responsive.dispatchEvent();
    }

	window.Store.scrollbar.updateValues();
	window.Store.scrollbar.update();
}, true);