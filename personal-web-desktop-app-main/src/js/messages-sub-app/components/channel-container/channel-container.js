/**
 * The channel container web component module.
 *
 * @author Daniel Andersson <da222xg@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
:host {
  display:block;
  font-family: Arial, sans-serif;
  margin: 10px;
}

p{
  margin: 2px;
  font-size:1.25rem;
  font-weight:600;
}
button {
  padding: 2px;
}

[hide] {
  display:none;
}
:host(.hide){
  display:none;
}
</style>

<button id="create-btn">Create a private channel.</button>
  <form id="channel-form">
      <input type="text" id="channel-input" placeholder="Channel name"/>
      <button type="submit" id="join-btn">Join</button>
  </form>
<div class="channel-container">
  <p id="channel"></p>
  <button id="leave-btn">Leave Channel</button>
</div
`

customElements.define(
  'channel-container',

  /**
   * Represents a channel container element.
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
      this.createBtn = this.shadowRoot.querySelector('#create-btn')
      this.joinBtn = this.shadowRoot.querySelector('#join-btn')
      this.channelForm = this.shadowRoot.querySelector('#channel-form')
      this.channelName = this.shadowRoot.querySelector('#channel-input')
      this.leaveBtn = this.shadowRoot.querySelector('#leave-btn')
      this.channelContainer = this.shadowRoot.querySelector('.channel-container')
      this.channel = this.shadowRoot.querySelector('#channel')
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
      // Hide elements by default.
      this.classList.add('hide')
      this.channelForm.toggleAttribute('hide')
      this.leaveBtn.toggleAttribute('hide')

      this.createBtn.addEventListener('click', event => {
        event.preventDefault()
        event.stopPropagation()
        this.initChannelForm()
      })

      this.joinBtn.addEventListener('click', event => {
        event.preventDefault()
        event.stopPropagation()
        this.configChannel(event)
      })

      this.leaveBtn.addEventListener('click', event => {
        event.preventDefault()
        event.stopPropagation()
        this.leaveChannel()
      })
    }

    /**
     * Display the Channel form.
     */
    initChannelForm () {
      this.channelForm.toggleAttribute('hide')
      this.channelForm.focus()
    }

    /**
     * Configures a private channel and dispatches a custom event.
     */
    configChannel () {
      this.dispatchEvent(new CustomEvent('join', {
        detail: this.channelName.value,
        bubbles: true
      }))

      // show
      this.leaveBtn.toggleAttribute('hide')

      // hide
      this.channelForm.toggleAttribute('hide')
      this.createBtn.toggleAttribute('hide')

      // Display name of the new channel.
      this.channel.textContent = `Channel: ${this.channelName.value}`
      this.channelContainer.insertBefore(this.channel, this.leaveBtn)
    }

    /**
     * Dispatches a custom event to indicate leaving the private channel.
     */
    leaveChannel () {
      // hide
      this.channel.textContent = ''
      this.leaveBtn.toggleAttribute('hide')

      // show
      this.createBtn.toggleAttribute('hide')

      this.dispatchEvent(new CustomEvent('leave', {
        bubbles: true
      }))
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this.leaveChannel()
    }
  }
)
