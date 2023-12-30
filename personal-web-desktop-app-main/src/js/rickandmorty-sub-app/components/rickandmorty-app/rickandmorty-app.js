/**
 * The rick and morty app component module.
 *
 * @author Daniel Andersson <da222xg@student.lnu.se>
 * @version 1.1.0
 */

import '../search-bar/index'
import '../profile-card/index'
import '../random-button/index'

// Define template.
const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host{
        width:100%;
        display: block;
        position:relative;
        max-height:500px;
        font-family: Arial, Helvetica, sans-serif;
    }

    #character-map li:hover{
      text-decoration:underline;
      cursor:pointer;
    }
    #character-map li {
      list-style: none;
      padding:1px;
      text-align:left;
    }
    #character-map{
      width:300px;
      margin: 10px;
    }

    h2{
      margin: 0;
      text-align: center;
    }
  </style>

  <div class="container">
    <h2>Search for a character or press the randomizer!</h2>
  <slot></slot>
  </div>
`

customElements.define(
  'rickandmorty-app',

  /**
   * Represents a rick and morty app element.
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
    }

    /**
     * Observes attribute for changes.
     *
     * @returns {string[]} - Array of observed attributes.
     */
    static get observedAttributes () {
      return []
    }

    /**
     * Called when an observed attribute changes.
     *
     * @param {string} name - The attribute name.
     * @param {any} oldValue - The old attribute value.
     * @param {any} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {}

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.initFetch()

      this.searchBar = document.createElement('search-bar')
      this.appendChild(this.searchBar)

      this.randomBtn = document.createElement('random-button')
      this.appendChild(this.randomBtn)

      this.addEventListener('get', (event) => {
        this.initSearch(event.detail)
      })

      this.addEventListener('search', (event) => {
        this.initSearch(event.detail)
      })
    }

    /**
     * Initializes fetch and stores total number of characters.
     */
    async initFetch () {
      this.allData = await this.fetchAll()
      this.randomBtn.setAttribute('total', `${this.allData.info.count}`)
    }

    /**
     * Fetches all characters.
     *
     * @returns {object} The response object.
     */
    async fetchAll () {
      const res = await window.fetch(
        'https://rickandmortyapi.com/api/character'
      )
      return await res.json()
    }

    /**
     * Makes a fetch request on the API.
     *
     * @param {number} id - Number representing a character id.
     * @returns {object} Promise waited to be parsed into object.
     */
    async fetchCharacterByID (id) {
      const res = await window.fetch(
        `https://rickandmortyapi.com/api/character/${id}`
      )

      return await res.json()
    }

    /**
     * Initializes search by deciding fetch parameter.
     *
     * @param {any} id - The fetch parameter.
     */
    async initSearch (id) {
      let data
      typeof id === 'number' ? data = await this.fetchCharacterByID(id) : data = await this.fetchCharacterByName(id)

      if (data?.results) {
        this.searchBar.suggestions = data.results
        this.searchBar.toggleAttribute('map')
      } else {
        this.displayCard(data)
      }
    }

    /**
     * Makes a fetch request on the API.
     *
     * @param {string} id - Search input.
     * @returns {object} Promise waited to be parsed into object.
     */
    async fetchCharacterByName (id) {
      try {
        const res = await window.fetch(
          `https://rickandmortyapi.com/api/character/?name=${id}`
        )

        if (!res.ok) throw new Error()

        return await res.json()
      } catch (e) {
        this.searchBar.toggleAttribute('reset')
      }
    }

    /**
     * Injects fetched data to profile card component.
     *
     * @param {object} characterData - The fetched object data.
     */
    displayCard (characterData) {
      if (!this.profileCard) {
        this.profileCard = document.createElement('profile-card')
        this.appendChild(this.profileCard)
      }
      this.profileCard.fetchData = characterData
      this.profileCard.setAttribute('profile', characterData.name)
    }

    /**
     * Called when the element has been removed from the DOM.
     */
    disconnectedCallback () {}
  }
)
