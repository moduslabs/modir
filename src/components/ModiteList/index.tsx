import React, { Component } from 'react';
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

function renderlistItems(list: Modite[], filter: string) {
  return list
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
    ));
}

class ModiteList extends Component {
  state = {
    modites: [],
    filter: '',
  };

  componentDidMount() {
    fetch('https://mosquito-slack-bot.herokuapp.com/modites')
      .then(res => res.json())

      // sort by last name
      .then(modites => {
        this.setState({
          modites: modites.sort((prev: Modite, next: Modite) => {
            const prevName = prev.profile.last_name;
            const nextName = next.profile.last_name;

            if (prevName < nextName) return -1;
            if (prevName > nextName) return 1;
            return 0;
          }),
        });
      });
  }

  render() {
    return (
      <IonContent>
        <IonSearchbar
          debounce={500}
          placeholder="Filter Modites"
          onIonChange={event => this.setState({ filter: event.detail.value })}
        />
        <IonList>
          <IonListHeader>Navigate</IonListHeader>
          {renderlistItems(this.state.modites, this.state.filter)}
        </IonList>
      </IonContent>
    );
  }
}

export default ModiteList;
