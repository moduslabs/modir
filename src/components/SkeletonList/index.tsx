import { IonItem, IonLabel, IonSkeletonText, IonThumbnail } from '@ionic/react'
import React, { FunctionComponent } from 'react'
import s from './styles.module.css'

const SkeletonList: FunctionComponent<{}> = () => (
  <div>
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
  </div>
)

export default SkeletonList
