import '@ionic/core/css/core.css'
import '@ionic/core/css/ionic.bundle.css'
import { IonApp, IonIcon, IonPage, IonSearchbar } from '@ionic/react'
import classnames from 'classnames'
import React, { Suspense, useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { LastLocationProvider } from 'react-router-last-location'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import Footer from '../Footer'
import Map from '../Map'
import { locationToViewType, VIEW_TYPES, ViewTypes } from '../../constants/constants'
import { useNavigate, useLocation } from '../../hook/useRouter'
import { useData } from '../../service/Data'
import { ContextArray as MapContextArray, defaultViewport, useMap } from '../../service/Map'
import Providers from '../../service/Providers'
import s from './styles.module.scss'
import './icons'
import './theme.css'

const ModitesPage = React.lazy(() =>
  import('../../pages/Modites' /* webpackChunkName: "page-modites", webpackPrefetch: true  */),
)
const ProjectsPage = React.lazy(() =>
  import('../../pages/Projects' /* webpackChunkName: "page-pages", webpackPrefetch: true  */),
)

type ModiteListTypes = 'globe' | 'list'

const Inner = () => {
  const [state] = useData()
  const location = useLocation()
  const [, setViewport]: MapContextArray = useMap()
  const go = useNavigate('/{tab}')
  const [isLoaded, setIsLoaded] = useState(false)
  const [moditeListType, setModiteListType] = useState<ModiteListTypes>('list')
  const [searchBarCollapsed, setSearchBarCollapsed] = useState(false)
  const activePage = locationToViewType(location.pathname)
  const isProjects = activePage === VIEW_TYPES.projects
  const isTeam = activePage === VIEW_TYPES.modites
  const isGlobe = moditeListType === 'globe'
  const showTabBar = isLoaded && (isProjects || (isTeam && !isGlobe))

  if (!isLoaded && state.modites.length === 0 && !state.filter) {
    setTimeout(() => setIsLoaded(true), 1500)
  }

  const onListScroll = (scrollOffset: number): void =>
    setSearchBarCollapsed(isGlobe || scrollOffset >= document.body.clientHeight / 5)

  const onTabClick = (newTab: ViewTypes) =>
    go({
      tab: newTab === 'modites' ? '' : newTab,
    })

  const toggleListType = () => {
    setModiteListType(isGlobe ? 'list' : 'globe')
    setSearchBarCollapsed(!isGlobe)

    if (isGlobe) {
      setViewport({
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
            <CSSTransition key={location.key} classNames="fade" timeout={300}>
              <Suspense fallback={<div className="loader" />}>
                <Switch location={location}>
                  <Route
                    exact
                    path="/"
                    render={() => <ModitesPage listType={moditeListType} onScroll={onListScroll} />}
                  />
                  <Route exact path="/projects" render={() => <ProjectsPage onScroll={onListScroll} />} />
                </Switch>
              </Suspense>
            </CSSTransition>
          </TransitionGroup>
        ) : null}
      </IonPage>

      <div className={s.headerCt}>
        <div className={classnames(s.header, isLoaded ? s.loaded : null)}>
          <div className={s.title}>Modus Land</div>
          {isLoaded && isTeam ? (
            /* eslint-disable-next-line no-console */
            <IonIcon
              className={s.globeButton}
              mode="ios"
              name={moditeListType === 'globe' ? 'list' : 'globe'}
              onClick={toggleListType}
            />
          ) : null}
        </div>
      </div>

      <IonSearchbar
        mode="md"
        debounce={200}
        // value={filter}
        placeholder={isTeam ? 'Search Modites' : 'Search Projects'}
        // onIonChange={onFilter}
        className={classnames(
          s.searchbar,
          searchBarCollapsed ? s.searchbarCollapsed : null,
          isTeam ? s.searchbarSpaced : null,
        )}
      />

      {isLoaded ? null : <Footer />}

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
        <Router>
          <LastLocationProvider>
            <Inner />
          </LastLocationProvider>
        </Router>
      </main>
    </Providers>
  </IonApp>
)

export default App
