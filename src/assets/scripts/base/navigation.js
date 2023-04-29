export default class Navigation {
    constructor(params) {
        this.nav = {...params.nav};
        this.items = [];
        this.burger = params.burger;
        this.states = {
            active: false,
            sticky: false,
            visible: true,
        };
        this.settings = {
            nav: {
                active: 'is-open',
                sticky: 'is-sticky',
                hidden: 'is-hidden',
                current_page: 'is-current-page'
            },
            html: {
                active: 'has-nav-open'
            },
            rootCssVars: {
                '--navigation-height' : ''
            },
        };
    }

    /**
     * Creates navigation object
     * @returns {Object} Navigation object
     */
    static create() {
        const navigation = window.Store.environment.theBody.querySelector('.js-navigation');

        if (!navigation)
            return null;

        /* get elements */
        const burger = navigation.querySelector('.js-burger');
        const primaryNavigation = navigation.querySelector('.js-primary-nav');
        const primaryNavigationScroll = navigation.querySelector('.js-primary-nav-scroll');

        const params = {
            nav: {
                element: navigation,
                primary: {
                    element: primaryNavigation,
                    scroll: primaryNavigationScroll,
                }
            },
            burger: burger
        }

        const obj = new Navigation(params);
        obj.listener();
        obj.createResizeObserver();
        obj.createGroup();
        obj.setCurrenPage();

        return obj
    }

    /**
     * Reports changes of the navigation element and updates css root variable
     */
    createResizeObserver() {
        new ResizeObserver(this.setCssRootVars.bind(this)).observe(this.nav.element);
    }

    /**
     * Listener
     */
    listener() {
        /* Burger */
        this.burger.addEventListener('click', this.toggle.bind(this));
    }

    /**
     * Handles navigation active state
     */
    toggle() {
        if (!this.states.active) {
            this.toggleNavigation(this.states.active);
            return;
        }

        this.toggleNavigation('close');
    }

    /**
     * Handles navigation opening and closing
     * @param {boolean} currentState current navigation state
     */
    toggleNavigation(currentState) {
        /* flip the state */
        this.states.active = !currentState

        if (currentState) {
            this.nav.element.classList.remove(this.settings.nav.active);
            this.burger.classList.remove(this.settings.nav.active);
            window.Store.environment.theHtml.classList.remove(this.settings.html.active);
            return
        }

        this.nav.element.classList.add(this.settings.nav.active);
        this.burger.classList.add(this.settings.nav.active);
        this.nav.primary.scroll.scrollTo(0, 0);

        /* Locks the scroll when the navigation is open */
        window.Store.environment.theHtml.classList.add(this.settings.html.active);
    }

    /**
     * Watches the scroll in order to update sticky & visible state
     * @param {number} y scroll value
     */
    watch(y) {
        this.checkVisibility(y);

        if (y > 0) {
            this.nav.element.classList.add(this.settings.nav.sticky);
            this.states.sticky = true;
            return
        }

        this.nav.element.classList.remove(this.settings.nav.sticky);
        this.states.sticky = !this.states.sticky;
    }

    /**
     * Handles navigation visible state
     * @param {number} y scroll value
     */
    checkVisibility(y) {

        if (y > this.headerHeight && window.Store.scrollbar.directions.y > 0) {
            this.nav.element.classList.add(this.settings.nav.hidden);
            this.states.visible = false;
            return;
        }

        this.nav.element.classList.remove(this.settings.nav.hidden);
        this.states.visible = true;
    }

    /**
	 * Defines a CSS variable for navigation height
	 * @returns {boolean} true when variable has been setted
	 */
	setCssRootVars() {
        this.settings.rootCssVars['--navigation-height'] = this.height;

        Object.keys(this.settings.rootCssVars).forEach(prop => {
            window.Store.environment.theHtml.style.setProperty(
                prop, `${this.settings.rootCssVars[prop]}px`
            );
        })

		return true;
	}

    /**
     * Creates item group to set current page
     */
    createGroup() {
        /* primary */
        const children = this.nav.primary.element ? [...this.nav.primary.element?.children] : [];
        children.forEach(child => {
            const link = child.firstElementChild.querySelector('a');
            if (link) {
                const urlObj = new URL(link.href);
                const urlPathname = urlObj.pathname;
                const urlPathnameParsed = urlPathname.replace(/\\|\//g,'');

                const obj = {
                    element: child,
                    link,
                    url_object: urlObj,
                    url_pathname_parsed: urlPathnameParsed,
                    states: {
                        current: false,
                    }
                }

                this.items.push(obj);
            }
        });
    }

    /**
     * Sets current page
     */
    setCurrenPage() {
        /* reset */
        this.items.forEach(item => {
            item.element.classList.remove(this.settings.nav.current_page);
            item.states.current = false;
        });

        /* get the current url infos */
        const currentUrl = window.location.pathname;
        const currentUrlParsed = currentUrl.replace(/\\|\//g,'');

        /* set current page */
        this.items.forEach(item => {
            if (item.url_pathname_parsed === currentUrlParsed) {
                item.element.classList.add(this.settings.nav.current_page);
                item.states.current = true;
            }
        });
    }

    /**
     * Update
     */
    update() {
        const activeBreakpoint = window.Store.environment.responsive.activeBreakpoint.value;
        /* close mobile navigation if bp >= 1200 */
        if (activeBreakpoint >= 1200 && this.states.active) {
            this.toggleNavigation('close');
        }
    }

    /**
     * Returns navigation height
	 * @returns {number} height value
     */
    get height() {
        return this.nav.element.getBoundingClientRect().height;
    }

    /**
     * Returns navigation width
	 * @returns {number} width value
     */
    get width() {
        return this.nav.element.getBoundingClientRect().width;
    }

    /**
     * Returns header height or viewport height
	 * @returns {number} header height or viewport height value
     */
    get headerHeight() {
        let header = window.Store.environment.theBody.querySelector('.js-header');
        let headerHeight = window.Store.scrollbar.world.h;
        if (header) {
            header ? header = header : null;
            headerHeight = header.scrollHeight;
        }

        return headerHeight;
    }
}