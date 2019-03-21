import React, { lazy } from 'react';
import { IonIcon } from '@ionic/react';
import { defaultModite } from '../../models/Modite';
import s from './styles.module.css';
import ModiteDetailsProps from '../../models/ModiteDetailsProps';

const MapComponent = lazy(() =>
  import('../MapComponent' /* webpackChunkName: "maps", webpackPrefetch: true  */)
);

function ModiteDetails({ modite = defaultModite, slides }: ModiteDetailsProps) {
  // closes the details panel
  const closeDetails = (): void => {
    slides.current.slideNext();
  }

  return (
    <>
      <div className={s.detailsCt}>
        <IonIcon name="close-circle" class={s.closeIcon} onClick={closeDetails}></IonIcon>

        <img src={modite.profile.image_192} />
        <div>{modite.real_name}</div>
        <div>{modite.profile.fields && modite.profile.fields.gitHubUser}</div>
        <div>{modite.localDate} {modite.localTime}</div>
        <hr />
        <div>{modite.profile.title}</div>
      </div>
      <div className={s.detailsMapCt}>
        <MapComponent modite={modite}/>
      </div>
    </>
  );
}

export default ModiteDetails;
