import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import { IonApp, IonContent } from '@ionic/react';
import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Modite from '../../models/Modite';
import './styles.module.css';
import './theme.css';
import { ModiteContextProvider } from '../../state/modite';
import { ModitesContextProvider } from '../../state/modites';

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
  const [activeModite, setActiveModite]: [Modite, React.Dispatch<any>] = useState();
  const [modites, setModites]: [Modite[], React.Dispatch<any>] = useState();

  return (
    <IonApp>
      <Suspense fallback={<IonContent>Loading...</IonContent>}>
        <ModiteContextProvider value={[activeModite, setActiveModite]}>
          <ModitesContextProvider value={[modites, setModites]}>
            <main role="main">
              <Router>
                <Route path="/" exact={true} component={Modites} />
                <Route path="/details" exact={true} component={Details} />
                <Route path="/details/:id" component={Details} />
                <Route path="/globe" exact={true} component={Globe} />
              </Router>
            </main>
          </ModitesContextProvider>
        </ModiteContextProvider>
      </Suspense>
    </IonApp>
  );
}

export default App;
