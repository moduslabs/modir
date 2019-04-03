import React, { useState, useEffect, useContext, FunctionComponent } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'
import { IonSearchbar, IonIcon, IonPage } from '@ionic/react'
import classNames from 'classnames/bind'
import IModite from '../../models/Modite'
import IWorkerEvent from '../../models/WorkerEvent'
import IFilterEvent from '../../models/FilterEvent'
// @ts-ignore
import Worker from 'worker-loader!./formatModites.js' // eslint-disable-line import/no-webpack-loader-syntax
import s from './styles.module.css'
import ModiteListProps from '../../models/ModiteListProps'
import SkeletonList from '../SkeletonList'
import ModitesContext from '../../state/modites'
import IProject from '../../models/Project'
import ModiteContext from '../../state/modite'
import DetailsView from '../../components/DetailsView'
import ModiteProfileResp from '../../models/ModiteProfileResp'
import BackButton from '../BackButton'
import VirtualizedList from '../VirtualizedList'

// get locale once
const locale: string = navigator.language

// reference to the worker that formats and filters modite data
const worker: Worker = new Worker()

// keep server response for Modites here for future reference
let rawModites: IModite[]
// keep server response for Projects here for future reference
let projects: IProject[]
// points the the active raw list data: rawModites or projects
let rawListSource: IModite[] | IProject[]
// map of modite records by ID
const moditeMap: { [id: string]: IModite } = {}

let lastRoute: string

let minutes: number // used by tick
let lastFilter = '' // used by onFilter
let lastScrollOffset = 0 // used by onScroll

const createModiteMap = () => {
  rawModites.forEach((modite: IModite) => {
    moditeMap[modite.id as string] = modite
  })
}

const populateProjects = () => {
  projects.forEach((project: IProject) => {
    project.users = !project.users.length ? [] : project.users.map((user: IModite) => moditeMap[user.id as string])
    project.users = project.users.filter((project: IModite) => project) // remove any non-matched users (user could exist in Harvest and not in Slack)
  })
}

const ModiteList: FunctionComponent<ModiteListProps & RouteComponentProps> = ({ match }) => {
  const [, setActiveModite]: [IModite, React.Dispatch<any>] = useContext(ModiteContext)
  const [modites, setModites]: [IModite[], React.Dispatch<any>] = useContext(ModitesContext)
  const [filter, setFilter]: [string, React.Dispatch<any>] = useState('')
  const [filtered, setFiltered]: [boolean, React.Dispatch<any>] = useState(false)
  const [collapsed, setCollapsed]: [boolean, React.Dispatch<any>] = useState(false)
  const [listType, setListType]: [string, React.Dispatch<any>] = useState('modites')
  const [listData, setListData]: [any, React.Dispatch<any>] = useState()

  const { url }: { url: string } = match
  const isDetails: boolean = url.indexOf('/details/') === 0
  const id: string | undefined = isDetails ? url.substring(url.lastIndexOf('/') + 1) : undefined
  const isProjects: boolean = url.indexOf('/projects') === 0
  const useProjects = isProjects || url.indexOf('/project-') >= 0

  // get data from server
  async function getModiteData(filter: string, date: Date): Promise<void> {
    if (!rawModites || !rawModites.length) {
      const [moditesResp, projectsResp]: [IModite[], IProject[]] = await Promise.all([
        fetch('https://modus.app/modites/all').then(res => res.json()),
        fetch('https://modus.app/projects/all').then(res => res.json()),
      ])

      rawModites = moditesResp
      projects = projectsResp
      createModiteMap()
      populateProjects()
    }

    rawListSource = useProjects ? projects : rawModites
    worker.postMessage({ modites: rawListSource, filter, date, locale })
  }

  const handleRouting = async () => {
    if (url === lastRoute || !modites) return

    lastRoute = url
    const date = new Date()
    const type = isProjects ? 'projects' : 'modites'

    // handle details type route
    if (id) {
      const record: any = modites.find((item: any) => item.id === id)

      if (record) {
        const { profile = {} }: any = record || {}
        let { fields } = profile

        const fetchProfile = async () => {
          const moditeProfile: ModiteProfileResp = await fetch(`https://modus.app/modite/${id}`).then(res => res.json())
          record.profile = moditeProfile.profile
          fields = moditeProfile.profile.fields
        }

        if (record.recordType === 'user' && !fields) fetchProfile()

        setActiveModite(record)
        worker.postMessage({ modites: [record], filter, date, locale })
      }
    } else {
      // handle list type routes
      const rawSource = isProjects ? projects : rawModites
      setListType(type)
      rawListSource = rawSource
      worker.postMessage({ modites: rawSource, filter, date, locale })
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

  // get fresh time
  const tick: Function = (): void => {
    const date: Date = new Date()
    const currentMinutes: number = date.getMinutes()
    if (minutes && currentMinutes !== minutes) {
      worker.postMessage({ modites: rawListSource, filter: lastFilter, date, locale })
    }
    minutes = currentMinutes
  }

  const onFilter = (event: IFilterEvent): void => {
    const query: string = event.detail.value || ''

    setFiltered(query.length)

    if (query === lastFilter) return
    lastFilter = query

    // save filter
    setFilter(query)

    //tell worker to parse and filter
    worker.postMessage({
      modites: rawListSource,
      filter: query,
      date: new Date(),
      locale,
    })
  }

  useEffect(() => {
    // start the clock
    const intervalID: number = window.setInterval(tick, 1000)
    const clearTimeInterval = (): void => clearInterval(intervalID)

    // if we already have something, we can safely abandon fetching
    if (listData) {
      handleRouting()
      if (listData.length) return clearTimeInterval
    } else {
      // initial data parsing
      worker.onmessage = (event: IWorkerEvent) => {
        requestAnimationFrame(() => {
          setModites(event.data)
          setListData(event.data)
        })
      }
      // get data from the api
      getModiteData(filter, new Date())
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
          {!listData || !listData.length ? (
            <SkeletonList />
          ) : (
            <VirtualizedList records={listData} onScroll={onScroll} initialScrollOffset={lastScrollOffset} />
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
