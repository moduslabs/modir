import React, { lazy, Suspense, useState, useRef } from 'react';
import { IonApp, IonPage, IonContent, IonSlides, IonSlide } from '@ionic/react';
import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import './theme.css';
import s from './styles.module.css';
import Modite, { defaultModite } from '../../models/Modite';

const ModiteList = lazy(() =>
  import('../ModiteList' /* webpackChunkName: "modite-list", webpackPrefetch: true  */)
);
const ModiteDetails = lazy(() =>
  import('../ModiteDetails' /* webpackChunkName: "modite-details", webpackPrefetch: true  */)
);
const GlobeComponent = lazy(() =>
  import('../GlobeComponent' /* webpackChunkName: "globe-component", webpackPrefetch: true  */)
);

const slideStyle: { [key: string]: string } = {
  height: '100vh',
  flexDirection: 'column',
};

function App() {
  const [activeModite, setActiveModite]: [Modite, React.Dispatch<any>] = useState(defaultModite);
  const slidesRef: React.MutableRefObject<null> = useRef(null);
  const globeRef: React.MutableRefObject<null> = useRef(null);
  let showGlobe: boolean = false;

  const toggleShowGlobe = () => {
    showGlobe = !showGlobe;
    if(globeRef.current) {
      (globeRef.current as any).classList[showGlobe ? 'add' : 'remove'](s.showGlobe);
    }
  };

  return (
    <IonApp>
      <Suspense fallback={<IonContent>Loading...</IonContent>}>
        <IonPage>
          <IonContent>
            <IonSlides ref={slidesRef}>

              <IonSlide style={slideStyle}>
                <div className={s.globeCt} ref={globeRef}>
                  <GlobeComponent></GlobeComponent>
                </div>
                <ModiteList onModiteItemClick={setActiveModite} activeModite={activeModite} slides={slidesRef} toggleShowGlobe={toggleShowGlobe}/>
              </IonSlide>

              <IonSlide style={slideStyle} class={s.detailPage}>
                <ModiteDetails modite={activeModite} slides={slidesRef}/>
              </IonSlide>

            </IonSlides>
          </IonContent>
        </IonPage>
      </Suspense>
    </IonApp>
  );
}

export default App;
