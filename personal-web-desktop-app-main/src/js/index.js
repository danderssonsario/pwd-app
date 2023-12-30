/**
 * The main script file of the PWD application.
 *
 * @author Daniel Andersson <da222xg@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Imports
 */
import './pwd-assets/components/app-window/index.js'
import './pwd-assets/components/desktop-icon'
import './messages-sub-app/messages-sub-app'
import './memory-sub-app/memory-sub-app'
import './rickandmorty-sub-app/custom-sub-app'

/**
 * Register service worker.
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js')
      console.log('Registration succesful', reg.scope)
    } catch (e) {
      console.log(e)
    }
  })
}

/**
 * Variables
 */
let appWindows
const pwdContainer = document.querySelector('.pwd-container')
let runningApplications = 0

/**
 * Eventlisteners
 */
document.addEventListener('getfocus', (event) => {
  appWindows.forEach((window) => {
    window.isEqualNode(event.detail)
      ? window.setAttribute('focus-index', `${runningApplications}`)
      : setIndex(window)
  })
})

document.addEventListener('close', (event) => {
  event.detail.remove()
  runningApplications--
})

pwdContainer.addEventListener('launch', (event) => {
  renderApplication(event.detail.id)
  runningApplications++
})

/**
 * Creates and append application into the DOM.
 *
 * @param {string} appID - ID of the app to launch.
 */
function renderApplication (appID) {
  const window = document.createElement('app-window')
  if (appID === 'memory') {
    const memoryApp = document.createElement('memory-game')
    window.appendChild(memoryApp)
  }
  if (appID === 'chat') {
    const messageApp = document.createElement('message-app')
    window.appendChild(messageApp)
  }
  if (appID === 'subapp') {
    const subApp = document.createElement('rickandmorty-app')
    window.appendChild(subApp)
  }
  window.setAttribute('offset', `${runningApplications * 50}`)
  window.setAttribute('focus-index', `${runningApplications}`)
  pwdContainer.appendChild(window)
  appWindows = document.querySelectorAll('app-window')
}

/**
 * Decides z-indexes of running applications.
 *
 * @param {HTMLElement} app - A running application.
 */
function setIndex (app) {
  let index = app.getAttribute('focus-index')
  if (index >= runningApplications) {
    index = runningApplications - 1
  } else index > 0 ? index-- : index = 0
  app.setAttribute('focus-index', index)
}
