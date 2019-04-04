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

  const onModiteClick = (modite: Modite) => {
    setActiveModite(modite)
  }

  return (
    <IonPage>
      <ModiteList onModiteItemClick={onModiteClick} view={view} />
      <div className={`MapCt ${s.mapCt}`}>
        <div className={s.mapWrap}>
          <MapComponent modites={modites} />
          <div className={s.mapOverlay} />
        </div>
      </div>
    </IonPage>
  )
}

export default Modites
