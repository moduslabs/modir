import '@ionic/core/css/core.css'
import '@ionic/core/css/ionic.bundle.css'
import { IonApp } from '@ionic/react'
import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
// @ts-ignore
import { LastLocationProvider } from 'react-router-last-location'
import { DataProvider } from '../../service/Data'
import './styles.module.css'
import './theme.css'

const Modites = lazy(() => import('../../pages/Modites' /* webpackChunkName: "page-modites", webpackPrefetch: true  */))

const App = () => (
  <IonApp>
    <Suspense fallback={<div className="loader" />}>
      <DataProvider>
        <main role="main">
          <Router>
            <LastLocationProvider>
              <Route path="*" component={Modites} />
            </LastLocationProvider>
          </Router>
        </main>
      </DataProvider>
    </Suspense>
  </IonApp>
)

export default App
