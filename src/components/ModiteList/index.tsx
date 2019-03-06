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
} from '@ionic/react';
import s from './styles.module.css';

type Modite = {
  real_name: string;
  name: string;
  id: string;
  profile: {
    last_name: string;
    image_72: string;
  };
};

type ListItemProps = {
  list: Modite[];
  filter: string;
};

const ListItem: FunctionComponent<ListItemProps> = ({ list, filter }) => (
  <>
    {list
      .filter(
        modite =>
          modite.real_name.toLowerCase().indexOf(filter.toLowerCase()) > -1
      )
      .map(modite => (
        <IonMenuToggle key={modite.id} auto-hide="false">
          <IonItem button onClick={() => alert(modite.real_name)}>
            <IonThumbnail slot="start">
              <IonImg src={modite.profile.image_72} class={s.thumbnail} />
            </IonThumbnail>

            <IonLabel>{modite.real_name}</IonLabel>
          </IonItem>
        </IonMenuToggle>
      ))}
  </>
);

function ModiteList() {
  const [modites, setModites] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    // if we already have something, we can safely abandon fetching
    if (modites.length) return;

    fetch('https://mosquito-slack-bot.herokuapp.com/modites')
      .then(res => res.json())

      // sort by last name
      .then(modites => {
        setModites(
          modites.sort((prev: Modite, next: Modite) => {
            const prevName = prev.profile.last_name;
            const nextName = next.profile.last_name;

            if (prevName < nextName) return -1;
            if (prevName > nextName) return 1;
            return 0;
          })
        );
      });
  });

  return (
    <IonContent>
      <IonSearchbar
        debounce={500}
        placeholder="Filter Modites"
        onIonChange={event => setFilter(event.detail.value || '')}
        value={filter}
      />
      <IonList>
        <IonListHeader>Modites</IonListHeader>
        <ListItem list={modites} filter={filter} />
      </IonList>
    </IonContent>
  );
}

export default ModiteList;
