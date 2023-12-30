/**
 * The message app web component module.
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
    max-height:100%;
    max-width:100%;
    overflow:auto;
    color:black;
  }
</style>

<div class="message-app">
      <name-form>Get to know new people! Enter a name to start chatting.</name-form>
      <channel-container></channel-container>
      <message-container></message-container>
      <send-form></send-form>
</div>
 `

customElements.define(
  'message-app',

  /**
   * Represents a message app element.
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
       * Reference to elements in the shadow DOM
       */
      this.messageApp = this.shadowRoot.querySelector('.message-app')

      // References to nested components
      this.messageContainer = this.shadowRoot.querySelector('message-container')
      this.nameForm = this.shadowRoot.querySelector('name-form')
      this.sendForm = this.shadowRoot.querySelector('send-form')
      this.channelContainer = this.shadowRoot.querySelector('channel-container')

      /**
       * Boilerplate message object.
       */
      this.messageObject = {
        type: 'message',
        data: '',
        username: '',
        key: process.env.WS_KEY
      }

      // Reference to websocket object
      this.ws = new WebSocket(process.env.WS_URL)
    }

    /**
     * Observes attributes for changes.
     *
     * @returns {string[]} Array of observed attributes..
     */
    static get observedAttributes () {
      return []
    }

    /**
     * Called by the browser when an observed attribute changes.
     *
     * @param {string} name of the attribute.
     * @param {any} oldValue the old attribute value.
     * @param {any} newValue the new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {}

    /**
     * Called by the browser after the element gets inserted into the DOM.
     */
    connectedCallback () {
      this.nameForm.addEventListener('init', (event) => {
        this.initChat(event)
      })
      this.sendForm.addEventListener('send', (event) => {
        this.messageObject.data = event.detail
        this.ws.send(JSON.stringify(this.messageObject))
      })

      this.channelContainer.addEventListener('join', (event) => {
        this.joinChannel(event)
      })

      this.channelContainer.addEventListener('leave', (event) => {
        this.leaveChannel()
      })

      this.ws.addEventListener('open', (event) => {})

      this.ws.addEventListener('message', (event) => {
        const messageData = JSON.parse(event.data)

        if (
          messageData.type === 'heartbeat' ||
          messageData.channel !== this.messageObject.channel
        ) { return }

        this.setMessage(messageData.username, messageData.data)
      })
    }

    /**
     * Sets channel property to chosen channel name.
     *
     * @param {any} event - The triggered event.
     */
    joinChannel (event) {
      this.messageObject.channel = event.detail
    }

    /**
     * Deletes channel property.
     */
    leaveChannel () {
      delete this.messageObject.channel
    }

    /**
     * Initializes chat.
     *
     * @param {event} event - The triggered event
     */
    initChat (event) {
      this.messageObject.username = event.detail
      this.messageContainer.classList.remove('hide')
      this.sendForm.classList.remove('hide')
      this.channelContainer.classList.remove('hide')
    }

    /**
     * Injects data to message container via attributes.
     *
     * @param {string} sender - The sender.
     * @param {string} message - The message.
     */
    setMessage (sender, message) {
      this.messageContainer.setAttribute('sender', sender)
      this.messageContainer.setAttribute('message', message)
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {}
  }
)
