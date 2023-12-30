/**
 * Messages container web component.
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
      display:block;
      width:100%;
      height: 350px;
      overflow: auto;
      border-top: 2px solid black;
      border-bottom: 2px solid black;
    }

   :host(.hide) {
        display:none;
    }

  .message {
    margin-left: 10px;
    padding: 2px;
  }
 
</style>

    <div class="message-container"></div>
 `

customElements.define(
  'message-container',

  /**
   * Represents a message container element.
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      /**
       * Attach a shadom root tree and append template.
       */
      this.attachShadow({ mode: 'open' }).appendChild(
        template.content.cloneNode(true)
      )

      // References to elements in shadow DOM
      this.messageContainer =
        this.shadowRoot.querySelector('.message-container')
    }

    /**
     * Gets sender.
     *
     * @returns {string} - Value of attribute 'sender'.
     */
    get sender () {
      return this.getAttribute('sender')
    }

    /**
     * Sets sender.
     *
     * @param {string} value - The string to be set.
     */
    set sender (value) {
      this.setAttribute('sender', value)
    }

    /**
     * Observes attributes for changes.
     *
     * @returns {string[]} - Array of observed attributes.
     */
    static get observedAttributes () {
      return ['message', 'class']
    }

    /**
     * Called by the browser when an observed attribute changes.
     *
     * @param {string} name - The attribute name.
     * @param {any} oldValue - The old attribute value.
     * @param {any} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'message' && newValue) {
        this.appendMessage(newValue)
      }
    }

    /**
     * Called after the element gets inserted into the DOM.
     */
    connectedCallback () {
      this.classList.add('hide')
    }

    /**
     * Appends the message into the message container.
     *
     * @param {string} message - The message.
     */
    appendMessage (message) {
      const div = document.createElement('div')
      div.classList.add('message')
      div.textContent = `${(this.sender ?? '')}: ${message}`
      this.messageContainer.appendChild(div)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this.messageContainer.textContent = ''
    }
  }
)
