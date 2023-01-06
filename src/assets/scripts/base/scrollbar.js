/**
 * Locomotive scroll
 * documentation: https://github.com/locomotivemtl/locomotive-scroll
 * example: https://locomotivemtl.github.io/locomotive-scroll/
 */

import LocomotiveScroll from 'locomotive-scroll';
import { getTransitionEndEventName, loadRecaptcha } from '../utils/helpers.js';

export default class Scrollbar {
    constructor(params) {
		this.x = params.x
		this.y = params.y;
		this.directionX = 0;
		this.directionY = 0;
		this.screenWidth = params.screenWidth;
		this.screenHeight = params.screenHeight;
		this.element = params.element;
	}

    /**
     * Creates Scrollbar object from LocomotiveScroll
     * @returns {Object} Scrollbar object
     */
	static create() {
		const locomotiveScroll = new LocomotiveScroll({
			el: window.Store.environment.theBody.querySelector('[data-scroll-container]'),
			smooth: window.innerWidth >= window.Store.environment.responsive.getBreakpointValue('LG', true),
			getDirection: true,
		});

		const params = {
			x: 0,
			y: 0,
			directionX: 0,
			directionY: 0,
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
			element: locomotiveScroll,
		}

		const obj = new Scrollbar(params);
		obj.initListener();

		return obj;
	}

    /**
     * Instance events
     * scroll: Returns scroll instance (position, limit, speed, direction and current in-view elements)
     * call: Trigger if in-view. Returns your string or array if contains comma, you need to add data-scroll-call on your element
     * refer to https://github.com/locomotivemtl/locomotive-scroll#instance-events
     */
	initListener() {
		this.element.on('scroll', (args) => {
			this.updateValues(args);

			if (window.Store.environment.lifeCycleReady) {

				/* Put your code that needs to be watch here */
    			loadRecaptcha();

			}
		});

        this.element.on('call', (value, way) => {
            // console.log(value, way);
        });
	}

	/**
	 * Updates scroll & screen values
	 * @param {Object} scrollInstance Locomotive Scroll instance
	 */
	updateValues(scrollInstance = null) {
		if (scrollInstance) {
			/* Updates x & y value */
			if (this.element.smooth) {
				this.x = scrollInstance.scroll.x;
				this.y = scrollInstance.scroll.y;
			} else {
				this.x = window.scrollX;
				this.y = window.scrollY;
			}

			/* Y */
			if (scrollInstance.direction === 'down') {
				this.directionY = 1;
			} else if (scrollInstance.direction === 'up') {
				this.directionY = -1;
			}

			/* X */
			if (scrollInstance.direction === 'right') {
				this.directionX = 1;
			} else if (scrollInstance.direction === 'left') {
				this.directionX = -1;
			}

			if (scrollInstance.direction)
				window.Store.environment.theHtml.setAttribute('data-direction', scrollInstance.direction);
		}

		/* Updates screen width & height value */
		this.screenWidth = window.innerWidth;
		this.screenHeight = window.innerHeight;
	}

    /**
     * Scroll to
     * @param {*} target defines where you want to scroll. Available values types: node, string or int
     * @param {Object} options optional settings:
     * offset :(integer) : Defines an offset from your target. E.g. -100 if you want to scroll 100 pixels above your target
     * callback (function) : Called when scrollTo completes (note that it won't wait for lerp to stabilize)
     * duration (integer) : Defines the duration of the scroll animation in milliseconds. Defaults to 1000
     * easing (array) : An array of 4 floats between 0 and 1 defining the bezier curve for the animation's easing. Defaults to [0.25, 0.00, 0.35, 1.00]
     * disableLerp (boolean) : Lerp effect won't be applied if set to true
     */
	scrollTo(target, options = {}) {
		this.element.scrollTo(target, options);
	}
	
    /**
     * Scrolls to top
     */
	scrollToTop() {
		this.scrollTo('top', { duration: 0 });
	}

    /**
     * Scrolls to target
     */
	scrollToTarget() {
		const anchors = window.Store.environment.theBody.querySelectorAll('a[href^="#"]');

        if (!anchors.length)
            return false;

		anchors.forEach(anchor => {
			const anchorHref = anchor.href;
			const anchor_url = new URL(anchorHref);
			const anchor_hash = anchor_url.hash;
	
			if (anchor_hash) {
				const target = window.Store.environment.theBody.querySelector(anchor_hash);
	
				if (target) {
					anchor.addEventListener('click', (e) => {
						e.preventDefault();
						this.scrollTo(target);
					});
				}
			}
		});
	}

    /**
     * Scrolls to hash location
     */
	scrollToHashLocation() {
		const hashTarget = window.location.hash;

		if (!hashTarget)
            return false;

		const target = window.Store.environment.theBody.querySelector(hashTarget);

		if (target) {
			this.scrollTo(target);
		}
	}

	/**
	 * Wrapper function for Locomotive Scroll update
	 */
	update() {
		if (this.element)
			this.element.update();
	}

	/**
	 * Updates container height after an element transition has ended.
	 * e.g. If you have a module with a listener who affect the height of the page, you need to update the scrollbar
	 * after transition ends. Add this method in the eventListener
	 * @param {*} element the element which we wait for
	 */
	updateAfterTransitionEnd(element) {
		element.addEventListener(getTransitionEndEventName(), function _listener() {
			window.Store.scrollbar.update();
			element.removeEventListener(getTransitionEndEventName(), _listener, true);
		}, true);
	}

	/**
	 * Getters
	 */

	/**
	 * Returns scroll & screen values
	 * @returns {object} object containing scroll and screen values
	 */
	get world() {
		return {
			x: this.x,
			y: this.y,
			w: this.screenWidth,
			h: this.screenHeight,
		}
	}

	/**
	 * Returns scroll directions
	 * @returns {object} object containing scroll directions
	 */
	get directions() {
		return {
			x: this.directionX,
			y: this.directionY,
		}
	}
}