/**
 * The start page for memory game web component module.
 *
 * @author Daniel Andersson <da222xg@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
  :host {
    display: block;
    margin: 15px;
    font-family: Arial, Helvetica, sans-serif;
  }

  button {
    padding: 2px;
  }

  :host(.hide){
    display:none;
  }
</style>
<div class="start-page">
  <h1>Awesome memory game</h1>
  <h2>Select how many tiles you want to play with:</h2>
  <div id="option1"></div>
  <div class="buttons">
    <button id="16" type="button">4 x 4 tiles</button>
    <button id="8" type="button">4 x 2 tiles</button>
    <button id="4" type="button">2 x 2 tiles</button>
  </div>
</div>
`

customElements.define(
  'start-page',

  /**
   * Represents a start page element.
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
       * References to elements in the shadow DOM.
       */
      this.optionButtons = this.shadowRoot.querySelector('.buttons')
      this.startPage = this.shadowRoot.querySelector('.start-page')
    }

    /**
     * Observes attribute for changes.
     *
     * @returns {string[]} Array of observed attributes.
     */
    static get observedAttributes () {
      return []
    }

    /**
     * Called by the browser engine when an attribute changes.
     *
     * @param {string} name of the attribute.
     * @param {any} oldValue the old attribute value.
     * @param {any} newValue the new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.optionButtons.addEventListener('click', (event) => {
        event.preventDefault()
        this.startGame(event.target)
      })
    }

    /**
     * Initializes the game by dispatching a custom event.
     *
     * @param {HTMLElement} button - Button with choice of tiles.
     */
    startGame (button) {
      this.classList.add('hide')
      this.dispatchEvent(new window.CustomEvent('start', {
        detail: button,
        bubbles: true,
        composed: true
      }))
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {}
  }
)
