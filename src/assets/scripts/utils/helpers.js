import loadx from 'loadx'

/**
 * Gets transition end event name
 * @returns {string} transition
 */
export function getTransitionEndEventName() {
	const transitions = {
		"transition": "transitionend",
		"OTransition": "oTransitionEnd",
		"MozTransition": "transitionend",
		"WebkitTransition": "webkitTransitionEnd"
}
	
	let bodyStyle = document.body.style;
	for (let transition in transitions) {
		if (bodyStyle[transition] != undefined) {
			return transitions[transition];
		}
	}
}

/**
 * Async function used on scroll event in order to not be penalized by PageSpeed Insights
 * @param {boolean} force force the load
 * @returns {boolean}
 */
export async function loadRecaptcha(force = false) {
	if (window.Store.modulesToLoad.recaptcha.loaded)
		return true;

	if (!window.Store.modules.recaptcha.version)
		return false;
	
	if (window.Store.scrollbar.y <= 0 && force !== true)
		return false;

	let src = 'https://www.google.com/recaptcha/api.js';

	if (window.Store.modules.recaptcha.version == 3)
		src = src + '?render=' + window.Store.modules.recaptcha.key;

	try {

		window.Store.modulesToLoad.recaptcha.loaded = true;
		console.log(`Recaptcha version ${window.Store.modules.recaptcha.version} loading...`);
		await loadx.js(src);
		console.log(`Recaptcha version ${window.Store.modules.recaptcha.version} loaded succesfully!`);
		return true;

	} catch (error) {
		console.error(error);
		window.Store.modulesToLoad.recaptcha.loaded = false;
		return false;
	}
}