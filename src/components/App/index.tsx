import '@ionic/core/css/core.css'
import '@ionic/core/css/ionic.bundle.css'
import { SearchbarChangeEventDetail } from '@ionic/core'
import { IonApp, IonIcon, IonPage, IonSearchbar } from '@ionic/react'
import classnames from 'classnames'
import React, { Suspense, useEffect, useState } from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import { LastLocationProvider, LastLocationType, useLastLocation } from 'react-router-last-location'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import Back from '../Back'
import Footer from '../Footer'
import Map from '../Map'
import { locationToViewType, VIEW_TYPES, ViewTypes } from '../../constants/constants'
import { useNavigate, useLocation } from '../../hook/useRouter'
import { ContextArray as DataContextArray, useData } from '../../service/Data'
import { ContextArray as MapContextArray, defaultViewport, useMap } from '../../service/Map'
import Providers from '../../service/Providers'
import history from '../../utils/history'
import s from './styles.module.scss'
import './icons'
import './theme.css'

const ModiteDetailPage = React.lazy(
  () => import('../../pages/ModiteDetail' /* webpackChunkName: "page-modite-detail", webpackPrefetch: true  */),
)
const ModitesPage = React.lazy(
  () => import('../../pages/Modites' /* webpackChunkName: "page-modites", webpackPrefetch: true  */),
)
const ProjectDetailPage = React.lazy(
  () => import('../../pages/ProjectDetail' /* webpackChunkName: "page-project-detail", webpackPrefetch: true  */),
)
const ProjectsPage = React.lazy(
  () => import('../../pages/Projects' /* webpackChunkName: "page-projects", webpackPrefetch: true  */),
)

type ModiteListTypes = 'globe' | 'list'

