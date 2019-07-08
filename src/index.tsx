import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import * as serviceWorker from './serviceWorker'

function initApp(googleUser: { getAuthResponse: Function } | void) {
  if (googleUser) {
    localStorage.setItem('token', googleUser.getAuthResponse().id_token)
  }

  ReactDOM.render(<App />, document.getElementById('root'))
}

// If the app is offline, try to load it using cached data
if (!navigator.onLine && localStorage.getItem('token')) {
  initApp()
}

// @ts-ignore
window.initApp = initApp

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register()
