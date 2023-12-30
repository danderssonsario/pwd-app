/**
 * The end page of memory game component module.
 *
 * @author Daniel Andersson <da222xg@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
  :host{
    display:block;
    font-size: 1.5rem;
    font-weight: 600;
    font-family: Arial, Helvetica, sans-serif;
  }
  :host(.hide){
    display:none;
  }
</style>
<h1>Game finished!</h1>
<p id="attempts"></p>
<p id="time"></p>
<button id="btn" type="button">Play Again</button>

`

customElements.define(
  'end-page',
  /**
   * Represents an end page element.
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      /**
       * Attach a shadow root tree to the element and append template.
       */
      this.attachShadow({ mode: 'open' }).appendChild(
        template.content.cloneNode(true)
      )

      // References to elements in the Shadow DOM.
      this.attempts = this.shadowRoot.querySelector('#attempts')
      this.time = this.shadowRoot.querySelector('#time')
      this.startButton = this.shadowRoot.querySelector('#btn')
    }

    /**
     * Observe attributes for changes.
     *
     * @returns {string[]} - Array of observed attributes.
     */
    static get observedAttributes () {
      return ['attempts', 'time']
    }

    /**
     * Called when an observed attribute changes.
     *
     * @param {string} name - The attribute name.
     * @param {any} oldValue - The old attribute value.
     * @param {any} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'attempts' && newValue !== oldValue) {
        this.attempts.textContent = `Number of attempts: ${newValue}`
      }
      if (name === 'time' && newValue !== oldValue) {
        this.time.textContent = `Time: ${newValue} s`
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.startButton.addEventListener('click', event => {
        event.preventDefault()
        this.dispatchEvent(new window.CustomEvent('return'), {
          bubbles: true
        })
      })
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this.startButton.removeEventListener('click', event => {})
    }
  }
)
