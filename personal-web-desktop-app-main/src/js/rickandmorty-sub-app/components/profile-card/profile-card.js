/**
 * The profile card web component module.
 *
 * @author Daniel <da222xg@student.lnu.se>
 * @version 1.1.0
 */

import '../profile-avatar'
import '../profile-info'

// Define template.
const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host{
    display: flex;
    justify-content: center;
    align-items: center;
    border: 4px solid black;
    width:40%;
    height: 100%;
    margin: 15px auto;
    border-radius: 10px;
    box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.4);
    }

  </style>

  <div class="container">
    <profile-avatar></profile-avatar>
    <profile-info></profile-info>
  </div>
`

customElements.define(
  'profile-card',

  /**
   * Represents a profile card element.
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      /**
       * Attach a shadow root tree and append template,
       */
      this.attachShadow({ mode: 'open' }).appendChild(
        template.content.cloneNode(true)
      )

      this.infoContainer = this.shadowRoot.querySelector('profile-info')
      this.avatarContainer = this.shadowRoot.querySelector('profile-avatar')

      this._fetchData = []
    }

    /**
     * Gets fetched data.
     *
     * @returns {any} - Reference to empty array.
     */
    get fetchData () {
      return this._fetchData
    }

    /**
     * Sets the fetched data.
     *
     * @param {object[]} value - Array of objects.
     */
    set fetchData (value) {
      this._fetchData = value
    }

    /**
     * Observes attributes for changes on the element.
     *
     * @returns {string[]} - Array of observed attributes.
     */
    static get observedAttributes () {
      return ['profile']
    }

    /**
     * Called when an observed attribute changes.
     *
     * @param {string} name of the attribute.
     * @param {any} oldValue the old attribute value.
     * @param {any} newValue the new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'profile' && newValue !== oldValue) {
        this.setAttribute('profile', newValue)
        this.injectData(this._fetchData)
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {}

    /**
     * Injects data in nested components.
     *
     * @param {object} data - Object containing the data.
     */
    injectData (data) {
      this.avatarContainer.setAttribute('img', data.image)
      this.avatarContainer.setAttribute('name', data.name)
      this.infoContainer.profileInfo = data
      this.infoContainer.toggleAttribute('update')
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {}
  }
)
