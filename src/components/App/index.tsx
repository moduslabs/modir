import React, { lazy, Suspense } from 'react';
import { IonApp, IonPage, IonContent } from '@ionic/react';
import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import './theme.css';

const ModiteList = lazy(() =>
  import('../ModiteList' /* webpackChunkName: "modite-list", webpackPrefetch: true  */)
);

function App() {
  return (
    <IonApp>
      <Suspense fallback={<IonContent>Loading...</IonContent>}>
        <IonPage>
          <ModiteList />
        </IonPage>
      </Suspense>
    </IonApp>
  );
}

export default App;
