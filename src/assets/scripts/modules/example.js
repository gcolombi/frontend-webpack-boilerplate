/**
 * A key with the same name as your js filename that contains needed primary element 
 * and loading status needs to be add in store.js (modulesToLoad) to load the module if needed
 * 
 * The module can be a Class w/ or w/o constructor and use static/instance methods
 */

export default class Example {
    constructor(element) {
        this.element = element;
    }

    /**
     * Creates Example object
     */
    static create() {
        const section = window.Store.environment.theBody.querySelector('.js-example');

        if (!section)
            return null;
        
        const obj = new Example(section);
        obj.method();

        return obj
    }

    /**
     * Method
     */
    method() {

    }
}

/**
 * The module needs to have a render function
 */
function render() {
    window.Store.modules.example.obj = Example.create();
}

/**
 * The module needs to be added in window.Store.modules
 * 
 * Examples:
 * 
 * class w/o object
 * e.g.
 * window.Store.modules.example: {
 *   render: null,
 * }

 * class w/ object
 * e.g.
 * window.Store.modules.example: {
 *   obj: null,
 *   render: null,
 * }

 * class w/ object & library
 * e.g.
 * window.Store.modules.example: {
 *   obj: null,
 *   render: null,
 *   libIsLoaded: false
 * }

 * class w/ object & api
 * e.g.
 * window.Store.modules.example: {
 *   obj: null,
 *   render: null,
 *   apiIsLoaded: false
 * }
 */
window.Store.modules.example = {
	obj: null,
	render: null
}

/**
 * The render function needs to be assigned to his own key
 */
window.Store.modules.example.render = render;