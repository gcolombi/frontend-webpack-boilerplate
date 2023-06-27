export default class Responsive {
	constructor(params) {
		this.element = params.element;
		this.breakpoints = params.breakpoints;
        this.currentThreshold = this.activeBreakpoint;
	}

    /**
     * Creates Responsive object
     * @returns {Object} Responsive object
     */
	static create() {
		const params = {
			element: document.body,
			breakpoints: false,
		}

		return new Responsive(params);
	}

    /**
     * Parses a JSON string, constructing the object described by the string
     * @returns {Object|boolean} object corresponding to the JSON or boolean
     */
	readBreakpoints() {
		if (window.getComputedStyle && (window.getComputedStyle(this.element, '::after').content !== '')) {
			const data = window.getComputedStyle(this.element, '::after').content;

			try {
				this.breakpoints = JSON.parse(Responsive.removeQuotes(data));
			} catch (err) {
				this.breakpoints = false;
			}
		} else {
			this.breakpoints = false;
		}

        return this.breakpoints;
	}

    /**
     * Gets breakpoint
     * @param {string} breakpoint breakpoint name e.g. 'LG'
     * @returns {Object} breakpoint object
     */
	getBreakpoint(breakpoint) {
		this.readBreakpoints();

		if (!this.breakpoints || !this.breakpoints.hasOwnProperty(breakpoint)) {
			return false;
		}

		return {name: breakpoint, value: parseFloat(this.breakpoints[breakpoint].value)};
	}

    /**
     * Gets not active breakpoint state
     * @param {string} breakpoint breakpoint name e.g. 'LG'
     * @returns {boolean} not active breakpoint state
     */
	isBreakpointNotActive(breakpoint) {
		return !this.isBreakpointActive(breakpoint);
	}

    /**
     * Gets active breakpoint's state
     * @param {string} breakpoint breakpoint name e.g. 'LG'
     * @returns {boolean} active breakpoint state
     */
	isBreakpointActive(breakpoint) {
        this.readBreakpoints();

        return this.breakpoints.hasOwnProperty(breakpoint) && this.breakpoints[breakpoint].active;
	}

    /**
	 * Dispatchs "breakpointChanged" event
	 * @returns {boolean} true when event has been dispatched
	 */
	dispatchEvent() {
		const prevBreakpoint = this.getBreakpoint(this.currentThreshold?.name) || this.activeBreakpoint;
		const activeBreakpoint = this.activeBreakpoint;

		const event = new CustomEvent('breakpointChanged', {
			detail: {
				prevBreakpoint: prevBreakpoint,
				activeBreakpoint: activeBreakpoint
			}
		});

		this.currentThreshold = this.activeBreakpoint;

		return document.dispatchEvent(event);
	}

	/**
     * Removes string quotes
     * @param {string} string
     * @returns {string} string without quotes
     */
	 static removeQuotes(string) {
		if (typeof string === 'string' || string instanceof String) {
			string = string.replace(/[']/g, '"').replace(/\\|^[\s\S]{0,1}|[\s\S]$/g, '');
		}
		return string;
	}

	/**
	 * Getters
	 */

	/**
     * Gets active breakpoint
     * @returns {Object} active breakpoint object
     */
	get activeBreakpoint() {
        this.readBreakpoints();

		let activeBreakpoint = {name: 'MIN', value: 0};

		for (let breakpoint in this.breakpoints) {
			if (this.breakpoints.hasOwnProperty(breakpoint)) {
				let breakpointValue = parseFloat(this.breakpoints[breakpoint].value);

				if (this.breakpoints[breakpoint].active && (breakpointValue > activeBreakpoint.value)) {
					activeBreakpoint = {name: breakpoint, value: breakpointValue};
				}
			}
		}

		return activeBreakpoint;
	}
}