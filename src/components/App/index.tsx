import '@ionic/core/css/core.css'
import '@ionic/core/css/ionic.bundle.css'
import { IonApp, IonContent } from '@ionic/react'
import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { ActiveModiteProvider } from '../../state/ActiveModite'
import { ModitesProvider } from '../../state/modites'
import './styles.module.css'
import './theme.css'

const Modites = lazy(() => import('../../pages/Modites' /* webpackChunkName: "page-modites", webpackPrefetch: true  */))

const App = () => (
  <IonApp>
    <Suspense fallback={<IonContent>Loading...</IonContent>}>
      <ModitesProvider>
        <ActiveModiteProvider>
          <main role="main">
            <Router>
              <Route path="*" component={Modites} />
            </Router>
          </main>
        </ActiveModiteProvider>
      </ModitesProvider>
    </Suspense>
  </IonApp>
)

export default App