const Inner = () => {
  const [state, dispatch]: DataContextArray = useData()
  const lastLocation: LastLocationType = useLastLocation()
  const location = useLocation()
  const [viewport, setViewport]: MapContextArray = useMap()
  const go = useNavigate('/{tab}')
  const [isLoaded, setIsLoaded] = useState(false)
  const [moditeListType, setModiteListType] = useState<ModiteListTypes>('list')
  const [searchBarCollapsed, setSearchBarCollapsed] = useState(false)
  const activePage = locationToViewType(location.pathname)
  const isModite = activePage === VIEW_TYPES.modite
  const isProject = activePage === VIEW_TYPES.project
  const isProjects = activePage === VIEW_TYPES.projects
  const isTeam = activePage === VIEW_TYPES.modites
  const isGlobe = moditeListType === 'globe'
  const showTabBar = isLoaded && (isProjects || (isTeam && !isGlobe)) && !isProject

  useEffect(() => {
    if (lastLocation) {
      const lastActivePage = locationToViewType(lastLocation.pathname)

      if (lastActivePage === VIEW_TYPES.project) {
        dispatch({ type: 'clear-filter' })
      }

      // if current is modites list or projects list but did not come from one of them lists
      if ((isTeam || isProjects) && lastActivePage !== VIEW_TYPES.projects && lastActivePage !== VIEW_TYPES.modites) {
        setViewport({
          ...viewport,
          ...defaultViewport,
        })
      }
    }
  }, [lastLocation])

  if (!isLoaded && state.isLoaded) {
    setIsLoaded(true)
  }

  const onFilter = (event: CustomEvent<SearchbarChangeEventDetail>): void => {
    const filter = event.detail.value
    const currentFilter = isTeam ? state.moditesFilter : state.projectsFilter

    if (isGlobe) {
      const modite = state.modites[0]
      const locationData = modite.profile && modite.profile.fields && modite.profile.fields.locationData

      const newViewport = locationData
        ? {
            ...viewport,
            latitude: locationData.lat,
            longitude: locationData.lon,
            modite,
            zoom: 5,
          }
        : {
            ...viewport,
            ...defaultViewport,
          }

      setViewport(newViewport)
    }

    if (!filter && !isGlobe) {
      setSearchBarCollapsed(false)
    }

    if (filter !== (currentFilter || '')) {
      dispatch({
        type: isTeam ? 'filter-modites' : 'filter-projects',
        filter,
      })
    }
  }

  const onScroll = (offset: number) => setSearchBarCollapsed(offset >= 50)

  const onTabClick = (newTab: ViewTypes) =>
    go({
      tab: newTab === 'modites' ? '' : newTab,
    })

  const toggleListType = () => {
    setModiteListType(isGlobe ? 'list' : 'globe')

    setSearchBarCollapsed(!isGlobe)

    if (isGlobe) {
      setViewport({
        ...viewport,
        ...defaultViewport,
      })
    }
  }

  return (
    <>
      <Map />

      <div className={classnames(s.topFader, isLoaded ? s.loaded : null)} />
      {isLoaded ? null : <div className={s.bottomFader} />}

      <IonPage className={classnames(s.bodyWrapper, showTabBar ? null : s.isFullscreen)}>
        {isLoaded ? (
          <TransitionGroup>
            <CSSTransition
              key={location.key}
              unmountOnExit
              mountOnEnter
              appear
              in={true}
              classNames="slide-down"
              timeout={1000}
            >
              <Suspense fallback={<div />}>
                <Switch location={location}>
                  {/* use /details instead of /modite as there is an API route that conflicts */}
                  <Route exact path="/details/:id" component={ModiteDetailPage} />
                  <Route exact path="/" render={() => <ModitesPage listType={moditeListType} onScroll={onScroll} />} />
                  <Route exact path="/project/:id" component={ProjectDetailPage} />
                  <Route exact path="/projects" render={() => <ProjectsPage onScroll={onScroll} />} />
                  <Route path="*" render={() => <Redirect to="/" />} />
                </Switch>
              </Suspense>
            </CSSTransition>
          </TransitionGroup>
        ) : null}
      </IonPage>

      {isLoaded && (isModite || isProject) ? null : (
        <div className={s.headerCt}>
          <div className={classnames(s.header, isLoaded ? s.loaded : null)}>
            <div className={s.title}>Modus Land</div>
            {isLoaded && isTeam ? (
              <IonIcon
                className={s.globeButton}
                mode="ios"
                name={moditeListType === 'globe' ? 'list' : 'globe'}
                onClick={toggleListType}
              />
            ) : null}
          </div>
        </div>
      )}

      {!isLoaded || isModite || isProject ? null : (
        <IonSearchbar
          mode="md"
          debounce={300}
          placeholder={isTeam || isModite ? 'Search Modites' : 'Search Projects'}
          value={isTeam ? state.moditesFilter : state.projectsFilter}
          onIonChange={onFilter}
          className={classnames(
            s.searchbar,
            searchBarCollapsed ? s.searchbarCollapsed : null,
            isTeam ? s.searchbarSpaced : null,
          )}
        />
      )}

      {isLoaded ? null : <Footer />}

      {isLoaded && (isModite || isProject) ? <Back backTo={isProject ? '/projects' : '/'} /> : null}

      {showTabBar ? (
        <div className={s.tabBar}>
          <div className={isTeam ? s.activeTab : undefined} onClick={() => onTabClick('modites')}>
            <IonIcon mode="ios" name="people" />
            Team
          </div>
          <div className={isProjects ? s.activeTab : undefined} onClick={() => onTabClick('projects')}>
            <IonIcon mode="md" name="clipboard" />
            Projects
          </div>
        </div>
      ) : null}
    </>
  )
}

const App = () => (
  <IonApp>
    <Providers>
      <main className={s.main} role="main">
        <Router history={history}>
          <LastLocationProvider>
            <Inner />
          </LastLocationProvider>
        </Router>
      </main>
    </Providers>
  </IonApp>
)

export default App
