/**
 * The app window web component module.
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
        height:550px;
        width: 750px;
        background: whitesmoke;
        position:absolute;
        left:200px;
        border: 2px solid black;
        border-radius: 10px;
        box-shadow: 1px 1px 1px 1px black;
    }
    #header{
        background-color:grey;
        position:relative;
        width:100%;
        height:50px;
        border-bottom:2px solid black;
        cursor:move;
        border-radius: 5px;
    }
    #close-btn{
      position:absolute;
        background-color:grey;
      right:0px;
      top: 0px;
      border-radius: 5px;
      height:100%;
      width:50px;
      border:none;
      font-size:1rem;
    }
    #close-btn:hover{
      background-color: #DE3434;
      color: whitesmoke;
    }
</style>
    <div class="app-window">
    <div id="header">
    <button id="close-btn" type="button">X</button>
    </div>
    <slot></slot>
    </div>
`

customElements.define(
  'app-window',

  /**
   * Represents an app window element.
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
       * References to elements in shadow DOM
       */
      this.draggableHeader = this.shadowRoot.querySelector('#header')
      this.container = this.shadowRoot.querySelector('.app-window')
      this.closeButton = this.shadowRoot.querySelector('#close-btn')

      /**
       * Refernces to properties.
       */
      this.newX = this.newX || 0
      this.newY = this.newY || 0
      this.initX = this.initX || 0
      this.initY = this.initY || 0

      this.isActive = false
      this.isfocus = 0
    }

    /**
     * Observes attributes for changes.
     *
     * @returns {string[]} - Array of observed attributes.
     */
    static get observedAttributes () {
      return ['focus-index', 'offset']
    }

    /**
     * Called when an observed attribute changes.
     *
     * @param {string} name - The attribute name.
     * @param {any} oldValue - The old attribute value.
     * @param {any} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'focus-index' && newValue !== oldValue) {
        this.style.setProperty('z-index', newValue)
      }
      if (name === 'offset' && newValue !== oldValue) {
        console.log(oldValue)
        this.style.setProperty('left', `${300 + Number.parseInt(newValue)}px`)
        this.style.setProperty('top', `${newValue}px`)
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.closeButton.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        this.dispatchEvent(new CustomEvent('close', {
          detail: this,
          bubbles: true
        }))
      })

      this.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        this.dispatchEvent(new CustomEvent('getfocus', {
          detail: this,
          bubbles: true
        }))
      })

      this.draggableHeader.addEventListener('mousedown', (event) => {
        this.storeMousePosition(event)
        this.isActive = true
        document.addEventListener('mousemove', (event) => {
          if (!this.isActive) return
          this.moveElement()
        })
      })

      document.addEventListener('mouseup', (event) => {
        this.isActive = false
      })
    }

    /**
     * Moves the element correlating to the mouse.
     *
     * @param {any} event - The triggered event.
     */
    moveElement (event) {
      event = event || window.event

      this.newY = this.initY - event.clientY
      this.newX = this.initX - event.clientX

      if (this.offsetLeft < 0) {
        this.style.setProperty('left', `${0}px`)
      } else if (this.offsetLeft + this.offsetWidth > window.innerWidth) {
        this.style.setProperty('left', `${window.innerWidth - this.offsetWidth}px`)
      } else {
        this.style.setProperty('left', `${this.offsetLeft - this.newX}px`)
      }

      if (this.offsetTop < 0) {
        this.style.setProperty('top', `${0}px`)
      } else if (this.offsetTop + this.offsetHeight > window.innerHeight) {
        this.style.setProperty(
          'top',
          `${window.innerHeight - this.offsetHeight}px`
        )
      } else {
        this.style.setProperty('top', `${this.offsetTop - this.newY}px`)
      }

      this.initY = event.clientY
      this.initX = event.clientX
    }

    /**
     * Stores initial position.
     *
     * @param {any} event - The triggered event.
     */
    storeMousePosition (event) {
      event = event || window.event
      this.initX = event.clientX
      this.initY = event.clientY
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {}
  }
)
