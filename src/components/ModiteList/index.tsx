import React, { useState, FunctionComponent, lazy } from 'react'
import { Link } from 'react-router-dom'
import { IonSearchbar, IonIcon, IonPage } from '@ionic/react'
import classNames from 'classnames/bind'
import FilterEvent from '../../models/FilterEvent'
import s from './styles.module.css'
import ModiteListProps from '../../models/ModiteListProps'
import SkeletonList from '../SkeletonList'
import DetailsView from '../../components/DetailsView'
import BackButton from '../BackButton'
import { VIEW_TYPES } from '../../constants/constants'

const VirtualizedList = lazy(() =>
  import('../VirtualizedList' /* webpackChunkName: "modite-virtualized-list", webpackPrefetch: true  */),
)

let lastFilter = '' // used by onFilter
let lastScrollOffset = 0 // used by onScroll

const ModiteList: FunctionComponent<ModiteListProps> = ({
  activeView,
  filter,
  listRecords,
  activeRecord,
  setFilter,
}) => {
  const [collapsed, setCollapsed]: [boolean, React.Dispatch<any>] = useState(false)
  const isDetails: boolean = activeView === VIEW_TYPES.project || activeView === VIEW_TYPES.modite

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

  const onFilter = (event: FilterEvent): void => {
    const query: string = event.detail.value || ''

    if (query === lastFilter) {
      return
    }

    lastFilter = query
    setFilter(query)
  }

  const cx = classNames.bind(s)
  const moditeListCtCls = cx('moditeListCt', { detailsView: isDetails })
  const mapWindowCls = cx('mapWindow', { mapWindowCollapsed: collapsed && !isDetails })
  const globalBarWrapCls = cx('globalBarWrap', { globalBarWrapHidden: !!isDetails })
  const searchbarWrapCls = cx('searchbarWrap', {
    searchbarWrapCollapsed: collapsed || filter.length,
    searchbarWrapHidden: !!isDetails,
  })
  const searchbarSpacerCls = cx('searchbarSpacer', { searchbarSpacerCollapsed: collapsed || filter.length })
  const moditesTabCls = cx('listTypeTab', { listTypeTabSelected: activeView === VIEW_TYPES.modites })
  const projectsTabCls = cx('listTypeTab', { listTypeTabSelected: activeView === VIEW_TYPES.projects })
  const activeModiteCls = cx({ activeModiteShown: !!isDetails })
  const tabCtCls = cx('tabCt', { tabCtHidden: !!isDetails })
  const backButtonCls = cx('backButton')

  return (
    <>
      <IonPage className={moditeListCtCls}>
        <BackButton className={backButtonCls} />
        <div className={mapWindowCls} />
        <div className={s.moditeListWrap}>
          {listRecords.length ? (
            <VirtualizedList records={listRecords} onScroll={onScroll} initialScrollOffset={lastScrollOffset} />
          ) : (
            <SkeletonList />
          )}
          <DetailsView record={activeRecord} className={activeModiteCls} />
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

export default ModiteList
