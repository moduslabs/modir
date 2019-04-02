import React from 'react'
import ReactDOM from 'react-dom'
import initAuth from './auth'
import App from './components/App'
import * as serviceWorker from './serviceWorker'

function init() {
  ReactDOM.render(<App />, document.getElementById('root'))
}

if (document.location.search.match(/moduslabsci/)) {
  init()
} else {
  initAuth(init)
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register()
