/**
 * Gets parent element by classname
 * @param {*} from HTML DOM Element
 * @param {string} term classname searched e.g. 'js-element'
 * @returns {Object} Element object
 */
 export function getParentByClassName(from, term) {
	let parent = from?.parentElement;
	const search = term;
	let contains = parent?.classList.contains(search) ? true : false;

	if (parent != null && !contains) {
		while (!contains) {
			parent = parent.parentElement;

			if (parent != null) {
				contains = parent.classList.contains(search) ? true : false;
				if (contains) {
					return parent;
				}
			}

			if (parent == window.Store.environment.theBody) {
				console.warn(`Could not find a match for getParentByClassName('${search}'), returning <body> as a fallback`);
				return window.Store.environment.theBody;
			}
		}
	}

	return parent;
}

/**
 * Gets the next sibling element
 * @param {*} element HTML DOM Element
 * @param {*} selector classname searched e.g. '.js-element'
 * @returns {Object} Element object
 */
 export function getNextSibling(element, selector) {
	let sibling = element?.nextElementSibling;

	/* If there's no selector, return the first sibling */
	if (!selector) {
		return sibling;
	}

	/* If the sibling matches our selector, use it.
	Otherwise, jump to the next sibling and continue the loop.*/
	while (sibling) {
		if (sibling.matches(selector)) {
			return sibling;
		}

		sibling = sibling.nextElementSibling
	}
}