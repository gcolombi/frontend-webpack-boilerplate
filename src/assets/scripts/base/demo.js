/**
 * Basic demo
 */

 export default class Demo {

    /**
     * Init example
     */
    static init() {
        const demo = window.Store.environment.theBody.querySelector('.js-demo');

        if (!demo)
            return false;
        
        console.log(demo);
    }
}