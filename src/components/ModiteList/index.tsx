import { IonIcon, IonPage, IonSearchbar } from '@ionic/react';
import classNames from 'classnames/bind';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
// @ts-ignore
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
// @ts-ignore
// tslint:disable-next-line
import Worker from 'worker-loader!./formatModites.js'; // eslint-disable-line import/no-webpack-loader-syntax
import DetailsView from '../../components/DetailsView';
import IFilterEvent from '../../models/FilterEvent';
import IModite from '../../models/Modite';
import IModiteListProps from '../../models/ModiteListProps';
import IProject from '../../models/Project';
import IWorkerEvent from '../../models/WorkerEvent';
import ModiteContext from '../../state/modite';
import ModitesContext from '../../state/modites';
import ModiteListItem from '../ModiteListItem';
import SkeletonList from '../SkeletonList';
import s from './styles.module.css';

// get locale once
const locale: string = navigator.language;

// reference to the worker that formats and filters modite data
const worker: Worker = new Worker();

// keep server response for Modites here for future reference
let rawModites: IModite[];
// keep server response for Projects here for future reference
let rawProjects: IProject[];
// points the the active raw list data: rawModites or rawProjects
let rawListSource: IModite[] | IProject[];

// get data from server
async function getModiteData(filter: string, date: Date): Promise<void> {
  if (!rawModites || !rawModites.length) {
    const [modites, projects]: [IModite[], IProject[]] = await Promise.all([
      fetch('https://modus.app/modites/all').then(res => res.json()),
      fetch('https://modus.app/projects/all').then(res => res.json()),
    ]);

    rawModites = modites;
    rawProjects = projects;
  }
  rawListSource = rawModites;
  worker.postMessage({ modites: rawListSource, filter, date, locale });
}

let minutes: number; // used by tick
let lastFilter: string = ''; // used by onFilter
let lastScrollOffset: number = 0; // used by onScroll

const ModiteList: FunctionComponent<IModiteListProps & RouteComponentProps> = () => {
  const [activeModite, setActiveModite]: [IModite, React.Dispatch<any>] = useContext(ModiteContext);
  const [, setModites]: [IModite[], React.Dispatch<any>] = useContext(ModitesContext);
  const [filter, setFilter]: [string, React.Dispatch<any>] = useState('');
  const [filtered, setFiltered]: [boolean, React.Dispatch<any>] = useState(false);
  const [collapsed, setCollapsed]: [boolean, React.Dispatch<any>] = useState(false);
  const [listType, setListType]: [string, React.Dispatch<any>] = useState('modites');
  const [listData, setListData]: [any, React.Dispatch<any>] = useState();

  const onScroll = ({ scrollOffset }: { scrollOffset: number }) => {
    const threshold: number = 10; // scroll threshold to hit before acting on the layout

    if (
      (lastScrollOffset <= threshold && scrollOffset > threshold) ||
      (lastScrollOffset >= threshold && scrollOffset < threshold)
    ) {
      requestAnimationFrame(() => {
        setCollapsed(scrollOffset > threshold);
      });
    }

    lastScrollOffset = scrollOffset;
  };

  // get fresh time
  const tick: () => void = (): void => {
    const date: Date = new Date();
    const currentMinutes: number = date.getMinutes();
    if (minutes && currentMinutes !== minutes) {
      worker.postMessage({ modites: rawListSource, filter: lastFilter, date, locale });
    }
    minutes = currentMinutes;
  };

  const onFilter = (event: IFilterEvent): void => {
    const query: string = event.detail.value || '';

    setFiltered(query.length);

    if (query === lastFilter) {
      return;
    }
    lastFilter = query;

    // save filter
    setFilter(query);

    // tell worker to parse and filter
    worker.postMessage({
      date: new Date(),
      filter: query,
      locale,
      modites: rawListSource,
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
  };

  useEffect(() => {
    // start the clock
    const intervalID: number = window.setInterval(tick, 1000);
    const clearTimeInterval = (): void => clearInterval(intervalID);

    // if we already have something, we can safely abandon fetching
    if (listData) {
      if (listData.length) {
        return clearTimeInterval;
      }
    } else {
      // initial data parsing
      worker.onmessage = (event: IWorkerEvent) => {
        requestAnimationFrame(() => {
          setModites(event.data);
          setListData(event.data);
        });
      };
      // get data from the api
      getModiteData(filter, new Date());
    }
  });

  const onRowClick = (record: IModite | IProject) => {
    // TODO: expand this to set either the activeModite or the activeProject using record.recordType
    setActiveModite(record);
    setModites(record);
  };

  const Row = ({ index, style }: ListChildComponentProps) => (
    <div className={s.moditeRow} style={style} onClick={() => onRowClick(listData[index])}>
      <ModiteListItem modite={listData[index]} key={listData[index].id} />
    </div>
  );

  const cx = classNames.bind(s);
  const mapWindowCls = cx('mapWindow', { mapWindowCollapsed: collapsed });
  const globalBarWrapCls = cx('globalBarWrap', { globalBarWrapHidden: !!activeModite });
  const searchbarWrapCls = cx('searchbarWrap', {
    searchbarWrapCollapsed: collapsed || filtered,
    searchbarWrapHidden: !!activeModite,
  });
  const searchbarSpacerCls = cx('searchbarSpacer', {
    searchbarSpacerCollapsed: collapsed || filtered,
  });
  const moditesTabCls = cx('listTypeTab', { listTypeTabSelected: listType === 'modites' });
  const projectsTabCls = cx('listTypeTab', { listTypeTabSelected: listType === 'projects' });
  const activeModiteCls = cx({ activeModiteShown: !!activeModite });
  const tabCtCls = cx('tabCt', { tabCtHidden: !!activeModite });

  return (
    <>
      <IonPage className={s.moditeListCt}>
        <div className={mapWindowCls} />
        <div className={s.moditeListWrap}>
          {!listData || !listData.length ? (
            <SkeletonList />
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
          <DetailsView className={activeModiteCls} />
        </div>
        <div className={tabCtCls}>
          <button className={moditesTabCls} onClick={() => onTabClick('modites')}>
            Employees
          </button>
          <button className={projectsTabCls} onClick={() => onTabClick('projects')}>
            Projects
          </button>
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
  );
};

export default withRouter(ModiteList);
