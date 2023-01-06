/**
 * Barba
 * barba lifecycle: https://barba.js.org/assets/diagram/lifecycle.png
 * transitions: https://barba.js.org/docs/advanced/transitions/
 * views: https://barba.js.org/docs/advanced/views/
 * hooks: https://barba.js.org/docs/advanced/hooks/
 * utils: https://barba.js.org/docs/advanced/utils/
 * Note that you can prevent a link from using Barba with the data-barba-prevent attribute:
 * data-barba-prevent or data-barba-prevent="self" prevents the current link
 * data-barba-prevent="all" prevents all children links in a container
 */

import Store from './store';
import barba from '@barba/core';
import Loader from './base/loader';
import Responsive from './base/responsive.js';
import Scrollbar from './base/scrollbar.js';
import LazyLoad from 'vanilla-lazyload';
import Demo from './base/demo';

class Lifecycle {
    constructor() {
        this.options = {
            fonts: [
                'https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Roboto:wght@300;400;500;700;900&display=swap',
                // 'https://use.typekit.net/xxxxxxxxx.css',
            ]
        },
        this.settings = {
            css_class: {
                html: {
                    loading: 'is-loading',
                    loaded: 'is-first-loaded',
                    has_loaded: 'has-loaded',
                    ready: 'is-ready',
                    transitioning: 'is-transitioning'
                },
                img: {
                    loaded: 'is-loaded'
                }
            },
            selectors: {
                image_lazy: '.js-lazy'
            }
        };
    }

    /**
     * Inits lifecycle
     */
    init() {
        /* Defines the Store in the window object */
        window.Store = Store.create();

        /* init your javascript which needs to be loaded only once */
        window.Store.environment.responsive = Responsive.create();

        this.load();
    }

    /**
     * Load
     */
    load() {
        this.barbaInit();
        this.barbaGlobalHook();
        this.update();
        window.Store.environment.lifeCycleReady = true;

        Loader.fonts([
            ...this.options.fonts
        ]);

        if (window.Store.environment.theHtml.classList.contains(this.settings.css_class.html.loading)) {
            setTimeout(() => {
                window.Store.environment.theHtml.classList.remove(this.settings.css_class.html.loading);
                window.Store.environment.theHtml.classList.add(this.settings.css_class.html.loaded);
                window.Store.environment.theHtml.classList.add(this.settings.css_class.html.has_loaded);
                /* updates scroll after the first load */
                window.Store.scrollbar.update();
            }, window.Store.environment.firstLoadDelay);
        }
    }

    /**
     * Inits Barba
     */
    barbaInit() {
        const self = this;
        barba.init({
            timeout: 5000,
            prefetchIgnore: true,
            transitions: [{
                /* Barba allows you to define a global transition, that run everywhere on your site */
                name: 'default-transition',
                leave(data) {
                    /* create your stunning leave animation here */
                    window.Store.environment.theHtml.classList.remove(self.settings.css_class.html.has_loaded, self.settings.css_class.html.ready);
                    window.Store.environment.theHtml.classList.add(self.settings.css_class.html.transitioning);
                },
                enter(data) {
                    /* create your amazing enter animation here */
                    setTimeout(() => {
                        window.Store.environment.theHtml.classList.remove(self.settings.css_class.html.transitioning);
                        window.Store.environment.theHtml.classList.add(self.settings.css_class.html.ready);
                    }, window.Store.environment.transitionPageDuration);
                }
            }],
            views: [{
                /* Logic related to the content of a namespace */
                namespace: 'default',
                beforeLeave(data) {
                    /* do something before leaving the current `default` namespace */
                    // console.log('beforeLeave: ', data);
                },
                beforeEnter(data) {
                    /* do something before entering the `default` namespace */
                    // console.log('beforeEnter: ', data);
                }
            }]
        });
        window.Store.environment.barba = barba;
    }

    /**
     * Global hooks
     * This will execute code everytime the hook is called in the lifecycle.
     */
    barbaGlobalHook() {
        barba.hooks.leave((data) => {
            // console.log('barbaGlobalHook - leave', data);
            window.Store.scrollbar.element.destroy();
        });
        barba.hooks.enter((data) => {
            // console.log('barbaGlobalHook - enter', data);
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, window.Store.environment.transitionDelay);
            });
        });
        barba.hooks.after((data) => {
            // console.log('barbaGlobalHook - after', data);
            this.update();
            window.Store.scrollbar.scrollToTop();
        });
    }

    /**
     * Update
     * Inits modules to update lifecycle
     */
    update() {
        window.Store.update();
        this.setCurrentLang();

        /* Modules */
        window.Store.environment.responsive.readBreakpoints();
        window.Store.scrollbar = Scrollbar.create();
        window.Store.scrollbar.scrollToTarget();
        setTimeout(() => {
            window.Store.scrollbar.scrollToHashLocation();
        }, window.Store.environment.transitionDelay);
        window.Store.lazyload = new LazyLoad({
            elements_selector: this.settings.selectors.image_lazy,
            class_loaded: this.settings.css_class.img.loaded,
        });
        window.Store.demo = Demo.init();

        /* Dynamic async module loading */
        Loader.modules().then((modules) => {
            Loader.renderModules(modules);
        });
    }

    /**
     * Sets current lang in the store
     * @returns {string|boolean} warning message or true
     */
    setCurrentLang() {
        if (!window.Store.environment.theContainer) {
            return console.warn('Please set a site container with the following class: js-barba-container');
        }

        if (window.Store.environment.theContainer !== null ) {
            if (window.Store.environment.theContainer.dataset.lang != null) {
                window.Store.environment.lang = window.Store.environment.theContainer.dataset.lang;
                return true;
            }
            return console.warn('Please set a default language attribute on your site container. e.g. data-lang="fr"');
        }
        return console.warn('No site container or default language was found. theContainer and lang wont be available in the Store');
    }
}
 
export const lifecycle = new Lifecycle();