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

            input.addEventListener('change', (e) => {
                FormInput.checkInput(e.target);
            });
        });
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
}

function render() {
    FormInput.init();
}

window.Store.modules.forminput = {
    render: null,
}

window.Store.modules.forminput.render = render;