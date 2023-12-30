/**
 * Flip counter web component.
 *
 * @author Daniel Andersson <da222xg@student.lnu.se>
 * @version 1.1.0
 */

/**
 * Define template
 */
const template = document.createElement('template')
template.innerHTML = `
<style>
    :host{
      font-size: 1.5rem;
      font-weight: 600;
      font-family: Arial, Helvetica, sans-serif;
    }
    :host(.hide){
      display:none;
    }
</style>
    <div class="flip-counter"><slot></slot></div>
`

customElements.define(
  'flip-counter',
  /**
   * Represent a flip counter element.
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      /**
       * Attach a shadow root tree to the element and append template
       */
      this.attachShadow({ mode: 'open' }).appendChild(
        template.content.cloneNode(true)
      )

      /**
       * References to elements in the shadow DOM.
       */
      this.flipCounter = this.shadowRoot.querySelector('.flip-counter')
    }

    /**
     * Gets the count.
     *
     * @returns {any} - Value of attribute 'count'.
     */
    get count () {
      return this.getAttribute('count')
    }

    /**
     * Sets count.
     *
     * @param {string} value - Value to be set.
     */
    set count (value) {
      this.setAttribute('count', value)
    }

    /**
     * Observe attributes for changes.
     *
     * @returns {string[]} - Array of observed attributes.
     */
    static get observedAttributes () {
      return ['count']
    }

    /**
     * Called when an observed attribute changes.
     *
     * @param {string} name - The attribute name.
     * @param {any} oldValue - The old attribute value.
     * @param {any} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'count' && oldValue !== newValue) {
        this.flipCounter.textContent = `Flips: ${newValue}`
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.flipCounter.textContent = 'Flips: 0'
    }

    /**
     * Called after the element has been removed fom the DOM.
     */
    disconnectedCallback () {
      this.flipCounter.textContent = ''
    }
  }
)
