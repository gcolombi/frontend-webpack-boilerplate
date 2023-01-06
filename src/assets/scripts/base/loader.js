import loadx from 'loadx';

export default class Loader {
    /**
     * Loads fonts
     * @param {Array} toLoad array of fonts to load. This could be local fonts or external CSS sheets to load (Adobe Fonts, Google Fonts). 
     * @returns {Promise} promise that all fonts have been loaded.
     */
    static fonts(toLoad = []) {
        let loaded = 0;

        return new Promise((resolve, reject) => {
            if (toLoad.length === 0) return resolve();

            toLoad.forEach(font => {
                const url = new URL(font);
                const isExternal = url.host !== window.location.host;
                const loadedCallback = (e) => {
                    if (e.type == 'error') {
                        console.info('Fonts have not been loaded correctly.');
                    }

                    if (++loaded == toLoad.length) {
                        resolve();
                    }
                };

                let promise = new Promise((resolve, reject) => {
                    let newNode = document.createElement('link');
                    newNode.onload = resolve;
                    newNode.onerror = reject;

                    if (isExternal) {
                        newNode.type = 'text/css';
                        newNode.rel = 'stylesheet';
                    } else {
                        const extension = url.href.split('.').pop();
                        newNode.rel = 'preload';
                        newNode.as = 'font';
                        newNode.crossOrigin = 'anonymous';
                        newNode.type = 'font/' + extension;
                    }

                    newNode.href = url.href;

                    window.Store.environment.theBody.appendChild(newNode);
                }).then(e => loadedCallback(e))
                .catch(e => loadedCallback(e));

                return promise;
            });
        });
    }

    /**
     * Dynamic async module loading
     * @returns {Array} an array with the names of the modules to be loaded
     */
    static async modules() {
        let toLoad = [];

        for (const key in window.Store.modulesToLoad) {
            const module = window.Store.modulesToLoad[key];

            if (window.Store.environment.theBody.querySelector(module.selector) && !module.loaded) {
                await loadx.js(Loader.getModuleUrl(key, window.Store.themeUrl));
            }
            toLoad[key] = module;
        }

        return toLoad;
    }

    /**
     * Dynamic modules rendering function
     * @param {Array.<Object>} modules an array with the names of the modules to be loaded
     * @returns {Array} an array with the names of loaded modules
     */
    static renderModules(modules) {
        let loaded = [];

        for (const key in modules) {
            const module = window.Store.modules[key];

            /* Do not rerender loaded modules where rerender is false */
            if (window.Store.modulesToLoad[key].loaded && module?.rerender === false) {
                continue;
            }

            if (module?.obj) {
                module.obj = null;
            }

            if (window.Store.environment.theBody.querySelector(window.Store.modulesToLoad[key].selector) && module?.render) {
                module.render();
                window.Store.modulesToLoad[key].loaded = true;
                loaded.push(key);
            }
        }

        return loaded;
    }

    /**
     * Gets path to js module
     * @param {*} file the exact filename
     * @param {*} theme the theme in which the module is located (refer to store.js)
     * @returns {string} path of the module
     */
    static getModuleUrl(file, theme) {
        const assetsPath = '/dist/assets';
        const filename = `${file}.js`;

        /* Is Wordpress, get js file from theme directory */
        /*
            if () {
                return `//${window.location.host}/your directory structure/${theme}${assetsPath}/${filename}`;
            }
        */

        /* Is local server */
        if (window.location.hostname == 'localhost') {
            return `//${window.location.host}/assets/${filename}`;
        }
        /* else root */
        return `//${window.location.host}${assetsPath}/${filename}`;
    }
}