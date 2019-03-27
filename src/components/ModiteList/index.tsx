import React, { useState, useEffect, FunctionComponent, useRef } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { IonContent, IonSearchbar, IonToolbar, IonIcon, IonButtons } from '@ionic/react';
import Modite from '../../models/Modite';
import WorkerEvent from '../../models/WorkerEvent';
import FilterEvent from '../../models/FilterEvent';
// @ts-ignore
import Worker from 'worker-loader!./formatModites.js'; // eslint-disable-line import/no-webpack-loader-syntax
import s from './styles.module.css';
import ModiteListProps from '../../models/ModiteListProps';
import SkeletonList from '../SkeletonList';
import ModiteListItem from '../ModiteListItem';

// get locale once
const locale: string = navigator.language;

// reference to the worker that formats and filters modite data
const worker: Worker = new Worker();

// keep server response here for future reference
let rawModites: Modite[];

// get data from server
async function getData(filter: string, date: Date): Promise<void> {
  if (!rawModites || !rawModites.length) {
    rawModites = await fetch('https://modus.app/modites/all').then(res => res.json());
  }
  worker.postMessage({ modites: rawModites, filter, date, locale });
}

let minutes: number; // used by tick
let lastFilter: string = ''; // used by onFilter

const ModiteList: FunctionComponent<ModiteListProps & RouteComponentProps> = () => {
  const [modites, setModites]: [Modite[], React.Dispatch<any>] = useState();
  const [filter, setFilter]: [string, React.Dispatch<any>] = useState('');
  const itemWindow: React.MutableRefObject<null> = useRef(null);

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

  const onScroll = (e: any) => {
    // console.log(e);
    if (itemWindow && itemWindow.current) {
      // (itemWindow.current as any).style.backgroundColor = 'red';
    }
  }

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

  const AllItems = () => {
    const myMap = modites.map((modite: Modite, i: number) => {
      return <ModiteListItem modite={modite} key={modite.id} />;
    });
    const style = { height: 200 };
    const items = [<div style={style} ref={itemWindow}></div>, ...myMap];

    return (
      <>
        {items}
      </>
    );
  }

  return (
    <>
      {/* <IonToolbar>
        <IonSearchbar
          debounce={200}
          value={filter}
          placeholder="Filter Modites"
          onIonChange={onFilter}
          class={s.slideInDown}
        />
        <IonButtons slot="end">
          <Link to="/globe">
            <IonIcon
              class={`${s.worldMapButton} ${s.slideInDown}`}
              slot="icon-only"
              ios="md-globe"
              md="md-globe"
            />
          </Link>
        </IonButtons>
      </IonToolbar> */}

      <IonContent scrollEvents={true} onIonScroll={onScroll}>
        {!modites || !modites.length ? (
          <SkeletonList />
        ) : (
          <AllItems />
        )}
      </IonContent>

      <div className={s.searchbarCt}>
        <div className={s.searchbarWrap}>
          <IonSearchbar
            debounce={200}
            value={filter}
            placeholder="Filter Modites"
            onIonChange={onFilter}
            class={s.slideInDown + ' ' + s.searchbar}
          />
        </div>
      </div>
    </>
  );
};

export default withRouter(ModiteList);
