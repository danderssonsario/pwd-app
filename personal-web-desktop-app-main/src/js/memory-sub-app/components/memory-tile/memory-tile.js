/**
 * Memory tile web component.
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

.tile {
  perspective: 1000px;
  height: 100px;
  width: 100px;
  position: relative;
}

:host(.flipped) .back-side {
  transition: transform 0.6s;
  transform: rotateY(180deg);
  transform-style: preserve-3d
}

:host(.flipped) #front-image {
  transition: transform 0.6s;
  transform: rotateY(360deg);
  transform-style: preserve-3d
}

#front-image, .back-side{
    width:100%;
    height:100%;
    border-radius:15px;
    position:absolute;
    backface-visibility: hidden;
    transform-style: preserve-3d
}

#front-image {
  transition: 0.6s;
  transform:rotateY(180deg);
}

.back-side{
    transition: 0.6s;
    transform: rotateY(0deg);
    background-color: black;
}

:host([focus]) .back-side{
  background-color: grey;
}
</style>
      <div class='tile'>
        <img id="front-image" />
        <div class="back-side"></div>
      </div>
`

customElements.define(
  'memory-tile',

  /**
   * Represent a memory card element.
   */
  class extends HTMLElement {
    /**
     * Reference to private property.
     */
    #lockTile = false
    /**
     * Creates an instance of the current type.
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
      this.memoryTile = this.shadowRoot.querySelector('.memory-tile')
      this.frontSide = this.shadowRoot.querySelector('.front-side')
      this.backSide = this.shadowRoot.querySelector('.back-side')
      this.frontImage = this.shadowRoot.querySelector('#front-image')
    }

    /**
     * Observe attributes for changes.
     *
     * @returns {string[]} - Array of observed attributes.
     */
    static get observedAttributes () {
      return ['src', 'disable', 'class', 'focus', 'hide', 'flip']
    }

    /**
     * Called when an observed attribute changes.
     *
     * @param {string} name - The attribute name.
     * @param {any} oldValue - The old attribute value.
     * @param {any} newValue - The new attribtue value-
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'src' && oldValue !== newValue) {
        this.frontImage.setAttribute('src', newValue)
      }

      if (name === 'disable') {
        this.hasAttribute('disable')
          ? (this.#lockTile = true)
          : (this.#lockTile = false)
      }

      if (name === 'class') {
        if (this.hasAttribute('flipped')) this.#lockTile = true
      }

      if (name === 'hide') this.style.setProperty('display', 'none')

      if (name === 'flip') {
        if (this.hasAttribute('flip')) this.flipTile(this)
      }
    }

    /**
     * Called after the element gets inserted into the DOM.
     */
    connectedCallback () {
      this.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        this.flipTile(event.target)
      })
    }

    /**
     * Flips the tile and dispatches a custom event.
     *
     * @param {HTMLElement} flippedTile - The tile to be flipped.
     */
    flipTile (flippedTile) {
      if (this.#lockTile) return
      this.classList.add('flipped')
      this.dispatchEvent(
        new window.CustomEvent('flip', {
          detail: flippedTile,
          bubbles: true
        })
      )
      this.#lockTile = true
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {}
  }
)
