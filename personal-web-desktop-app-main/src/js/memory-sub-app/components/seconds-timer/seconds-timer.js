/**
 * The second timer web component module.
 *
 * @author Daniel Andersson <da222xg@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host{
        font-size: 1.5rem;
        font-family: Arial, helvetica, sans-serif;
        font-weight: 600;
    }

    
  :host(.hide) {
    display:none;
  }
  </style>


  <div class="timer"></div>
`

customElements.define(
  'seconds-timer',

  /**
   * Represents a seconds timer element.
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
       * Reference to element in the shadow DOM.
       */
      this.timer = this.shadowRoot.querySelector('.timer')
    }

    /**
     * Gets time elapsed.
     *
     * @returns {string} - Value of attribute 'time'.
     */
    get time () {
      return this.getAttribute('time')
    }

    /**
     * Sets the time.
     *
     * @param {string} value - String representing the time in seconds.
     */
    set time (value) {
      this.setAttribute('time', value)
    }

    /**
     * Observes attributes for changes.
     *
     * @returns {string[]} - Array of observed attributes.
     */
    static get observedAttributes () {
      return ['run']
    }

    /**
     * Called when an observed attribute changes.
     *
     * @param {string} name - The attribute name.
     * @param {any} oldValue - The old attribute value.
     * @param {any} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'run') {
        this.checkToggle()
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.checkToggle()
    }

    /**
     * Check toggle of run attribute.
     */
    checkToggle () {
      this.hasAttribute('run') ? this.initTimer() : this.stopTimer()
    }

    /**
     * Initializes the timer.
     */
    initTimer () {
      this.time = 0
      this.timer.textContent = `Time: ${this.time} s`

      this.startTimer()
    }

    /**
     * Starts the timer.
     */
    startTimer () {
      this.interval = window.setInterval(() => {
        this.timer.textContent = `Time: ${++this.time} s`
      }, 1000)
    }

    /**
     * Stops the timer.
     */
    stopTimer () {
      window.clearInterval(this.interval)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this.stopTimer()
    }
  }
)
