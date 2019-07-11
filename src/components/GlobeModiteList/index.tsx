import React from 'react'
import { FixedSizeList as List, ListChildComponentProps } from 'react-window'
import ModiteImage from '../../components/ModiteImage'
import Time from '../../components/Time'
import { useBuffered } from '../../hook/useBuffered'
import { useData } from '../../service/Data'
import { ContextArray, useMap } from '../../service/Map'
import { DataState } from '../../types/service/Data'
import s from './styles.module.scss'

const GlobeModiteList = () => {
  const [state]: [DataState] = useData()
  const [viewport, setViewport]: ContextArray = useMap()

  const itemSize = (document.body.clientWidth / 4) * 3
  const Item = ({ index, style }: ListChildComponentProps) => {
    const modite = state.modites[index]

    return (
      <div style={style} className={s.item}>
        <ModiteImage className={s.thumbContainer} modite={modite} />
        <div className={s.innerItem}>
          <div>{modite.real_name}</div>
          <div className={s.moditeSubline}>
            <div className={s.moditeLocation}>
              {modite.profile && modite.profile.fields && modite.profile.fields.Location
                ? modite.profile.fields.Location
                : ' '}
            </div>
            <Time modite={modite} />
          </div>
        </div>
      </div>
    )
  }

  const onModiteScroll = useBuffered((index: number) => {
    const modite = state.modites[index]
    const locationData = modite.profile && modite.profile.fields && modite.profile.fields.locationData

    const newViewport = locationData
      ? {
          ...viewport,
          latitude: locationData.lat,
          longitude: locationData.lon,
          modite,
          zoom: 5,
        }
      : {
          ...viewport,
          modite: undefined,
        }

    setViewport(newViewport)
  })

  return (
    <List
      className={s.horizontalList}
      height={150}
      width={300}
      layout="horizontal"
      itemSize={itemSize}
      itemCount={state.modites.length}
      itemKey={(index: number) => state.modites[index].id || (index.toString() as string)}
      onScroll={({ scrollOffset }) => {
        const diff = scrollOffset / itemSize
        const index = Math.floor(diff)

        // if the scroll is more than 1/2, go to the next
        onModiteScroll(diff - index > 0.5 ? index + 1 : index)
      }}
    >
      {Item}
    </List>
  )
}

export default GlobeModiteList
