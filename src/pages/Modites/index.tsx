import React, { lazy, useContext } from 'react'
import { IonPage } from '@ionic/react'
import s from './styles.module.css'
import DataContext from '../../service/Data'

const ModiteList = lazy(() =>
  import('../../components/ModiteList' /* webpackChunkName: "modite-list", webpackPrefetch: true  */),
)

const MapComponent = lazy(() =>
  import('../../components/MapComponent' /* webpackChunkName: "maps", webpackPrefetch: true  */),
)

function Modites({ view }: { view?: string }) {
  const [{ mapRecords }]: any = useContext(DataContext)

  return (
    <IonPage>
      <ModiteList view={view} />
      <div className={`MapCt ${s.mapCt}`}>
        <div className={s.mapWrap}>
          <MapComponent mapRecords={mapRecords} />
          <div className={s.mapOverlay} />
        </div>
      </div>
    </IonPage>
  )
}

export default Modites
