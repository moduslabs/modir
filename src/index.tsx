import React, { Suspense, useState } from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'

let doInit: boolean | (() => void)

const App = React.lazy(() => import('./components/App') /* webpackChunkName: "modir-app", webpackPrefetch: true  */)

type GetAuthResponse = () => {
  id_token: string
}

const Boot = () => {
  const [booted, setBooted] = useState(false)

  if (doInit) {
    doInit = false

    setBooted(true)
  } else {
    doInit = () => {
      doInit = false

      setBooted(true)
    }
  }

  if (!booted) {
    return null
  }

  return (
    <Suspense fallback={<div />}>
      <App />
    </Suspense>
  )
}

function initApp(googleUser: { getAuthResponse: GetAuthResponse } | void) {
  // false means the app has been booted
  if (doInit !== false) {
    if (googleUser) {
      localStorage.setItem('token', googleUser.getAuthResponse().id_token)
    }

    const googleLoader = document.getElementById('googleLoader')

    if (googleLoader) {
      document.body.removeChild(googleLoader)
    }

    if (doInit && doInit !== true) {
      doInit()
    } else {
      doInit = true
    }
  }
}

ReactDOM.render(<Boot />, document.getElementById('root'))

// If the app is offline, try to load it using cached data
if ((!navigator.onLine || process.env.NODE_ENV === 'development') && localStorage.getItem('token')) {
  initApp()
}

// @ts-ignore
globalThis.initApp = initApp

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
