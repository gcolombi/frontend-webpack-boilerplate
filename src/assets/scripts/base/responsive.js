export default class Responsive {
	constructor(params) {
		this.element = params.element;
		this.breakpoints = params.breakpoints;
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
     * Gets breakpoint value as string or number
     * @param {string} breakpoint breakpoint name e.g. 'LG'
     * @param {boolean} asNumber pass true to retrieve breakpoint's value as number
     * @returns {string|number} breakpoint as string or number
     */
	getBreakpointValue(breakpoint, asNumber = false) {
        this.readBreakpoints();

		if (!this.breakpoints || !this.breakpoints.hasOwnProperty(breakpoint)) {
			return false;
		}

		return asNumber ? parseFloat(this.breakpoints[breakpoint].value) : this.breakpoints[breakpoint].value;
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

		let activeBreakpoint = {name: false, value: 0};

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