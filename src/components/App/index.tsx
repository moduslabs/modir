// tslint:disable-next-line: no-implicit-dependencies
import '@ionic/core/css/core.css';
// tslint:disable-next-line: no-implicit-dependencies
import '@ionic/core/css/ionic.bundle.css';
import { IonApp, IonContent } from '@ionic/react';
import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import IModite from '../../models/Modite';
import { ModiteContextProvider } from '../../state/modite';
import { ModitesContextProvider } from '../../state/modites';
import './styles.module.css';
import './theme.css';

const Modites = lazy(() =>
  import('../../pages/Modites' /* webpackChunkName: "page-modites", webpackPrefetch: true  */),
);

const Details = lazy(() =>
  import('../../pages/Details' /* webpackChunkName: "page-details", webpackPrefetch: true  */),
);

const Globe = lazy(() =>
  import('../../pages/Globe' /* webpackChunkName: "page-globe", webpackPrefetch: true  */),
);

function App() {
  const [activeModite, setActiveModite]: [IModite, React.Dispatch<any>] = useState();
  const [modites, setModites]: [IModite[], React.Dispatch<any>] = useState();

  return (
    <IonApp>
      <Suspense fallback={<IonContent>Loading...</IonContent>}>
        <ModiteContextProvider value={[activeModite, setActiveModite]}>
          <ModitesContextProvider value={[modites, setModites]}>
            <main role="main">
              <Router>
                <Route path="/" exact component={Modites} />
                <Route path="/details" exact component={Details} />
                <Route path="/details/:id" component={Details} />
                <Route path="/globe" exact component={Globe} />
              </Router>
            </main>
          </ModitesContextProvider>
        </ModiteContextProvider>
      </Suspense>
    </IonApp>
  );
}

export default App;
