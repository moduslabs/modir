import React, { FunctionComponent, lazy, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IonSearchbar, IonIcon, IonPage } from '@ionic/react'
import classNames from 'classnames/bind'
import s from './styles.module.css'
import SkeletonList from '../SkeletonList'
import DetailsView from '../../components/DetailsView'
import BackButton from '../BackButton'
import { VIEW_TYPES } from '../../constants/constants'
import ModiteListProps, { FilterEvent } from '../../types/components/ModiteList'
import NoRecordsFound from "../NoRecordsFound";

const VirtualizedList = lazy(() =>
  import('../VirtualizedList' /* webpackChunkName: "modite-virtualized-list", webpackPrefetch: true  */),
)

const moditeNotFound = {
  real_name: 'No modite found',
  tz: (Intl.DateTimeFormat().resolvedOptions().timeZone) // client timezone
}

let lastFilter = '' // used by onFilter
let lastScrollOffsetModites = 0 // used by onScroll
let lastScrollOffsetProjects = 0 // used by onScroll

const cx: (...args: any) => string = classNames.bind(s)

const ModiteList: FunctionComponent<ModiteListProps> = ({
  activeView,
  filter,
  listRecords,
  activeRecord,
  setFilter,
}) => {
  const isDetails: boolean = activeView === VIEW_TYPES.project || activeView === VIEW_TYPES.modite
  const isProjects = activeView === VIEW_TYPES.projects
  const isModites = activeView === VIEW_TYPES.modites
  const searchBarRef = useRef<HTMLLabelElement>(null)
  const lastScrollOffset = isProjects ? lastScrollOffsetProjects : lastScrollOffsetModites

  const onScroll = ({ scrollOffset }: { scrollOffset: number }): void => {
    const doCollapse = scrollOffset > 0

    requestAnimationFrame(() => {
      const el: HTMLLabelElement = searchBarRef.current as HTMLLabelElement

      if (doCollapse || filter) {
        el.classList.add(s.searchbarWrapCollapsed)
      } else {
        el.classList.remove(s.searchbarWrapCollapsed)
      }
    })

    if (isProjects) {
      lastScrollOffsetProjects = scrollOffset
    } else {
      lastScrollOffsetModites = scrollOffset
    }
  }

  const onFilter = (event: FilterEvent): void => {
    const query: string = event.detail.value || ''

    if (query === lastFilter) {
      return
    }

    lastFilter = query
    setFilter(query.trim())
  }

  const resetScroll = () => {
    setFilter('')
  }

  // adjusts the searchbar appropriately on route change
  useEffect(() => {
    onScroll({ scrollOffset: lastScrollOffset })
  }, [activeView])

  const moditeListCtCls: string = cx('moditeListCt', { detailsView: isDetails })
  const moditeListWrapCls: string = cx('moditeListWrap')
  const globalBarWrapCls: string = cx('globalBarWrap', { globalBarWrapHidden: !!isDetails })
  const searchbarWrapCls: string = cx('searchbarWrap', {
    searchbarWrapHidden: !!isDetails,
  })
  const moditesTabCls: string = cx('listTypeTab', { listTypeTabSelected: activeView === VIEW_TYPES.modites })
  const projectsTabCls: string = cx('listTypeTab', { listTypeTabSelected: activeView === VIEW_TYPES.projects })
  const activeModiteCls: string = cx({ activeModiteShown: !!isDetails })
  const tabCtCls: string = cx('tabCt', { tabCtHidden: !!isDetails })

  return (
    <>
      <IonPage className={moditeListCtCls}>
        {isDetails ? <BackButton className={s.backButton} /> : null}
        <div className={moditeListWrapCls}>
          {isProjects && listRecords.length && (
            <VirtualizedList
              addSpacerRow={true}
              records={listRecords}
              onScroll={onScroll}
              lastScrollOffset={lastScrollOffsetProjects}
            />
          )}
          {isModites && listRecords.length && (
            <VirtualizedList
              addSpacerRow={true}
              records={listRecords}
              onScroll={onScroll}
              lastScrollOffset={lastScrollOffsetModites}
            />
          )}
          {!isDetails && !listRecords.length && filter.length && <NoRecordsFound />}
          {!isDetails && !listRecords.length && !filter.length && <SkeletonList />}
          <DetailsView record={activeRecord} className={activeModiteCls} />
        </div>
        <div className={tabCtCls}>
          <Link to="/" className={moditesTabCls} onClick={resetScroll}>
            <IonIcon ios="ios-people" md="ios-people" />
            Team
          </Link>
          <Link to="/projects" className={projectsTabCls} onClick={resetScroll}>
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
        <label ref={searchBarRef} className={searchbarWrapCls}>
          <IonSearchbar
            mode="md"
            debounce={200}
            value={filter}
            placeholder="Filter Modites"
            onIonChange={onFilter}
            class={s.searchbar}
          />
          <div className={s.searchbarSpacer} />
        </label>
      </div>
    </>
  )
}

export default ModiteList
