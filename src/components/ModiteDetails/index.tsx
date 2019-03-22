import React, { lazy } from 'react';
import { IonIcon, IonBadge } from '@ionic/react';
import { defaultModite } from '../../models/Modite';
import s from './styles.module.css';
import ModiteDetailsProps from '../../models/ModiteDetailsProps';

const MapComponent = lazy(() =>
  import('../MapComponent' /* webpackChunkName: "maps", webpackPrefetch: true  */)
);

function ModiteDetails({ modite = defaultModite, slides }: ModiteDetailsProps) {
  // closes the details panel
  const closeDetails = (): void => {
    slides.current.slidePrev();
  }

  return (
    <>
      <div className={s.detailsMapCt}>
        <MapComponent modite={modite}/>
        <IonIcon name="close-circle" class={s.closeIcon} onClick={closeDetails}></IonIcon>
      </div>

      <div className={s.detailsCt}>
        <div className={s.imageCt}>
          <div className={s.imageWrap}>
            <img src={modite.profile.image_192} />
            {modite.tacos !== undefined &&
              <IonBadge class={s.tacosBadge}>🌮 {modite.tacos}</IonBadge>
            }
          </div>
        </div>
        <div className={s.detailsWrap}>
          <div className={s.detailsTitle}>{modite.real_name}</div>
          <div>{modite.profile.fields && modite.profile.fields.locationData && modite.profile.fields.locationData.location}</div>
          <div>{modite.localDate} {modite.localTime}</div>
          <div>{modite.profile.fields && modite.profile.fields['Title']}</div>
          <div>{modite.profile.fields && modite.profile.fields['GitHub User']}</div>
          <hr />
          <div>{modite.profile.title}</div>
        </div>
      </div>
    </>
  );
}

export default ModiteDetails;
