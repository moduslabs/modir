import React, { lazy, useRef, useContext } from 'react'
import { IonPage } from '@ionic/react'
import Modite from '../../models/Modite'
import s from './styles.module.css'
import DataContext from '../../service/Data'
import { DataProps, DataState } from '../../types/service/Data'

const ModiteList = lazy(() =>
  import('../../components/ModiteList' /* webpackChunkName: "modite-list", webpackPrefetch: true  */),
)

const MapComponent = lazy(() =>
  import('../../components/MapComponent' /* webpackChunkName: "maps", webpackPrefetch: true  */),
)

function Modites({ view }: { view?: string }) {
  const [{ modites }, { setActiveModite }]: [DataState, DataProps] = useContext(DataContext)
  const slidesRef: React.MutableRefObject<null> = useRef(null)

  const onModiteClick = (modite: Modite) => {
    setActiveModite(modite)
  }

  return (
    <IonPage>
      <div className={s.mapCt}>
        <div className={s.mapWrap}>
          <MapComponent modites={modites} />
          <div className={s.mapOverlay} />
        </div>
      </div>
      <ModiteList onModiteItemClick={onModiteClick} slides={slidesRef} view={view} />
    </IonPage>
  )
}

export default Modites
