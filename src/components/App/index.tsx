import React, { lazy, Suspense, useState } from 'react';
import { IonApp, IonPage, IonContent, IonSlides, IonSlide } from '@ionic/react';
import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import './theme.css';
import s from './styles.module.css';

const ModiteList = lazy(() =>
  import('../ModiteList' /* webpackChunkName: "modite-list", webpackPrefetch: true  */)
);
const ModiteDetails = lazy(() =>
  import('../ModiteDetails' /* webpackChunkName: "modite-details", webpackPrefetch: true  */)
);

const slideStyle = {
  height: '100vh',
  flexDirection: 'column',
};

const slidesOptions = {
  initialSlide: 1,
};

function App() {
  const [activeModite, setActiveModite] = useState();

  return (
    <IonApp>
      <Suspense fallback={<IonContent>Loading...</IonContent>}>
        <IonPage>
          <IonContent>
            <IonSlides options={slidesOptions} id="slides">

              <IonSlide style={slideStyle} class={s.detailPage}>
                <ModiteDetails modite={activeModite}/>
              </IonSlide>

              <IonSlide style={slideStyle}>
                <ModiteList onModiteItemClick={setActiveModite}/>
              </IonSlide>

            </IonSlides>
          </IonContent>
        </IonPage>
      </Suspense>
    </IonApp>
  );
}

export default App;
