/**
 * The random button component module.
 *
 * @author Daniel Andersson <da222xg@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
  <style>
  :host{
    margin-left: 0;
    display: inline-block;
  }
  </style>

  <button class="randomizer">Randomize</button>
`

customElements.define(
  'random-button',

  /**
   * Represents a random button element.
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      /**
       * Attach a shadow root tree and append template.
       */
      this.attachShadow({ mode: 'open' }).appendChild(
        template.content.cloneNode(true)
      )
      /**
       * References to elements in Shadow DOM.
       */
      this.button = this.shadowRoot.querySelector('.randomizer')
    }

    /**
     * Observes attributes for changes.
     *
     * @returns {string[]} - Array of observed attributes.
     */
    static get observedAttributes () {
      return ['total']
    }

    /**
     * Called when an observed attribute changes.
     *
     * @param {string} name - The attribute name.
     * @param {any} oldValue - The old attribute value.
     * @param {any} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'total' && newValue !== oldValue) {
        this.total = parseInt(newValue)
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.button.addEventListener('click', (event) => {
        event.preventDefault()
        this.initFetch()
      })
    }

    /**
     * Initializing fetch process.
     */
    initFetch () {
      this.dispatchEvent(
        new window.CustomEvent('get', {
          bubbles: true,
          detail: Math.floor(Math.random() * (this.total + 1))
        })
      )
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {}
  }
)
