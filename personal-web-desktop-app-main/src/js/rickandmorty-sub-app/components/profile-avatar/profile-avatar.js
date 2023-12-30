/**
 * The profile avatar web component module.
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
      margin: auto;
      text-align:center;
      font-family: Arial, Helvetica, sans-serif;
      padding: 10px;
      font-size: 1.25rem;
    }

    .avatar-img {
      margin-left:auto;
      margin-right:auto;
      display:block;
      width:150px;
      height: 150px;
      object-fit:cover;
          box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.2);

    }
    
  </style>

  <div class="avatar-container">
    <img class="avatar-img" alt="Profile image" />
    <div class="avatar-name">hej</div>
  </div>
`

customElements.define(
  'profile-avatar',

  /**
   * Represents a profile avatar element.
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
       * References to elements in the Shadow DOM.
       */
      this.avatarContainer = this.shadowRoot.querySelector('.avatar-container')
      this.avatarImage = this.shadowRoot.querySelector('.avatar-img')
      this.avatarName = this.shadowRoot.querySelector('.avatar-name')
    }

    /**
     * Observes attributes for changes.
     *
     * @returns {string[]} - Array of observed attributes.
     */
    static get observedAttributes () {
      return ['name', 'img']
    }

    /**
     * Called when an observed attribute changes.
     *
     * @param {string} name - The attribute name.
     * @param {any} oldValue - The old attribute value.
     * @param {any} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'name' && newValue !== oldValue) {
        this.avatarName.textContent = newValue
      }
      if (name === 'img' && newValue !== oldValue) {
        this.avatarImage.setAttribute('src', newValue)
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {}

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {}
  }
)
