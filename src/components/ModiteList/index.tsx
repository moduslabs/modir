import React, { useState, useEffect, useContext, FunctionComponent } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'
import { FixedSizeList as List, ListChildComponentProps } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { IonSearchbar, IonIcon, IonPage } from '@ionic/react'
import classNames from 'classnames/bind'
import IModite from '../../models/Modite'
import IFilterEvent from '../../models/FilterEvent'
import s from './styles.module.css'
import ModiteListProps from '../../models/ModiteListProps'
import SkeletonList from '../SkeletonList'
import ModiteListItem from '../ModiteListItem'
import ActiveModiteContext from '../../state/ActiveModite'
import ModitesContext, { IModitesProps, IModitesState } from '../../state/Modites'
import DetailsView from '../../components/DetailsView'
import ModiteProfileResp from '../../models/ModiteProfileResp'
import BackButton from '../BackButton'

let lastRoute: string

let lastFilter = '' // used by onFilter
let lastScrollOffset = 0 // used by onScroll

const ModiteList: FunctionComponent<ModiteListProps & RouteComponentProps> = ({ match }): JSX.Element => {
  const [activeModite, setActiveModite]: [IModite | null, React.Dispatch<any>] = useContext(ActiveModiteContext)
  const [{ modites }, { filter: filterModites }]: [IModitesState, IModitesProps] = useContext(ModitesContext)
  const [filter, setFilter]: [string, React.Dispatch<any>] = useState('')
  const [filtered, setFiltered]: [boolean, React.Dispatch<any>] = useState(false)
  const [collapsed, setCollapsed]: [boolean, React.Dispatch<any>] = useState(false)
  const [listType, setListType]: [string, React.Dispatch<any>] = useState('modites')

  const { url }: { url: string } = match
  const isDetails: boolean = url.indexOf('/details/') === 0
  const id: string | undefined = isDetails ? url.substring(url.lastIndexOf('/') + 1) : undefined

  const handleRouting = async () => {
    lastRoute = url

    // handle details type route
    if (id) {
      const record = modites.find((item: any) => item.id === id)

      if (record) {
        const { profile = {} }: any = record || {}
        let { fields } = profile

        const fetchProfile = async () => {
          const moditeProfile: ModiteProfileResp = await fetch(`https://modus.app/modite/${id}`).then(res => res.json())
          record.profile = moditeProfile.profile
          fields = moditeProfile.profile.fields
        }

        if (record.recordType === 'user' && !fields) {
          fetchProfile()
        }

        setActiveModite(record)
      }
    } else {
      const isProjects: boolean = url.indexOf('/projects') === 0
      const type = isProjects ? 'projects' : 'modites'

      // handle list type routes
      setListType(type)

      if (activeModite) {
        setActiveModite(null)
      }
    }
  }

  const onScroll = ({ scrollOffset }: { scrollOffset: number }) => {
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

    setFiltered(Boolean(query.length))

    if (query !== lastFilter) {
      lastFilter = query

      // save filter
      setFilter(query)

      filterModites(query)
    }
  }

  useEffect(() => {
    // if we already have something, we can safely abandon fetching
    if (modites.length && url !== lastRoute) {
      handleRouting()
    }
  })

  const Row = ({ index, style }: ListChildComponentProps) => (
    <Link to={`/details/${modites[index].id}`} className={s.moditeRow} style={style}>
      <ModiteListItem modite={modites[index]} key={modites[index].id} />
    </Link>
  )

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
          {!modites.length ? (
            <SkeletonList />
          ) : (
            <AutoSizer aria-label="The list of Modites">
              {({ height, width }: { height: number; width: number }) => (
                <>
                  <List
                    className="List"
                    itemSize={60}
                    itemCount={modites.length || 10}
                    height={height}
                    width={width}
                    initialScrollOffset={lastScrollOffset}
                    onScroll={onScroll}
                    itemKey={(index: number) => modites[index].id}
                    overscanCount={30}
                  >
                    {Row}
                  </List>
                </>
              )}
            </AutoSizer>
          )}
          <DetailsView className={activeModiteCls} />
        </div>
        <div className={tabCtCls}>
          <Link to="/" className={moditesTabCls}>
            <IonIcon ios="ios-people" md="ios-people" />
            Team
          </Link>
          <Link to="/projects" className={projectsTabCls}>
            <IonIcon ios="ios-book" md="ios-book" />
            Projects
          </Link>
        </div>
      </IonPage>

      <div className={s.searchbarCt}>
        <div className={globalBarWrapCls}>
          <div className={s.globalSpacer} />
          <div className={s.globeTitle}>MODITE LAND</div>
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
