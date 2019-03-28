import React, { useState, useEffect, useContext, FunctionComponent, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
// @ts-ignore
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
// @ts-ignore
import AutoSizer from 'react-virtualized-auto-sizer';
import { IonSearchbar, IonIcon, IonPage } from '@ionic/react';
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

// get locale once
const locale: string = navigator.language;

// reference to the worker that formats and filters modite data
const worker: Worker = new Worker();

// keep server response here for future reference
let rawModites: Modite[];

// get data from server
async function getData(filter: string, date: Date): Promise<void> {
  if (!rawModites || !rawModites.length) {
    const moditesResp: { modites: Modite[] } = await fetch('https://modus.app/modites/all').then(res => res.json());
    rawModites = moditesResp.modites;
  }
  worker.postMessage({ modites: rawModites, filter, date, locale });
}

let minutes: number; // used by tick
let lastFilter: string = ''; // used by onFilter

let lastScrollOffset = 0;

const ModiteList: FunctionComponent<ModiteListProps & RouteComponentProps> = () => {
  const [modites, setModites]: [Modite[], React.Dispatch<any>] = useContext(ModitesContext);
  const [filter, setFilter]: [string, React.Dispatch<any>] = useState('');
  const mapWindowRef: React.MutableRefObject<null> = useRef(null);
  const searchBarWrapRef: React.MutableRefObject<null> = useRef(null);
  const searchbarSpacerRef: React.MutableRefObject<null> = useRef(null);

  const onScroll = ({ scrollOffset }: { scrollOffset: number }) => {
    const threshold = 10; // scroll threshold to hit before acting on the layout

    if ((lastScrollOffset < threshold && scrollOffset > threshold) || (lastScrollOffset > threshold && scrollOffset < threshold)) {
      const modify = scrollOffset > threshold;

      requestAnimationFrame(() => {
        (mapWindowRef.current as any).style.height = modify ? 0 : '40vh';
        (searchBarWrapRef.current as any).style.transform = `translateY(calc(${modify ? '0px' : '40vh / 2 - 21px'}))`;
        (searchbarSpacerRef.current as any).style.width = modify ? '40px' : 0;
      });
    }

    lastScrollOffset = scrollOffset;
  };

  // get fresh time
  const tick: Function = (): void => {
    const date: Date = new Date();
    const currentMinutes: number = date.getMinutes();
    if (minutes && currentMinutes !== minutes) {
      worker.postMessage({ modites: rawModites, filter: lastFilter, date, locale });
    }
    minutes = currentMinutes;
  };

  const onFilter = (event: FilterEvent): void => {
    const query: string = event.detail.value || '';

    if (query === lastFilter) return;
    lastFilter = query;

    // save filter
    setFilter(query);

    //tell worker to parse and filter
    worker.postMessage({
      modites: rawModites,
      filter: query,
      date: new Date(),
      locale,
    });
  };

  useEffect(() => {
    // start the clock
    const intervalID: number = window.setInterval(tick, 1000);
    const clearTimeInterval = (): void => clearInterval(intervalID);

    // if we already have something, we can safely abandon fetching
    if (modites) {
      if (modites.length) return clearTimeInterval;
    } else {
      // initial data parsing
      worker.onmessage = (event: WorkerEvent) => {
        requestAnimationFrame(() => setModites(event.data));
      };
      // get data from the api
      getData(filter, new Date());
    }
  });

  const Row = ({ index, style }: ListChildComponentProps) => (
    <div style={style}>
      <ModiteListItem modite={modites[index]} key={modites[index].id} />
    </div>
  );

  return (
    <>
      <IonPage className={s.moditeListCt}>
        <div className={s.mapWindow} ref={mapWindowRef}></div>
        <div className={s.moditeListWrap}>
          {!modites || !modites.length ? (
            <SkeletonList/>
          ) : (
            <AutoSizer aria-label="The list of Modites">
              {({ height, width }: { height: number; width: number }) => (
                <>
                <List
                  className="List"
                  itemSize={60}
                  itemCount={(modites && modites.length) || 10}
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
        </div>
      </IonPage>

      <div className={s.searchbarCt}>
        <div className={s.globalBarWrap}>
          <div className={s.globalSpacer}></div>
          <div className={s.globeTitle}>MODITE WORLD</div>
          <IonIcon
            class={`${s.globeButton}`}
            slot="icon-only"
            ios="ios-globe"
            md="ios-globe"
            // TODO: wire up the handling of the globe click for real
            onClick={() => console.log('clicked')}
          />
        </div>
        <div className={s.searchbarWrap} ref={searchBarWrapRef}>
          <IonSearchbar
            debounce={200}
            value={filter}
            placeholder="Filter Modites"
            onIonChange={onFilter}
            class={s.searchbar}
          />
          <div ref={searchbarSpacerRef} className={s.globalSpacer2}></div>
        </div>
      </div>
    </>
  );
};

export default withRouter(ModiteList);
