import React, { lazy, Suspense, useState, useRef } from 'react';
import { IonApp, IonPage, IonContent, IonSlides, IonSlide } from '@ionic/react';
import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import './theme.css';
import s from './styles.module.css';
import Modite from '../../models/Modite';

const ModiteList = lazy(() =>
  import('../ModiteList' /* webpackChunkName: "modite-list", webpackPrefetch: true  */)
);
const ModiteDetails = lazy(() =>
  import('../ModiteDetails' /* webpackChunkName: "modite-details", webpackPrefetch: true  */)
);

const slideStyle: { [key: string]: string } = {
  height: '100vh',
  flexDirection: 'column',
};

const slidesOptions: { [key: string]: any } = {
  initialSlide: 1,
};

function App() {
  const [activeModite, setActiveModite]: [Modite, React.Dispatch<any>] = useState();
  const slidesRef: React.MutableRefObject<null> = useRef(null);

  return (
    <IonApp>
      <Suspense fallback={<IonContent>Loading...</IonContent>}>
        <IonPage>
          <IonContent>
            <IonSlides options={slidesOptions} ref={slidesRef}>

              <IonSlide style={slideStyle} class={s.detailPage}>
                <ModiteDetails modite={activeModite} slides={slidesRef}/>
              </IonSlide>

              <IonSlide style={slideStyle}>
                <ModiteList onModiteItemClick={setActiveModite} slides={slidesRef}/>
              </IonSlide>

            </IonSlides>
          </IonContent>
        </IonPage>
      </Suspense>
    </IonApp>
  );
}

export default App;
