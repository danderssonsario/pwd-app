/**
 * Name form web component.
 *
 * @author Daniel Andersson <da222xg@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
  :host{
      font-size: 1.25rem;
      font-family: Arial, Helvetica, sans-serif;
    }

   :host(.hide) {
        display:none;
    }
</style>
 <form id="name-form">
     <slot></slot>
     <input type="text" name="nickname" id="nickname" />
     <input type="submit" value="Enter" id="enter-btn" />
 </form>
 `

customElements.define(
  'name-form',

  /**
   * Represents a nickname-form element.
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
      this.nameForm = this.shadowRoot.querySelector('#name-form')
      this.nickname = this.shadowRoot.querySelector('#nickname')
      this.button = this.shadowRoot.querySelector('#enter-btn')
    }

    /**
     * Observes attributes for changes.
     *
     * @returns {string[]} - Array of observed attributes.
     */
    static get observedAttributes () {
      return []
    }

    /**
     * Called when an observed attribute changes.
     *
     * @param {string} name - The attribute name.
     * @param {any} oldValue - The old attribute value.
     * @param {any} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
    }

    /**
     * Called after the element gets inserted into the DOM.
     */
    connectedCallback () {
      this.nickname.focus()
      this.button.addEventListener('click', (event) => {
        event.preventDefault()
        this.initChat()
      })
    }

    /**
     * Initialize chat by dispatching a custom event.
     */
    initChat () {
      this.classList.add('hide')
      this.dispatchEvent(
        new window.CustomEvent('init', {
          detail: this.nickname.value,
          bubbles: true
        })
      )
      this.nickname.value = ''
    }
  }
)
