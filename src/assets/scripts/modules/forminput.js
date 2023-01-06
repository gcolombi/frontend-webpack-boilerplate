export default class FormInput {
    static params = {
        selectors: {
            el: '.js-label',
            inputs: ['input', 'textarea'],
        },
        settings: {
            css_class: {
                up: 'is-up'
            }
        }
    };

    /**
     * Inits
     */
    static init() {
        const inputs = window.Store.environment.theBody.querySelectorAll(FormInput.params.selectors.inputs.map(el => `${FormInput.params.selectors.el} ${el}`));
        inputs.forEach(input => {
            input.addEventListener('focusin', (e) => {
                const parent = e.target.closest(FormInput.params.selectors.el);

                if (parent) {
                    parent.classList.add(FormInput.params.settings.css_class.up);
                }
            });

            input.addEventListener('focusout', (e) => {
                FormInput.checkInput(e.target);
            });

            FormInput.checkInput(input);
        });

        FormInput.addGlobalEventListener();
    }

    /**
     * Checks input
     * @param {HTMLElement} input DOM node object
     * @returns {boolean} false if no input
     */
    static checkInput(input) {
        if (!input) {
            return false;
        }

        const parent = input.closest(FormInput.params.selectors.el);

        if (parent) {
            parent.classList.toggle(FormInput.params.settings.css_class.up, input.value.length);
        }
    }

    /**
     * Checks autofill
     */
    static initCheckAutofill() {
        FormInput.addGlobalEventListener('blur', function (target) {
            /* setTimeout needed for Chrome as it fills other form fields a little later */
            window.setTimeout(() => {
                FormInput.checkInput(target);
            }, 20);
        });
    }

    /**
     * Adds a global event listener
     * @param {string} eventType string representing the event type to listen for
     * @param {Function} listener event listener callback
     */
    static addGlobalEventListener(eventType, listener) {
        if (!document.body.addEventListener) {
            document.body.attachEvent(eventType, onEvent);
        } else {
            document.body.addEventListener(eventType, onEvent, true);
        }

        function onEvent(e) {
            const target = e.target;
            listener(target);
        }
    }
}

function render() {
    FormInput.initCheckAutofill();
    FormInput.init();
}

window.Store.modules.forminput = {
    render: null,
}

window.Store.modules.forminput.render = render;