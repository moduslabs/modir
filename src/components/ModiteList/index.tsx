import React, { useState, useEffect, useContext, FunctionComponent } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'
import { IonSearchbar, IonIcon, IonPage } from '@ionic/react'
import classNames from 'classnames/bind'
import IFilterEvent from '../../models/FilterEvent'
import s from './styles.module.css'
import ModiteListProps from '../../models/ModiteListProps'
import SkeletonList from '../SkeletonList'
import DataContext from '../../service/Data'
import { IDataProps, IDataState } from '../../types/service/Data'
import DetailsView from '../../components/DetailsView'
import ModiteProfileResp from '../../models/ModiteProfileResp'
import BackButton from '../BackButton'
import VirtualizedList from '../VirtualizedList'
import IProject from '../../models/Project'

let lastRoute: string

let lastFilter = '' // used by onFilter
let lastScrollOffset = 0 // used by onScroll

const ModiteList: FunctionComponent<ModiteListProps & RouteComponentProps> = ({ match }) => {
  const [
    { activeModite, activeProject, modites, projects },
    { filterModites, filterProjects, setActiveModite, setActiveProject },
  ]: [IDataState, IDataProps] = useContext(DataContext)
  const [filter, setFilter]: [string, React.Dispatch<any>] = useState('')
  const [filtered, setFiltered]: [boolean, React.Dispatch<any>] = useState(false)
  const [collapsed, setCollapsed]: [boolean, React.Dispatch<any>] = useState(false)
  const [listType, setListType]: [string, React.Dispatch<any>] = useState('modites')

  const { url }: { url: string } = match
  const isDetails: boolean = url.indexOf('/details/') === 0
  const id: string | undefined = isDetails ? url.substring(url.lastIndexOf('/') + 1) : undefined
  const isProjects: boolean = id ? id.indexOf('project-') === 0 : url.indexOf('/projects') === 0
  const data = isProjects ? projects : modites
  const filterer = isProjects ? filterProjects : filterModites
  const activeItem = isProjects ? activeProject : activeModite

  const handleRouting = async () => {
    if (url === lastRoute || !data.length) {
      return
    }

    lastRoute = url

    // handle details type route
    if (id) {
      if (isProjects) {
        const project = projects.find((project: IProject) => project.id === id)

        if (project) {
          setActiveProject(project)
        }
      } else {
        const record: any = modites.find((item: any) => item.id === id)

        if (record) {
          const { profile = {} }: any = record || {}
          let { fields } = profile

          const fetchProfile = async () => {
            const moditeProfile: ModiteProfileResp = await fetch(`https://modus.app/modite/${id}`).then(res =>
              res.json(),
            )
            record.profile = moditeProfile.profile
            fields = moditeProfile.profile.fields
          }

          if (record.recordType === 'user' && !fields) {
            fetchProfile()
          }

          setActiveModite(record)
        }
      }
    } else {
      const type = isProjects ? 'projects' : 'modites'

      setListType(type)

      setActiveModite(null)
      setActiveProject(null)
    }
  }

  const onScroll = ({ scrollOffset }: { scrollOffset: number }): void => {
    const threshold = 10 // scroll threshold to hit before acting on the layout

    if (
      (lastScrollOffset <= threshold && scrollOffset > threshold) ||
      (lastScrollOffset >= threshold && scrollOffset < threshold)
    ) {
      requestAnimationFrame(() => {
        setCollapsed(scrollOffset > threshold)
      })
    }

    lastScrollOffset = scrollOffset
  }

  const onFilter = (event: IFilterEvent): void => {
    const query: string = event.detail.value || ''

    setFiltered(query.length)

    if (query === lastFilter) return
    lastFilter = query

    // save filter
    setFilter(query)

    filterer(query)
  }

  useEffect(() => {
    // if we already have something, we can safely abandon fetching
    if (modites.length) {
      handleRouting()
    }
  })

  const cx = classNames.bind(s)
  const mapWindowCls = cx('mapWindow', { mapWindowCollapsed: collapsed })
  const globalBarWrapCls = cx('globalBarWrap', { globalBarWrapHidden: !!id })
  const searchbarWrapCls = cx('searchbarWrap', {
    searchbarWrapCollapsed: collapsed || filtered,
    searchbarWrapHidden: !!id,
  })
  const searchbarSpacerCls = cx('searchbarSpacer', { searchbarSpacerCollapsed: collapsed || filtered })
  const moditesTabCls = cx('listTypeTab', { listTypeTabSelected: listType === 'modites' })
  const projectsTabCls = cx('listTypeTab', { listTypeTabSelected: listType === 'projects' })
  const activeModiteCls = cx({ activeModiteShown: !!id })
  const tabCtCls = cx('tabCt', { tabCtHidden: !!id })
  const backButtonCls = cx('backButton')

  return (
    <>
      <IonPage className={s.moditeListCt}>
        <BackButton className={backButtonCls} />
        <div className={mapWindowCls} />
        <div className={s.moditeListWrap}>
          {data.length ? (
            <VirtualizedList records={data} onScroll={onScroll} initialScrollOffset={lastScrollOffset} />
          ) : (
            <SkeletonList />
          )}
          <DetailsView className={activeModiteCls} />
        </div>
        <div className={tabCtCls}>
          <Link to="/" className={moditesTabCls}>
            <IonIcon ios="ios-people" md="ios-people" />
            Team
          </Link>
          <Link to="/projects" className={projectsTabCls}>
            <IonIcon ios="md-clipboard" md="md-clipboard" />
            Projects
          </Link>
        </div>
      </IonPage>

      <div className={s.searchbarCt}>
        <div className={globalBarWrapCls}>
          <div className={s.globalSpacer} />
          <div className={s.globeTitle}>MODUS LAND</div>
          <IonIcon
            class={`${s.globeButton}`}
            slot="icon-only"
            ios="ios-globe"
            md="ios-globe"
            // TODO: wire up the handling of the globe click for really realz
            // onClick={() => console.log('clicked')}
          />
        </div>
        <label className={searchbarWrapCls}>
          <IonSearchbar
            mode="md"
            debounce={200}
            value={filter}
            placeholder="Filter Modites"
            onIonChange={onFilter}
            class={s.searchbar}
          />
          <div className={searchbarSpacerCls} />
        </label>
      </div>
    </>
  )
}

export default withRouter(ModiteList)
