import React, { useState, useEffect, FunctionComponent } from 'react';
import {
  IonContent,
  IonMenuToggle,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonImg,
  IonSearchbar,
  IonSkeletonText,
  IonToolbar,
  IonSlides,
  IonSlide,
  IonIcon,
} from '@ionic/react';
import Modite from '../../models/Modite';
import ListItemProps from '../../models/ListItemProps';
import WorkerEvent from '../../models/WorkerEvent';
import FilterEvent from '../../models/FilterEvent';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
// @ts-ignore
import AutoSizer from 'react-virtualized-auto-sizer';
import moment from 'moment';
import GoogleMapReact from 'google-map-react';
// @ts-ignore
import Worker from 'worker-loader!./formatModites.js';
import s from './styles.module.css';
import lightMapStyle from './mapStyle';

// get locale once
const locale: string = navigator.language;

// reference to the worker that formats and filters modite data
const worker: Worker = new Worker();

// keep server response here for future reference
let rawModites: Modite[];

// get data from server
async function getData(filter: string, date: Date): Promise<void> {
  rawModites = await fetch('https://mosquito-slack-bot.herokuapp.com/modites').then(res => res.json());
  worker.postMessage({ modites: rawModites, filter, date, locale });
}

const ListItem: FunctionComponent<ListItemProps> = ({ list, filter, date, style, modite }) => {
  // const modite = list[index];

  return (
    <IonMenuToggle key={modite.id} auto-hide="false" style={style}>
      <IonItem button class={s.appear} onClick={() => {}} data-modite={modite}>
        <IonThumbnail slot="start" class={s.thumbnailContainer}>
          <IonImg src={modite.profile.image_72} class={s.thumbnail} alt={modite.real_name} />
        </IonThumbnail>

        <IonLabel>{modite.real_name}</IonLabel>
        <IonLabel class={s.tod}>{modite.tod}</IonLabel>
        <IonLabel class={s.time}>{modite.localTime}</IonLabel>
      </IonItem>
    </IonMenuToggle>
  );
};

const SkeletonList: FunctionComponent<{}> = () => (
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
  const [modites, setModites] = useState();
  const [filter, setFilter] = useState('');
  const [date, setDate] = useState(new Date());
  const [activeModite, setActiveModite] = useState({ profile: {} } as Modite);
  const [imageCls, setImageCls] = useState('invisible');
  const [detailsMapCenter, setDetailsMapCenter] = useState({
    lat: 38.9555767,
    lng: -77.3837376
  });

  // get fresh time
  const tick = (): void => setDate(new Date());
  // Modite in the detail view's local date / time
  const formattedLocalTime: string = moment().utc().add(activeModite.tz_offset, 's').format('LLL');

  const onFilter = (event: FilterEvent): void => {
    const query: string = event.detail.value || '';

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

  // the larger image is loaded in the details view.  Once loaded, this callback is called which shows the previously hidden full image
  // this supports the fade in from blurred image to high-res image effect in the details view
  const onFullImageLoad = (): void => {
    const activeCls: string = s.clearAppear + ' hydrated';
    setImageCls(activeCls);
  };

  // retrieves the modite record from the item clicked in the <List>
  const getModiteByItemClick = (e: any): Modite => {
    const { target } = e;
    const { tagName } = target;
    const isIonItem = tagName.toLowerCase() === 'ion-item';
    const el = isIonItem ? target : target.closest('ion-item');

    return el['data-modite'];
  };

  // TODO: I'm sure there's a way to type this correctly, but I wasn't able to sort it out, yet...
  const slides: any = document.getElementById('slides');
  // handles clicks on the list of Modites and shows the details view for the clicked Modite
  const handleListClick = (e: any): void => {
    const modite: Modite = getModiteByItemClick(e);

    // DEV NOTE: hydrated ensures the element is visible and is not managed automatically when setting the element class via state
    setImageCls('hydrated');
    setActiveModite(modite);
    // DEV NOTE: timeout is used as without it the image would intermittently not update between Modite views
    setTimeout(() => slides.slidePrev(), 1);
  };

  // closes the details panel
  const closeDetails = (): void => {
    slides.slideNext();
  }

  const slideStyle = {
    height: '100vh',
    flexDirection: 'column',
  };

  const slidesOptions = {
    initialSlide: 1,
  };

  const mapOptions = {
    mapTypeControl: true,
    styles: lightMapStyle
  };

  const ModiteListItem: FunctionComponent<ListChildComponentProps> = ({ index, style }) => (
    <ListItem list={modites} filter={filter} date={date} style={style} modite={modites[index]} />
  );

  const Skeleton: FunctionComponent<ListChildComponentProps> = () => <SkeletonList />;

  useEffect(() => {
    // start the clock
    const intervalID: number = window.setInterval(tick, 1000 * 60);
    const clearTimeInterval = (): void => clearInterval(intervalID);

    // if we already have something, we can safely abandon fetching
    if (modites) {
      if (modites.length) return clearTimeInterval;
    } else {
      // initial data parsing
      worker.onmessage = (event: WorkerEvent) => setModites(event.data);
      // get data from the api
      getData(filter, date);
    }
  });

  return (
    <IonContent>
      <IonSlides options={slidesOptions} id="slides">

        <IonSlide style={slideStyle} class={s.detailPage}>
          <div className={s.detailsCt}>
            <IonIcon name="close-circle" class={s.closeIcon} onClick={closeDetails}></IonIcon>
            <div className={s.detailImageCt}>
              <IonImg src={activeModite.profile.image_72} alt={activeModite.real_name}/>
              <IonImg class={imageCls} src={activeModite.profile.image_192} alt={activeModite.real_name} onIonImgDidLoad={onFullImageLoad}/>
            </div>
            <div>{activeModite.real_name}</div>
            <div>{formattedLocalTime}</div>
            <hr />
            <div>{activeModite.profile.title}</div>
          </div>
          <div className={s.detailsMapCt}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: 'AIzaSyD4_PXNfezw8mDmjeLEZCdZYr3g-Mt9EcA' }} // this is my own dev Google Maps API key.  We'll want to get a REAL one eventually if we stick with Google Maps, but that requires setting up a key on a Modus owned login with billing set up and everything (a new requirement by Google)
              defaultCenter={detailsMapCenter}
              defaultZoom={11}
              options={mapOptions}
            ></GoogleMapReact>
          </div>
        </IonSlide>

        <IonSlide style={slideStyle}>
          <IonToolbar>
            <IonSearchbar debounce={200} value={filter} placeholder="Filter Modites" onIonChange={onFilter} class={s.slideInDown} />
          </IonToolbar>
          <IonContent onClick={handleListClick}>
            <AutoSizer>
              {({ height, width }: { height: number; width: number }) => (
                <List height={height} itemCount={(modites && modites.length) || 10} itemSize={72} width={width}>
                  {modites && modites.length ? ModiteListItem : Skeleton}
                </List>
              )}
            </AutoSizer>
          </IonContent>
        </IonSlide>

      </IonSlides>
    </IonContent>
  );
}

export default ModiteList;
