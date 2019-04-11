import React, { lazy, useContext, FunctionComponent } from 'react'
import { IonPage } from '@ionic/react'
import s from './styles.module.css'
import DataContext from '../../service/Data'
import { RouteComponentProps, withRouter } from 'react-router'
import { getActiveView, getUrlInfo } from '../../utils/util'
import { VIEW_TYPES } from '../../constants/constants'
import Modite from '../../models/Modite'
import Project from '../../models/Project'

const ModiteList = lazy(() =>
  import('../../components/ModiteList' /* webpackChunkName: "modite-list", webpackPrefetch: true  */),
)

const MapComponent = lazy(() =>
  import('../../components/MapComponent' /* webpackChunkName: "maps", webpackPrefetch: true  */),
)

// TODO: type correctly
const Modites: FunctionComponent<RouteComponentProps> = () => {
  // TODO: type correctly
  const [{ filter, modites, projects, rawModites, rawProjects }, { setFilter, processTimestamps }]: any = useContext(
    DataContext,
  )

  const { id } = getUrlInfo()
  const activeView: 'project' | 'projects' | 'modite' | 'modites' = getActiveView()
  const isProjects: boolean = activeView === VIEW_TYPES.projects
  const isModites: boolean = activeView === VIEW_TYPES.modites

  let listRecords: (Modite | Project)[] = isProjects ? projects : modites
  let mapRecords: Modite[] = isProjects ? rawModites : modites
  let activeRecord: Modite | Project | null = null

  if (!isProjects && !isModites) {
    const date = new Date()
    if (activeView === VIEW_TYPES.project) {
      activeRecord = rawProjects.find((project: Project) => project.id === id)
      processTimestamps((activeRecord as Project).users, date)
      mapRecords = (activeRecord as Project).users
    } else {
      activeRecord = rawModites.find((modite: Modite) => modite.id === id)
      // TODO: fetch modite profile details if a record is found and the profile details are not
      processTimestamps([activeRecord as Modite], date)
      mapRecords = [activeRecord as Modite]
    }
  }

  return (
    <IonPage>
      <ModiteList
        activeView={activeView}
        filter={filter}
        listRecords={listRecords}
        activeRecord={activeRecord}
        setFilter={setFilter}
      />
      <div className={`MapCt ${s.mapCt}`}>
        <div className={s.mapWrap}>
          <MapComponent mapRecords={mapRecords} />
          <div className={s.mapOverlay} />
        </div>
      </div>
    </IonPage>
  )
}

export default withRouter(Modites)
