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
import { ContextArray as GlobalContextArray, useGlobal } from '../../service/Global'
import { ContextArray as MapContextArray, defaultViewport, useMap } from '../../service/Map'
import Providers from '../../service/Providers'
import history from '../../utils/history'
import s from './styles.module.scss'
import './icons'
import './theme.css'

const ModiteDetailPage = React.lazy(() =>
  import('../../pages/ModiteDetail' /* webpackChunkName: "page-modite-detail", webpackPrefetch: true  */),
)
const ModitesPage = React.lazy(() =>
  import('../../pages/Modites' /* webpackChunkName: "page-modites", webpackPrefetch: true  */),
)
const ProjectDetailPage = React.lazy(() =>
  import('../../pages/ProjectDetail' /* webpackChunkName: "page-project-detail", webpackPrefetch: true  */),
)
const ProjectsPage = React.lazy(() =>
  import('../../pages/Projects' /* webpackChunkName: "page-projects", webpackPrefetch: true  */),
)

type ModiteListTypes = 'globe' | 'list'

const Inner = () => {
  const [state, dispatch]: DataContextArray = useData()
  const [globalState, setGlobalState]: GlobalContextArray = useGlobal()
  const lastLocation: LastLocationType = useLastLocation()
  const location = useLocation()
  const [viewport, setViewport]: MapContextArray = useMap()
  const go = useNavigate('/{tab}')
  const [isLoaded, setIsLoaded] = useState(false)
  const [moditeListType, setModiteListType] = useState<ModiteListTypes>('list')
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
      if ((isTeam || isProjects) && (lastActivePage !== VIEW_TYPES.projects && lastActivePage !== VIEW_TYPES.modites)) {
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

    if (!filter) {
      setGlobalState({
        ...globalState,
        searchBarCollapsed: false,
      })
    }

    dispatch({
      type: 'on-filter',
      filter,
    })
  }

  const onTabClick = (newTab: ViewTypes) =>
    go({
      tab: newTab === 'modites' ? '' : newTab,
    })

  const toggleListType = () => {
    setModiteListType(isGlobe ? 'list' : 'globe')
    setGlobalState({
      ...globalState,
      searchBarCollapsed: !isGlobe,
    })

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
              timeout={300}
            >
              <Suspense fallback={<div />}>
                <Switch location={location}>
                  <Route exact path="/modite/:id" component={ModiteDetailPage} />
                  <Route exact path="/" render={() => <ModitesPage listType={moditeListType} />} />
                  <Route exact path="/project/:id" component={ProjectDetailPage} />
                  <Route exact path="/projects" component={ProjectsPage} />
                  <Route path="*" render={() => <Redirect to="/" />} />
                </Switch>
              </Suspense>
            </CSSTransition>
          </TransitionGroup>
        ) : null}
      </IonPage>

      {globalState.headerHidden ? null : (
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

      {!isLoaded || globalState.searchBarHidden ? null : (
        <IonSearchbar
          mode="md"
          debounce={200}
          placeholder={isTeam || isModite ? 'Search Modites' : 'Search Projects'}
          value={state.filter}
          onIonChange={onFilter}
          className={classnames(
            s.searchbar,
            globalState.searchBarCollapsed ? s.searchbarCollapsed : null,
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
