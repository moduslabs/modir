import React, { lazy, useContext, FunctionComponent, LazyExoticComponent } from 'react'
import cx from 'classnames'
import { IonPage } from '@ionic/react'
import s from './styles.module.css'
import DataContext from '../../service/Data'
import { RouteComponentProps, withRouter } from 'react-router'
import { getActiveView, getUrlInfo } from '../../utils/util'
import { VIEW_TYPES, ViewTypes } from '../../constants/constants'
import Modite, { ModiteProfile } from '../../models/Modite'
import Project from '../../models/Project'
import { DataState, DataProps } from '../../types/service/Data'

const ModiteList: LazyExoticComponent<any> = lazy(() =>
  import('../../components/ModiteList' /* webpackChunkName: "modite-list", webpackPrefetch: true  */),
)

const MapComponent: LazyExoticComponent<any> = lazy(() =>
  import('../../components/MapComponent' /* webpackChunkName: "maps", webpackPrefetch: true  */),
)

const Modites: FunctionComponent<RouteComponentProps> = () => {
  const [
    { filter, modites, projects, rawModites, rawProjects },
    { setFilter, processTimestamps, fetchModiteProfile },
  ]: [DataState, DataProps] = useContext(DataContext)

  const { id }: { id: string | undefined } = getUrlInfo()
  const activeView: ViewTypes = getActiveView()
  const isProjects: boolean = activeView === VIEW_TYPES.projects
  const isModites: boolean = activeView === VIEW_TYPES.modites

  let listRecords: (Modite | Project)[] = isProjects ? projects : modites
  let mapRecords: Modite[] = isProjects ? rawModites : modites
  let activeRecord: Modite | Project | undefined = undefined

  if (!isProjects && !isModites) {
    if (activeView === VIEW_TYPES.project) {
      activeRecord = rawProjects.find((project: Project) => project.id === id)
      if (activeRecord) {
        processTimestamps((activeRecord as Project).users)
        mapRecords = (activeRecord as Project).users
      }
    } else {
      activeRecord = rawModites.find((modite: Modite) => modite.id === id)
      if (activeRecord) {
        // fetch Modite profile details if they're not cached in the all-modites response
        if (!(activeRecord.profile as ModiteProfile).fields) {
          fetchModiteProfile(id as string)
        }
        processTimestamps([activeRecord as Modite])
        mapRecords = [activeRecord as Modite]
      }
    }
  }

  const mapWrapCls = cx(s.mapWrap, {
    [s.mapWrapWide]: mapRecords.length !== 1,
  })

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
        <div className={mapWrapCls}>
          <MapComponent mapRecords={mapRecords} />
          <div className={s.mapOverlay} />
        </div>
      </div>
    </IonPage>
  )
}

export default withRouter(Modites)
