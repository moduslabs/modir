import React, { Suspense, useState, lazy } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { IonApp, IonContent } from '@ionic/react';
import Modite from '../../models/Modite';
import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import './theme.css';
import './styles.module.css';

import { ModiteContextProvider } from '../../state/modite';
import { ModitesContextProvider } from '../../state/modites';

const Modites = lazy(() =>
  import('../../pages/Modites' /* webpackChunkName: "page-modites", webpackPrefetch: true  */),
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
                <Route path="*" component={Modites}/>
              </Router>
            </main>
          </ModitesContextProvider>
        </ModiteContextProvider>
      </Suspense>
    </IonApp>
  );
}

export default App;
