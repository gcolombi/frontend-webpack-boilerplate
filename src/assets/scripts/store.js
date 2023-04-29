export default class Store {
    constructor() {
        /**
         * Environment settings
         */
        this.environment = {
            lang: 'en',
            lifeCycleReady: false,
            theHtml: null,
            theBody: null,
            theContainer: null,
            responsive: null,
            firstLoadDelay: 1000,
            transitionDelay: 650,
            transitionPageDuration: 250,
            barba: null,
            /**
             * Use your way to retrieve the data
             * Wordpress example
             * add a js global variable
             * https://developer.wordpress.org/reference/functions/wp_enqueue_script/
             * https://developer.wordpress.org/reference/functions/get_template_directory_uri/
             * https://developer.wordpress.org/reference/functions/wp_localize_script/
             */
            themeUrl: window.theme?.url,
            env: process.env.NODE_ENV,
            isProd: process.env.NODE_ENV === 'production',
            isDev: process.env.NODE_ENV === 'development'
        };

        /**
         * Add a key that contains needed primary element and loading status for each module
         * e.g.
         * example: {
         *   selector: '.js-example',
         *   loaded: false,
         * }
         * Note: key name must be the same as your js filename
         */
        this.modulesToLoad = {
            recaptcha: {
                loaded: false,
            },
            example: {
                selector: '.js-example',
                loaded: false
            },
            forminput: {
                selector: '.js-label input, .js-label textarea',
                loaded: false,
            }
        };

        /**
         * Dynamic modules
         * e.g. example.js
         */
        this.modules = {
            /**
             * Use your way to retrieve the data
             * Wordpress example
             * add a js global variable
             * https://developer.wordpress.org/reference/functions/wp_enqueue_script/
             * https://developer.wordpress.org/reference/functions/wp_localize_script/
             */
            recaptcha: {
                version: window.recaptcha?.version,
                key: window.recaptcha?.key
            }
        };

        /**
         * Modules
         */
        this.navigation = null;
        this.scrollbar = null;
        this.lazyload = null;
        this.demo = null;
    }

    /**
     * Creates Store object
     * @returns {Object} Store object
     */
    static create() {
    	const obj = new Store();
        obj.update();

        return obj;
    }

    /**
     * Updates store
     */
    update() {
        this.environment.theHtml = document.documentElement;
        this.environment.theBody = document.body;
        this.environment.theContainer = document.querySelector('.js-barba-container');
    }
}