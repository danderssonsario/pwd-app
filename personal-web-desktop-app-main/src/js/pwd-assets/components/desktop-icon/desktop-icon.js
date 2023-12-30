/**
 * Desktop icon web component module.
 *
 * @author Daniel Andersson <da222xg@student.lnu.se>
 * @version 1.1.0
 */

const ICON_IMG_URL = '../../../img/pwd-images/app-icon.png'

/**
 * Define template
 */
const template = document.createElement('template')
template.innerHTML = `
<style>
    :host{
        display:block;
        width: 80px;
        height: 100px;
        position:relative;
        top: 20%;
        left: 200px;
        margin: 15px;
        padding:15px;
        text-align:center;
        font-size: 20px;
        font-weight:600;
    }
    slot{
      width:100%;
    }
    #icon{
      max-width:100%;
      
    }
    :host(:hover){
        opacity: 0.6;
    }

</style>
    <img id="icon" alt="icon" />
    <slot></slot>
`

customElements.define(
  'desktop-icon',

  /**
   * Represent a desktop icon element.
   */
  class extends HTMLElement {
    /**
     * Create an instance of current type.
     */
    constructor () {
      super()

      /**
       * Attach a shadow root tree to the element and append template.
       */
      this.attachShadow({ mode: 'open' }).appendChild(
        template.content.cloneNode(true)
      )

      /**
       * References to elements in the shadow DOM.
       */
      this.icon = this.shadowRoot.querySelector('#icon')
      this.label = this.shadowRoot.querySelector('#label')
    }

    /**
     * Observes attributes for changes.
     *
     * @returns {string[]} - Array of observed attributes.
     */
    static get observedAttributes () {
      return ['label', 'src', 'id']
    }

    /**
     * Called when an observed attribute changes.
     *
     * @param {string} name - The attribute name.
     * @param {any} oldValue - The old attribute value.
     * @param {any} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'label' && newValue !== oldValue) {
        this.label.textContent = newValue
      }
      if (name === 'src' && newValue !== oldValue) {
        this.icon.setAttribute('src', newValue)
      }
      if (name === 'id' && newValue !== oldValue) {
        this.setAttribute('id', newValue)
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      if (!this.hasAttribute('src')) {
        this.icon.setAttribute('src', ICON_IMG_URL)
      }

      this.addEventListener('click', (event) => {
        event.preventDefault()
        this.launchApp(event.target)
      })
    }

    /**
     * Launches a new app by custom event.
     *
     * @param {any} app - The application to launch.
     */
    launchApp (app) {
      this.dispatchEvent(
        new CustomEvent('launch', {
          detail: app,
          bubbles: true
        })
      )
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {}
  }
)
