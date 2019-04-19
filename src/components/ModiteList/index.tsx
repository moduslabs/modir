import React, { useState, FunctionComponent, lazy, useRef } from 'react'
import { Link } from 'react-router-dom'
import { IonSearchbar, IonIcon, IonPage } from '@ionic/react'
import classNames from 'classnames/bind'
import s from './styles.module.css'
import SkeletonList from '../SkeletonList'
import DetailsView from '../../components/DetailsView'
import BackButton from '../BackButton'
import { VIEW_TYPES } from '../../constants/constants'
import ModiteListProps, { FilterEvent } from '../../types/components/ModiteList'

const VirtualizedList = lazy(() =>
  import('../VirtualizedList' /* webpackChunkName: "modite-virtualized-list", webpackPrefetch: true  */),
)

let lastFilter = '' // used by onFilter
let lastScrollOffset = 0 // used by onScroll

const cx: (...args: any) => string = classNames.bind(s)

const ModiteList: FunctionComponent<ModiteListProps> = ({
  activeView,
  filter,
  listRecords,
  activeRecord,
  setFilter,
}) => {
  const [collapsed, setCollapsed]: [boolean, React.Dispatch<any>] = useState(false)
  const isDetails: boolean = activeView === VIEW_TYPES.project || activeView === VIEW_TYPES.modite
  const searchBarRef = useRef<HTMLLabelElement>(null)

  const onScroll = ({ scrollOffset }: { scrollOffset: number }): void => {
    const threshold = 1 // scroll threshold to hit before acting on the layout

    if (
      (lastScrollOffset <= threshold && scrollOffset > threshold) ||
      (lastScrollOffset >= threshold && scrollOffset < threshold)
    ) {
      requestAnimationFrame(() => {
        const el: HTMLLabelElement = searchBarRef.current as HTMLLabelElement

        if (scrollOffset > threshold) {
          el.classList.add(s.searchbarWrapCollapsed)
        } else {
          el.classList.remove(s.searchbarWrapCollapsed)
        }
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
    setFilter(query.trim())
    lastScrollOffset = 0
  }

  const resetScroll = () => {
    setFilter('')
    lastScrollOffset = 0
  }

  const moditeListCtCls: string = cx('moditeListCt', { detailsView: isDetails })
  const moditeListWrapCls: string = cx('moditeListWrap')
  // const moditeListSpacerCls: string = cx('moditeListSpacer', {
  //   moditeListSpacerExpanded: !collapsed || isDetails || !!filter,
  // })
  const globalBarWrapCls: string = cx('globalBarWrap', { globalBarWrapHidden: !!isDetails })
  const searchbarWrapCls: string = cx('searchbarWrap', {
    searchbarWrapCollapsed: collapsed || filter.length,
    searchbarWrapHidden: !!isDetails,
  })
  const searchbarSpacerCls: string = cx('searchbarSpacer', { searchbarSpacerCollapsed: collapsed || filter.length })
  const moditesTabCls: string = cx('listTypeTab', { listTypeTabSelected: activeView === VIEW_TYPES.modites })
  const projectsTabCls: string = cx('listTypeTab', { listTypeTabSelected: activeView === VIEW_TYPES.projects })
  const activeModiteCls: string = cx({ activeModiteShown: !!isDetails })
  const tabCtCls: string = cx('tabCt', { tabCtHidden: !!isDetails })

  return (
    <>
      <IonPage className={moditeListCtCls}>
        {isDetails ? <BackButton className={s.backButton} /> : null}
        {/* <div className={moditeListSpacerCls} /> */}
        <div className={moditeListWrapCls}>
          {isDetails ? null : listRecords.length ? (
            <VirtualizedList records={listRecords} onScroll={onScroll} lastScrollOffset={lastScrollOffset} />
          ) : (
            <SkeletonList />
          )}
          {isDetails ? <DetailsView record={activeRecord} className={activeModiteCls} /> : null}
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
          <div className={searchbarSpacerCls} />
        </label>
      </div>
    </>
  )
}

export default ModiteList
