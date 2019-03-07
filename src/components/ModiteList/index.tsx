import React, { useState, useEffect, FunctionComponent } from 'react';
import {
  IonList,
  IonContent,
  IonListHeader,
  IonMenuToggle,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonImg,
  IonSearchbar,
  IonSkeletonText,
} from '@ionic/react';

// @ts-ignore
import Worker from 'worker-loader!./formatModites.js';
import s from './styles.module.css';

type Modite = {
  real_name: string;
  name: string;
  id: string;
  tz: string;
  color: string;
  localTime: string;
  tod: string;
  profile: {
    title: string;
    last_name: string;
    phone: string;
    email: string;
    image_72: string;
    image_192: string;
    image_512: string;
  };
};

type ListItemProps = {
  list: Modite[];
  filter: string;
  date: Date;
};

type WorkerEvent = {
  data: never[];
};

type FilterEvent = {
  detail: {
    value: string | undefined;
  };
};

// get locale once
const locale = navigator.language;

// reference to the worker that formats and filters modite data
const worker = new Worker();

// keep server response here for future reference
let rawModites: Modite[];

// get data from server
async function getData(filter: string, date: Date) {
  rawModites = await fetch(
    'https://mosquito-slack-bot.herokuapp.com/modites'
  ).then(res => res.json());
  worker.postMessage({ modites: rawModites, filter, date, locale });
}

const ListItem: FunctionComponent<ListItemProps> = ({ list, filter, date }) => (
  <>
    {list.map(modite => (
      <IonMenuToggle key={modite.id} auto-hide="false">
        <IonItem
          button
          class={s.appear}
          onClick={() => alert(modite.real_name)}
        >
          <IonThumbnail slot="start" class={s.thumbnailContainer}>
            <IonImg
              src={modite.profile.image_72}
              class={s.thumbnail}
              alt={modite.real_name}
            />
          </IonThumbnail>

          <IonLabel>{modite.real_name}</IonLabel>
          <IonLabel class={s.tod}>{modite.tod}</IonLabel>
          <IonLabel class={s.time}>{modite.localTime}</IonLabel>
        </IonItem>
      </IonMenuToggle>
    ))}
  </>
);

const SkeletonList: React.SFC<{}> = () => (
  <>
    {Array.from(new Array(10)).map((_, index) => (
      <IonItem key={index}>
        <IonThumbnail slot="start" class={s.thumbnailContainer}>
          <IonSkeletonText />
        </IonThumbnail>

        <IonLabel>
          <IonSkeletonText style={{ width: `${Math.random() * 30 + 50}%` }} />
        </IonLabel>
        <IonLabel class={s.tod}>
          <IonSkeletonText style={{ width: '60%' }} />
        </IonLabel>
        <IonLabel class={s.time}>
          <IonSkeletonText style={{ width: '80%' }} />
        </IonLabel>
      </IonItem>
    ))}
  </>
);

function ModiteList() {
  const [modites, setModites] = useState([]);
  const [filter, setFilter] = useState('');
  const [date, setDate] = useState(new Date());

  // get fresh time
  const tick = () => setDate(new Date());

  const onFilter = (event: FilterEvent) => {
    const query = event.detail.value || '';

    // save filter
    setFilter(query);

    //tell worker to parse and filter
    worker.postMessage({
      modites: rawModites,
      filter: query,
      date,
      locale,
    });
  };

  useEffect(() => {
    // start the clock
    const intervalID = setInterval(tick, 1000 * 60);
    const clearTimeInterval = () => clearInterval(intervalID);

    // if we already have something, we can safely abandon fetching
    if (modites.length) return clearTimeInterval;

    // initial data parsing
    worker.onmessage = (event: WorkerEvent) => setModites(event.data);

    // get data from the api
    getData(filter, date);
  });

  return (
    <IonContent>
      <IonSearchbar
        debounce={200}
        value={filter}
        placeholder="Filter Modites"
        onIonChange={onFilter}
        class={s.slideInDown}
      />

      <IonList>
        <IonListHeader>Modites</IonListHeader>
        {modites.length ? (
          <ListItem list={modites} filter={filter} date={date} />
        ) : (
          <SkeletonList />
        )}
      </IonList>
    </IonContent>
  );
}

export default ModiteList;
