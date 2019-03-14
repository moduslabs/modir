import React, { lazy } from 'react';
import { IonIcon } from '@ionic/react';
import Modite from '../../models/Modite';
import s from './styles.module.css';

const MapComponent = lazy(() =>
  import('../MapComponent' /* webpackChunkName: "maps", webpackPrefetch: true  */)
);

// TODO: I'm sure there's a way to type this correctly, but I wasn't able to sort it out, yet...
const slides: any = document.getElementById('slides');

// closes the details panel
const closeDetails = (): void => {
  slides.slideNext();
}

const defaultModite: Modite = ({ profile: {}} as Modite);

function ModiteDetails({ modite = defaultModite }: { modite?: Modite }) {
  return (
    <>
      <div className={s.detailsCt}>
        <IonIcon name="close-circle" class={s.closeIcon} onClick={closeDetails}></IonIcon>

        <img src={modite.profile.image_192} />
        <div>{modite.real_name}</div>
        <div>{modite.localDate} {modite.localTime}</div>
        <hr />
        <div>{modite.profile.title}</div>
      </div>
      <div className={s.detailsMapCt}>
        <MapComponent />
      </div>
    </>
  );
}

export default ModiteDetails;
