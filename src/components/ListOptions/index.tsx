import React, { FunctionComponent} from 'react'
import {IonPopover, IonIcon, IonToolbar, IonButtons, IonButton, IonList, IonListHeader, IonItem, IonLabel, IonRadioGroup, IonRadio} from '@ionic/react'
import s from './styles.module.scss'

const ListOptions: FunctionComponent = ({ isOpen, onClose }) => {
  const options = JSON.parse(localStorage.getItem("list-options")) || {
    view: "list",
    sort: "lasta",
  }
  const saveOptions = () => {
    localStorage.setItem('list-options', JSON.stringify(options))
  }
  return (
    <IonPopover
      isOpen={isOpen}
    >
      <IonList>
        <IonItem>
          <IonListHeader>
            List Options
          </IonListHeader>
        </IonItem>

        <IonRadioGroup
          value={options.view}
          onIonChange = {(e) => {
            options.view = e.detail.value;
        }}>
          <IonListHeader>
            <IonLabel>View As</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonIcon
              class={s.globeButton}
              mode="ios"
              name="list"
            />
            <IonLabel>List</IonLabel>
            <IonRadio slot="start" value="list" />
          </IonItem>
          <IonItem>
            <IonIcon
              class={s.globeButton}
              mode="ios"
              name="globe"
            />
            <IonLabel>Globe</IonLabel>
            <IonRadio slot="start" value="globe" />
          </IonItem>
        </IonRadioGroup>

        <IonRadioGroup
          value={options.sort}
          onIonChange = {(e) => {
            options.sort = e.detail.value;
          }}>
          <IonListHeader>
            <IonLabel>Sort By</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonLabel>Last Asc</IonLabel>
            <IonRadio value="lasta" />
          </IonItem>
          <IonItem>
            <IonLabel>Last Desc</IonLabel>
            <IonRadio value="lastd" />
          </IonItem>
          <IonItem>
            <IonLabel>First Asc</IonLabel>
            <IonRadio value="firsta" />
          </IonItem>
          <IonItem>
            <IonLabel>First Desc</IonLabel>
            <IonRadio value="firstd" />
          </IonItem>
          <IonItem>
            <IonLabel>Tacos Asc</IonLabel>
            <IonRadio value="tacosa" />
          </IonItem>
          <IonItem>
            <IonLabel>Tacos Desc</IonLabel>
            <IonRadio value="tacosd" />
          </IonItem>
          <IonItem>
            <IonLabel>TZ Asc</IonLabel>
            <IonRadio value="timea" />
          </IonItem>
          <IonItem>
            <IonLabel>TZ Desc</IonLabel>
            <IonRadio value="timed" />
          </IonItem>
        </IonRadioGroup>
      </IonList>
      <IonToolbar>
          <IonButtons slot="end">
          <IonButton
            color="success"
            onClick={() => {
              saveOptions()
              if (onClose) {
                onClose()
              }
            }}
          >
            Apply
          </IonButton>
          <IonButton
            color="danger"
            onClick={() => {
              if (onClose) {
                onClose()
              }
            }}
          >
            Cancel
          </IonButton>
          </IonButtons>
        </IonToolbar>
    </IonPopover>
  )
}

export default React.memo(ListOptions)

