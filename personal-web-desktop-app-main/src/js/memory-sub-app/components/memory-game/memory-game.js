import '../memory-tile/index.js'
/**
 * Memory game web component.
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
  margin:0;
  width:100%;
  height:500px;
  display:block;
}
#game-tiles{
display: grid;
  align-items:center;
  justify-content:center;
grid-template-columns: repeat(4, 100px);
grid-gap: 10px;
}
:host(:focus){
  outline:none;
}

</style>

  <div class="memory-game">
    <start-page></start-page>
    <flip-counter></flip-counter>
    <seconds-timer></seconds-timer>
    <div id="game-tiles"></div>
    <end-page></end-page>
  </div>
`

customElements.define(
  'memory-game',

  /**
   * Represent a memory game element.
   */
  class extends HTMLElement {
    /**
     * Private properties.
     */
    #isFirstFlip = true
    #firstFlippedTile
    #secondFlippedTile
    #count = 0
    #MATCHED_TILES_URL = '../../../img/memory-app-images/check.png'
    #tilesLeft
    #playingTiles

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      /**
       * Attach a shadow root to the element and append template.
       */
      this.attachShadow({ mode: 'open' }).appendChild(
        template.content.cloneNode(true)
      )

      /**
       * References to elements in shadow DOM
       */
      this.tileContainer = this.shadowRoot.querySelector('#game-tiles')

      /**
       * References to nested web components
       */
      this.flipCounter = this.shadowRoot.querySelector('flip-counter')
      this.startPage = this.shadowRoot.querySelector('start-page')
      this.endPage = this.shadowRoot.querySelector('end-page')
      this.secondsTimer = this.shadowRoot.querySelector('seconds-timer')
      this.tileArray = []
      this.tileFocusIndex = 0

      /**
       * Reference to image array.
       */
      this._images = [
        { name: 'youtube', url: '../../img/memory-app-images/youtube.png' },
        { name: 'youtube', url: '../../img/memory-app-images/youtube.png' },
        { name: 'snapchat', url: '../../img/memory-app-images/snapchat.png' },
        { name: 'snapchat', url: '../../img/memory-app-images/snapchat.png' },
        { name: 'twitter', url: '../../img/memory-app-images/twitter.png' },
        { name: 'twitter', url: '../../img/memory-app-images/twitter.png' },
        { name: 'slack', url: '../../img/memory-app-images/slack.png' },
        { name: 'slack', url: '../../img/memory-app-images/slack.png' },
        { name: 'linkedin', url: '../../img/memory-app-images/linkedin.png' },
        { name: 'linkedin', url: '../../img/memory-app-images/linkedin.png' },
        { name: 'facebook', url: '../../img/memory-app-images/facebook.png' },
        { name: 'facebook', url: '../../img/memory-app-images/facebook.png' },
        { name: 'reddit', url: '../../img/memory-app-images/reddit.png' },
        { name: 'reddit', url: '../../img/memory-app-images/reddit.png' },
        { name: 'instagram', url: '../../img/memory-app-images/instagram.png' },
        { name: 'instagram', url: '../../img/memory-app-images/instagram.png' }
      ]
    }

    /**
     * Observe attributes for changes.
     *
     * @returns {string[]} - Array of observed attributes.
     */
    static get observedAttributes () {
      return ['tiles']
    }

    /**
     * Called when an observed attribute changes.
     *
     * @param {string} name - The attribute name.
     * @param {any} oldValue - The old attribute value.
     * @param {any} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'tiles') {
        if (newValue === '4') {
          this.tileContainer.style.setProperty(
            'grid-template-columns',
            'repeat(2, 100px)'
          )
        }
        this.renderTiles(Number.parseInt(newValue))
      }
    }

    /**
     * Called by the browser after the elemtent gets inserted into the DOM.
     */
    connectedCallback () {
      // Hide components by default
      this.flipCounter.classList.add('hide')
      this.endPage.classList.add('hide')

      this.setAttribute('tabindex', 0)
      this.focus()
      this.addEventListener('keyup', (event) => {
        event.preventDefault()
        event.stopPropagation()
        this.keyboardHandler(event.key)
      })

      this.endPage.addEventListener('return', (event) => {
        this.endPage.classList.add('hide')
        this.startPage.classList.remove('hide')
      })

      this.addEventListener('start', (event) => {
        this.flipCounter.classList.remove('hide')
        this.secondsTimer.classList.remove('hide')

        this.setAttribute('tiles', event.detail.id)
        this.secondsTimer.toggleAttribute('run')
      })

      this.tileContainer.addEventListener('flip', (event) => {
        this.checkFlip(event.detail)
      })
    }

    /**
     * Shuffles image array.
     *
     * @param {object[]} tiles - The image array to use for the game.
     */
    shuffleTiles (tiles) {
      for (let i = 0; i < tiles.length; i++) {
        // Grab a random index...
        const j = Math.floor(Math.random() * tiles.length)
        // ...and swap that image with image at index i.
        ;[tiles[i], tiles[j]] = [tiles[j], tiles[i]]
      }
    }

    /**
     * Render the gaming tiles.
     *
     * @param {number} numberOfTiles - Number of tiles.
     */
    renderTiles (numberOfTiles) {
      // Splices the images to use and shuffle those.
      this.#playingTiles = [...this._images].splice(0, numberOfTiles)
      this.shuffleTiles(this.#playingTiles)

      this.#tilesLeft = this.#playingTiles.length

      // Render
      for (let i = 0; i < this.#playingTiles.length; i++) {
        const tile = document.createElement('memory-tile')
        tile.setAttribute('src', this.#playingTiles[i].url)
        tile.setAttribute('alt', this.#playingTiles[i].name)
        this.tileContainer.appendChild(tile)
      }
      // Reference to tiles.
      this.memoryTiles = this.shadowRoot.querySelectorAll('memory-tile')
    }

    /**
     * Check if first or second flip.
     *
     * @param {HTMLElement} flippedTile - The flipped tile.
     */
    checkFlip (flippedTile) {
      if (this.#isFirstFlip) {
        this.#firstFlippedTile = flippedTile
        this.#isFirstFlip = false
      } else {
        this.#secondFlippedTile = flippedTile
        this.#isFirstFlip = true
        this.flipCounter.setAttribute('count', (this.#count += 1))
        this.checkMatch()
      }
    }

    /**
     * Checks if match and handles outcome.
     */
    checkMatch () {
      // Disable flipping
      this.memoryTiles.forEach((tile) => {
        tile.toggleAttribute('disable')
      })

      // If match
      if (this.#firstFlippedTile.isEqualNode(this.#secondFlippedTile)) {
        setTimeout(() => {
          this.#firstFlippedTile.setAttribute('src', this.#MATCHED_TILES_URL)
          this.#secondFlippedTile.setAttribute('src', this.#MATCHED_TILES_URL)

          // Enable all tiles except the matched ones.
          this.memoryTiles.forEach((tile) => {
            if (
              !tile.isEqualNode(
                this.#firstFlippedTile || this.#secondFlippedTile
              )
            ) {
              tile.toggleAttribute('disable')
            }
          })
          this.checkTiles()
        }, 1000)
      } else {
        // Flip back and enable all.
        setTimeout(() => {
          this.#firstFlippedTile.setAttribute('class', '')
          this.#secondFlippedTile.setAttribute('class', '')

          this.memoryTiles.forEach((tile) => {
            tile.toggleAttribute('disable')
          })
        }, 1000)
      }
    }

    /**
     * Keep track of number of tiles left.
     */
    checkTiles () {
      this.#tilesLeft -= 2
      if (this.#tilesLeft === 0) {
        this.secondsTimer.toggleAttribute('run')
        this.endPage.setAttribute(
          'time',
          this.secondsTimer.getAttribute('time')
        )
        setTimeout(() => {
          this.endGame()
        }, 1000)
      }
    }

    /**
     * End of game handler.
     */
    endGame () {
      this.endPage.classList.remove('hide')
      this.endPage.setAttribute('attempts', this.#count)
      this.#count = 0
      this.flipCounter.setAttribute('count', this.#count)
      this.tileContainer.textContent = ''
      this.flipCounter.classList.add('hide')
      this.secondsTimer.classList.add('hide')
    }

    /**
     * Handler function for keyboard events.
     *
     * @param {any} key - The pressed key.
     */
    keyboardHandler (key) {
      const array = Array.from(this.tileContainer.childNodes)
      console.log(this.tileFocusIndex) // 2

      if (key === 'ArrowLeft') {
        this.tileFocusIndex--
        if (this.tileFocusIndex < 0) this.tileFocusIndex = this.#tilesLeft - 1

        array[this.tileFocusIndex].toggleAttribute('focus')

        if (
          (array[this.tileFocusIndex + 1] ?? array[0]).hasAttribute('focus')
        ) {
          ;(array[this.tileFocusIndex + 1] ?? array[0]).toggleAttribute('focus')
        }
      } else if (key === 'ArrowRight') {
        this.tileFocusIndex++
        if (this.tileFocusIndex > this.#tilesLeft - 1) this.tileFocusIndex = 0

        array[this.tileFocusIndex].toggleAttribute('focus')

        if (
          (
            array[this.tileFocusIndex - 1] ?? array[this.#tilesLeft - 1]
          ).hasAttribute('focus')
        ) {
          ;(
            array[this.tileFocusIndex - 1] ?? array[this.#tilesLeft - 1]
          ).toggleAttribute('focus')
        }
      } else if (key === ' ') {
        array[this.tileFocusIndex].toggleAttribute('flip')
      }
    }

    /**
     * Called when the element gets removed from the DOM.
     */
    disconnectedCallback () {}
  }
)
