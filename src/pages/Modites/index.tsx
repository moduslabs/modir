import React, { lazy, useState, useRef, useContext } from 'react';
import { IonPage } from '@ionic/react';
import Modite, { defaultModite } from '../../models/Modite';
import ModiteContext from '../../state/modite';
import s from './styles.module.css';

const ModiteList = lazy(() =>
  import('../../components/ModiteList' /* webpackChunkName: "modite-list", webpackPrefetch: true  */),
);

const MapComponent = lazy(() =>
  import('../../components/MapComponent' /* webpackChunkName: "maps", webpackPrefetch: true  */),
);

function App() {
  // @ts-ignore
  const [activeModite, setActiveModite]: [Modite, React.Dispatch<any>] = useContext(ModiteContext);
  const [globe, setGlobe]: [Boolean, React.Dispatch<any>] = useState(false);
  const slidesRef: React.MutableRefObject<null> = useRef(null);

  const toggleShowGlobe = () => {
    setGlobe(!globe);
  };

  const onModiteClick = (modite: Modite) => {
    setActiveModite(modite);
  };

  defaultModite.profile.fields.Location = 'Boise, ID';
  defaultModite.profile.fields.locationData = {
    lat: 43.6007205,
    lon: -116.3739816
  };

  return (
    <IonPage>
      <div className={s.mapCt}>
        <MapComponent modite={defaultModite}/>
        <div className={s.mapOverlay}></div>
      </div>
      <ModiteList
        onModiteItemClick={onModiteClick}
        activeModite={activeModite}
        slides={slidesRef}
        toggleShowGlobe={toggleShowGlobe}
      />
    </IonPage>
  );
}

export default App;
