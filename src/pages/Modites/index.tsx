import React, { lazy, useRef, useContext } from 'react';
import { IonPage } from '@ionic/react';
import Modite from '../../models/Modite';
import ModiteContext from '../../state/modite';
import s from './styles.module.css';
import ModitesContext from '../../state/modites';

const ModiteList = lazy(() =>
  import('../../components/ModiteList' /* webpackChunkName: "modite-list", webpackPrefetch: true  */),
);

const MapComponent = lazy(() =>
  import('../../components/MapComponent' /* webpackChunkName: "maps", webpackPrefetch: true  */),
);

function Modites({ view }: { view?: string }) {
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
          <MapComponent modites={modites}/>
          <div className={s.mapOverlay}></div>
        </div>
      </div>
      <ModiteList
        onModiteItemClick={onModiteClick}
        activeModite={activeModite}
        slides={slidesRef}
        view={view}
      />
    </IonPage>
  );
}

export default Modites;
