import { IonPage } from '@ionic/react';
import React, { lazy, useContext, useRef, useState } from 'react';
import Modite, { defaultModite } from '../../models/Modite';
import ModiteContext from '../../state/modite';
import ModitesContext from '../../state/modites';
import s from './styles.module.css';

const ModiteList = lazy(() =>
  import('../../components/ModiteList' /* webpackChunkName: "modite-list", webpackPrefetch: true  */),
);

const MapComponent = lazy(() =>
  import('../../components/MapComponent' /* webpackChunkName: "maps", webpackPrefetch: true  */),
);

function App() {
  const [activeModite, setActiveModite]: [Modite, React.Dispatch<any>] = useContext(ModiteContext);
  const [modites]: [Modite[]] = useContext(ModitesContext);
  const slidesRef: React.MutableRefObject<null> = useRef(null);

  const onModiteClick = (modite: Modite) => {
    setActiveModite(modite);
  };

  return (
    <IonPage>
      <div className={s.mapCt}>
        <div className={s.mapWrap}>
          <MapComponent modites={modites} />
          <div className={s.mapOverlay} />
        </div>
      </div>
      <ModiteList
        onModiteItemClick={onModiteClick}
        activeModite={activeModite}
        slides={slidesRef}
      />
    </IonPage>
  );
}

export default App;
