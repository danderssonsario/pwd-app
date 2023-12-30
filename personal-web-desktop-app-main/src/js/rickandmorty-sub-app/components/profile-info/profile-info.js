
/**
 * The profile info web component module.
 *
 * @author Daniel <da222xg@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
  <style>
  :host{
    display: block;
    margin:0;
  }

  :host li{
    list-style: none;
    margin:1px;
  }
  </style>

  <ul class="info-list">
  </ul>
`

customElements.define(
  'profile-info',

  /**
   * Represents a profile info element.
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
      this.infoList = this.shadowRoot.querySelector('.info-list')

      this._profileInfo = {}
    }

    /**
     * Gets the profile info.
     *
     * @returns {object} - Reference to empty object.
     */
    get profileInfo () {
      return this._profileInfo
    }

    /**
     * Sets the profile info.
     *
     * @param {object} data - Object containing the data.
     */
    set profileInfo (data) {
      this._profileInfo = {
        'No. of appearances': data.episode.length,
        Gender: data.gender,
        Location: data.location.name,
        Origin: data.origin.name,
        Species: data.species,
        Status: data.status
      }
    }

    /**
     * Observes attributes for changes.
     *
     * @returns {string[]} - Array of observed attributes.
     */
    static get observedAttributes () {
      return ['update']
    }

    /**
     * Called when an observed attribute changes.
     *
     * @param {string} name of the attribute.
     * @param {any} oldValue the old attribute value.
     * @param {any} newValue the new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'update') {
        this.infoList.textContent = ''
        this.updateRendering()
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
    }

    /**
     * Updates the data displayed.
     */
    updateRendering () {
      for (const prop in this._profileInfo) {
        const listItem = document.createElement('li')
        listItem.textContent = `${prop} : ${this._profileInfo[prop]}`
        this.infoList.appendChild(listItem)
      }
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {}
  }
)
