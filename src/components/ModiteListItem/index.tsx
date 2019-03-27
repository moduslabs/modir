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
    // <IonMenuToggle key={modite.id} auto-hide="false">
    //   <IonItem button onClick={handleItemClick}>
    //     <IonThumbnail slot="start" class={s.thumbnailContainer}>
    //       <ModiteImage modite={modite} />
    //     </IonThumbnail>

    //     <IonLabel>{modite.real_name}</IonLabel>
    //     <IonLabel class={s.tod}>{modite.tod}</IonLabel>
    //     <IonLabel class={s.time}>{modite.localTime}</IonLabel>
    //   </IonItem>
    // </IonMenuToggle>
    <div>
      <div className={s.itemInnerCt}>
        <div className={s.thumbContainer}>
          <ModiteImage modite={modite} />
        </div>
        <div className={s.nameCt}>{modite.real_name}</div>
        <div className={s.todCt}>{modite.tod}</div>
        <div className={s.localTime}>{modite.localTime}</div>
      </div>
    </div>
  );
};
export default withRouter(ModiteListItem);
