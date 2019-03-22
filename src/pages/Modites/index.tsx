import React, { lazy, useState, useRef, useContext } from 'react';
import { IonPage } from '@ionic/react';
import Modite from '../../models/Modite';
import ModiteContext from '../../state/modite';

const ModiteList = lazy(() =>
  import('../../components/ModiteList' /* webpackChunkName: "modite-list", webpackPrefetch: true  */),
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

  return (
    <IonPage>
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
