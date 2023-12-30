/**
 * Send message form web component.
 *
 * @author Daniel Andersson <da222xg@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
  :host{
      position: absolute;
      bottom: 10px;
      right: 10px;
      font-size: 1.25rem;
      font-family: Arial, Helvetica, sans-serif;
      display:flex;
      justify-content: center;
    }

   :host(.hide) {
        display:none;
    }

</style>
 <form id="send-form">
     <textarea id="message" rows="4" cols="50"></textarea>
     <input type="button" value="Send" id="send-btn" />
 </form>
 `

customElements.define(
  'send-form',

  /**
   * Represents a send-form element.
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

      /*
       * References to elements in the shadow DOM.
       */
      this.sendForm = this.shadowRoot.querySelector('#send-form')
      this.message = this.shadowRoot.querySelector('#message')
      this.sendButton = this.shadowRoot.querySelector('#send-btn')
    }

    /**
     * Observes attributes for changes.
     *
     * @returns {string[]} - Array of observed attributes.
     */
    static get observedAttributes () {
      return ['class']
    }

    /**
     * Called when an observed attribute changes.
     *
     * @param {string} name of the attribute.
     * @param {any} oldValue the old attribute value.
     * @param {any} newValue the new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'class') {
        if (!this.hasAttribute('hide')) this.message.focus()
      }
    }

    /**
     * Called after the element gets inserted into the DOM.
     */
    connectedCallback () {
      this.classList.add('hide')

      this.message.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          this.sendMessage()
        }
      })

      this.sendButton.addEventListener('click', (event) => {
        event.preventDefault()
        this.sendMessage()
      })
    }

    /**
     * Dispatches a custom event that indicates a message being sent.
     */
    sendMessage () {
      this.dispatchEvent(
        new window.CustomEvent('send', {
          detail: this.message.value,
          bubbles: true
        })
      )
      this.message.value = ''
    }
  }
)
