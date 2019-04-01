import React, { useState, useEffect, useContext, FunctionComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
// @ts-ignore
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
// @ts-ignore
import AutoSizer from 'react-virtualized-auto-sizer';
import { IonSearchbar, IonIcon, IonPage, IonButton } from '@ionic/react';
import classNames from 'classnames/bind';
import Modite from '../../models/Modite';
import WorkerEvent from '../../models/WorkerEvent';
import FilterEvent from '../../models/FilterEvent';
// @ts-ignore
import Worker from 'worker-loader!./formatModites.js'; // eslint-disable-line import/no-webpack-loader-syntax
import s from './styles.module.css';
import ModiteListProps from '../../models/ModiteListProps';
import SkeletonList from '../SkeletonList';
import ModiteListItem from '../ModiteListItem';
import ModitesContext from '../../state/modites';
import Project from '../../models/Project';
import ModiteContext from '../../state/modite';
import DetailsView from '../../components/DetailsView';

// get locale once
const locale: string = navigator.language;

// reference to the worker that formats and filters modite data
const worker: Worker = new Worker();

// keep server response for Modites here for future reference
let rawModites: Modite[];
// keep server response for Projects here for future reference
let rawProjects: Project[];
// points the the active raw list data: rawModites or rawProjects
let rawListSource: Modite[] | Project[];

// get data from server
async function getModiteData(filter: string, date: Date): Promise<void> {
  if (!rawModites || !rawModites.length) {
    const fetches = [
      new Promise(async resolve => {
        const moditesResp: Modite[] = await fetch('https://modus.app/modites/all').then(res => res.json());
        rawModites = moditesResp;
        resolve();
      }),
      new Promise(async resolve => {
        const projectsResp: Project[] = await fetch('https://modus.app/projects/all').then(res => res.json());
        rawProjects = projectsResp;
        resolve();
      })
    ];

    await Promise.all(fetches);
  }
  rawListSource = rawModites;
  worker.postMessage({ modites: rawListSource, filter, date, locale });
}

let minutes: number; // used by tick
let lastFilter: string = ''; // used by onFilter
let lastScrollOffset: number = 0; // used by onScroll

const ModiteList: FunctionComponent<ModiteListProps & RouteComponentProps> = () => {
  const [activeModite, setActiveModite]: [Modite, React.Dispatch<any>] = useContext(ModiteContext);
  const [modites, setModites]: [Modite[], React.Dispatch<any>] = useContext(ModitesContext);
  const [filter, setFilter]: [string, React.Dispatch<any>] = useState('');
  const [filtered, setFiltered]: [boolean, React.Dispatch<any>] = useState(false);
  const [collapsed, setCollapsed]: [boolean, React.Dispatch<any>] = useState(false);
  const [listType, setListType]: [string, React.Dispatch<any>] = useState('modites');
  const [listData, setListData]: [any, React.Dispatch<any>] = useState();

  const onScroll = ({ scrollOffset }: { scrollOffset: number }) => {
    const threshold: number = 10; // scroll threshold to hit before acting on the layout

    if ((lastScrollOffset <= threshold && scrollOffset > threshold) || (lastScrollOffset >= threshold && scrollOffset < threshold)) {
      requestAnimationFrame(() => {
        setCollapsed(scrollOffset > threshold);
      });
    }

    lastScrollOffset = scrollOffset;
  };

  // get fresh time
  const tick: Function = (): void => {
    const date: Date = new Date();
    const currentMinutes: number = date.getMinutes();
    if (minutes && currentMinutes !== minutes) {
      worker.postMessage({ modites: rawListSource, filter: lastFilter, date, locale });
    }
    minutes = currentMinutes;
  };

  const onFilter = (event: FilterEvent): void => {
    const query: string = event.detail.value || '';

    setFiltered(query.length);

    if (query === lastFilter) return;
    lastFilter = query;

    // save filter
    setFilter(query);

    //tell worker to parse and filter
    worker.postMessage({
      modites: rawListSource,
      filter: query,
      date: new Date(),
      locale,
    });
  };

  const onTabClick = (type: string): void => {
    if (type !== listType) {
      const date = new Date();
      const rawSource = type === 'modites' ? rawModites : rawProjects;
      setListType(type);
      rawListSource = rawSource;
      worker.postMessage({ modites: rawSource, filter, date, locale });
    }
  }

  useEffect(() => {
    // start the clock
    const intervalID: number = window.setInterval(tick, 1000);
    const clearTimeInterval = (): void => clearInterval(intervalID);

    // if we already have something, we can safely abandon fetching
    if (listData) {
      if (listData.length) return clearTimeInterval;
    } else {
      // initial data parsing
      worker.onmessage = (event: WorkerEvent) => {
        requestAnimationFrame(() => {
          setModites(event.data);
          setListData(event.data);
        });
      };
      // get data from the api
      getModiteData(filter, new Date());
    }
  });

  const onRowClick = (record: Modite | Project) => {
    // TODO: expand this to set either the activeModite or the activeProject using record.recordType
    setActiveModite(record);
    setModites(record);
  }

  const Row = ({ index, style }: ListChildComponentProps) => (
    <div className={s.moditeRow} style={style} onClick={() => onRowClick(listData[index])}>
      <ModiteListItem modite={listData[index]} key={listData[index].id} />
    </div>
  );

  const cx = classNames.bind(s);
  const mapWindowCls = cx('mapWindow', { mapWindowCollapsed: collapsed });
  const globalBarWrapCls = cx('globalBarWrap', { globalBarWrapHidden: !!activeModite });
  const searchbarWrapCls = cx('searchbarWrap', { searchbarWrapCollapsed: collapsed || filtered, searchbarWrapHidden: !!activeModite });
  const searchbarSpacerCls = cx('searchbarSpacer', { searchbarSpacerCollapsed: collapsed || filtered });
  const moditesTabCls = cx('listTypeTab', { listTypeTabSelected: listType === 'modites' });
  const projectsTabCls = cx('listTypeTab', { listTypeTabSelected: listType === 'projects' });
  const activeModiteCls = cx({ activeModiteShown: !!activeModite });
  const tabCtCls = cx('tabCt', { tabCtHidden: !!activeModite });

  return (
    <>
      <IonPage className={s.moditeListCt}>
        <div className={mapWindowCls}></div>
        <div className={s.moditeListWrap}>
          {!listData || !listData.length ? (
            <SkeletonList/>
          ) : (
            <AutoSizer aria-label="The list of Modites">
              {({ height, width }: { height: number; width: number }) => (
                <>
                <List
                  className="List"
                  itemSize={60}
                  itemCount={(listData && listData.length) || 10}
                  height={height}
                  width={width}
                  initialScrollOffset={lastScrollOffset}
                  onScroll={onScroll}
                  itemKey={(index: number) => listData[index].id}
                  overscanCount={30}
                >
                  {Row}
                </List>
                </>
              )}
            </AutoSizer>
          )}
          <DetailsView className={activeModiteCls}/>
        </div>
        <div className={tabCtCls}>
          <button className={moditesTabCls} onClick={() => onTabClick('modites')}>Employees</button>
          <button className={projectsTabCls} onClick={() => onTabClick('projects')}>Projects</button>
        </div>
      </IonPage>

      <div className={s.searchbarCt}>
        <div className={globalBarWrapCls}>
          <div className={s.globalSpacer}></div>
          <div className={s.globeTitle}>MODITE LAND</div>
          <IonIcon
            class={`${s.globeButton}`}
            slot="icon-only"
            ios="ios-globe"
            md="ios-globe"
            // TODO: wire up the handling of the globe click for really realz
            onClick={() => console.log('clicked')}
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
          <div className={searchbarSpacerCls}></div>
        </label>
      </div>
    </>
  );
};

export default withRouter(ModiteList);
