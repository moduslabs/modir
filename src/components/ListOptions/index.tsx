import * as React from 'react'
import {
  IonPopover,
  IonIcon,
  IonToolbar,
  IonButtons,
  IonButton,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonRadioGroup,
  IonRadio,
} from '@ionic/react'
import s from './styles.module.scss'

const ListOptions: FunctionComponent = ({ isOpen, onClose }) => {
  let options: { view: any; sort: any }

  const savedOptions = localStorage.getItem('list-options')
  if (savedOptions) {
    options = JSON.parse(savedOptions)
  } else {
    options = {
      view: 'list',
      sort: 'lasta',
    }
  }
  const saveOptions = () => {
    try {
      localStorage.setItem('list-options', JSON.stringify(options))
    } catch (e) {}
  }

  const onApply = () => {
    saveOptions()
    if (onClose) {
      onClose()
    }
  }

  const onCancel = () => {
    if (onClose) {
      onClose()
    }
  }

  const onViewAsChange = (e) => {
    options.view = e.detail.value
  }

  const onSortByChange = (e) => {
    options.sort = e.detail.value
  }

  return (
    <IonPopover isOpen={isOpen} backdropDismiss={false}>
      <IonList>
        <IonItem>
          <IonListHeader>List Options</IonListHeader>
        </IonItem>

        <IonRadioGroup value={options.view} onIonChange={onViewAsChange}>
          <IonListHeader>
            <IonLabel>View As</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonIcon class={s.globeButton} mode="ios" name="list" />
            <IonLabel>List</IonLabel>
            <IonRadio slot="start" value="list" />
          </IonItem>
          <IonItem>
            <IonIcon class={s.globeButton} mode="ios" name="globe" />
            <IonLabel>Globe</IonLabel>
            <IonRadio slot="start" value="globe" />
          </IonItem>
        </IonRadioGroup>

        <IonRadioGroup value={options.sort} onIonChange={onSortByChange}>
          <IonListHeader>
            <IonLabel>Sort By</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonLabel>Last Name Asc</IonLabel>
            <IonRadio value="lasta" />
          </IonItem>
          <IonItem>
            <IonLabel>Last Name Desc</IonLabel>
            <IonRadio value="lastd" />
          </IonItem>
          <IonItem>
            <IonLabel>First Name Asc</IonLabel>
            <IonRadio value="firsta" />
          </IonItem>
          <IonItem>
            <IonLabel>First Name Desc</IonLabel>
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
            <IonLabel>Local Time Asc</IonLabel>
            <IonRadio value="timea" />
          </IonItem>
          <IonItem>
            <IonLabel>Local Time Desc</IonLabel>
            <IonRadio value="timed" />
          </IonItem>
        </IonRadioGroup>
      </IonList>
      <IonToolbar>
        <IonButtons slot="end">
          <IonButton color="success" onClick={onApply}>
            Apply
          </IonButton>
          <IonButton color="danger" onClick={onCancel}>
            Cancel
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonPopover>
  )
}

export default React.memo(ListOptions)
