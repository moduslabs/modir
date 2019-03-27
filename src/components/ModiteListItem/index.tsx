import React, { FunctionComponent, useContext } from 'react';
import ListItemProps from '../../models/ListItemProps';
import { RouteComponentProps, withRouter } from 'react-router';
import Modite, { defaultModite } from '../../models/Modite';
import ModiteContext from '../../state/modite';
import ModiteProfileResp from '../../models/ModiteProfileResp';
import { IonMenuToggle, IonItem, IonThumbnail, IonLabel } from '@ionic/react';
import ModiteImage from '../ModiteImage';
import s from './styles.module.css';

const ModiteListItem: FunctionComponent<ListItemProps & RouteComponentProps> = ({
  modite,
  history,
}) => {
  const [activeModite, setActiveModite]: [Modite, React.Dispatch<any>] = useContext(ModiteContext);
  const handleItemClick = async (): Promise<void> => {
    if (modite.id !== activeModite.id) {
      setActiveModite(defaultModite);
      history.push(`/details/${modite.id}`);
      const moditeProfile: ModiteProfileResp = await fetch(
        `https://modus.app/modite/${modite.id}`,
      ).then(res => res.json());
      if (moditeProfile.ok) modite.profile = moditeProfile.profile;
      setActiveModite(modite);
    }
  };

  return (
    <IonMenuToggle key={modite.id} auto-hide="false">
      <IonItem button onClick={handleItemClick}>
        <IonThumbnail aria-hidden="true" slot="start" class={s.thumbnailContainer}>
          <ModiteImage modite={modite} />
        </IonThumbnail>

        <IonLabel>{modite.real_name}</IonLabel>
        <IonLabel aria-hidden="true" class={s.tod}>
          {modite.tod}
        </IonLabel>
        <IonLabel class={s.time}>{modite.localTime}</IonLabel>
      </IonItem>
    </IonMenuToggle>
  );
};
export default withRouter(ModiteListItem);
