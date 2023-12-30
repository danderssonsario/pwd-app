/**
 * The search bar web component module.
 *
 * @author Daniel Andersson <da222xg@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
  <style>
  :host{
    margin-left: 25%;
    text-align:center;
    display:inline-block;
    width: 250px;
  }

  [hide]{
    display:none
  }

  #search-map li:hover{
      text-decoration:underline;
      cursor:pointer;
    }
  #search-map li {
      list-style: none;
      padding:1px;
      text-align:left;
      opacity:1;
    }
    #search-map{
      background:white;
      width:300px;
      margin: 10px;
      z-index: 10;
      position:absolute;
      opacity: 0.9;
    }
  </style>

  <div class="container>
  <form class="search-bar">

    <input type="text" id="input"/>

    <input type="submit" id="search-btn" value="Search"/>
  </form>
  <ul id="search-map"></ul>
  </div>
`

customElements.define(
  'search-bar',
  /**
   * Represents a search-bar element.
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' }).appendChild(
        template.content.cloneNode(true)
      )
      /**
       * References to elements in Shadow DOM.
       */
      this.searchBar = this.shadowRoot.querySelector('.search-bar')
      this.searchButton = this.shadowRoot.querySelector('#search-btn')
      this.input = this.shadowRoot.querySelector('#input')
      this.searchMap = this.shadowRoot.querySelector('#search-map')

      this._suggestions = []
    }

    /**
     * Gets suggestions.
     *
     * @returns {any[]} - Reference to array.
     */
    get suggestions () {
      return this._suggestions
    }

    /**
     * Sets suggestions.
     *
     * @param {object[]} values - Object data to display in search map.
     */
    set suggestions (values) {
      this._suggestions = values
    }

    /**
     * Observes Attributes for changes.
     *
     * @returns {string[]} - Array of observed attributes.
     */
    static get observedAttributes () {
      return ['hide', 'map', 'reset']
    }

    /**
     * Called when an observed attribute changes.
     *
     * @param {string} name of the attribute.
     * @param {any} oldValue the old attribute value.
     * @param {any} newValue the new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'hide') this.searchMap.toggleAttribute('hide')
      if (name === 'map') {
        if (this.hasAttribute('map')) this.renderSearchMap()
      }
      if (name === 'reset') this.searchMap.textContent = ''
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.input.addEventListener('input', (event) => {
        event.preventDefault()
        event.stopPropagation()
        this.getSuggestions(event.target.value)
      })

      this.searchButton.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        this.initSearch(this.input.value)
      })

      this.searchMap.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        this.input.value = ''
        this.toggleAttribute('reset')
        this.initSearch(Number.parseInt(event.target.getAttribute('id')))
      })
    }

    /**
     * Initializes a search by a custom event.
     *
     * @param {string} searchTerm - The search term.
     */
    initSearch (searchTerm) {
      this.dispatchEvent(new window.CustomEvent('search', {
        bubbles: true,
        detail: searchTerm
      }))
    }

    /**
     * Input handler.
     *
     * @param {string} input - The input.
     */
    getSuggestions (input) {
      if (input.length < 3) return
      this.initSearch(this.input.value)
    }

    /**
     * Displays search map of suggestions.
     */
    renderSearchMap () {
      this.searchMap.textContent = ''
      this._suggestions.forEach((suggestion) => {
        const listItem = document.createElement('li')
        listItem.setAttribute('id', suggestion.id)
        listItem.textContent = `${suggestion.name} #${suggestion.id}`
        this.searchMap.appendChild(listItem)
      })
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {
    }
  }
)
