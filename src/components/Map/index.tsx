import React, { useCallback, useEffect, useState } from 'react'
import MapGL, { ViewportProps, ViewState, Marker } from 'react-map-gl'
import { useInterval } from '../../hook/useInterval'
import { useData } from '../../service/Data'
import { ContextArray, useMap } from '../../service/Map'
import Pin from './pin'
import Modite, { LocationData } from '../../models/Modite'

interface Props {
  animate?: boolean
  className?: string
  height?: string
}

const moditeToCoord = (modite: Modite): any => {
  if (!modite.profile || !modite.profile.fields) {
    return null
  }

  const { locationData = {} } = modite.profile.fields
  const { lat: latitude, lon: longitude } = locationData as LocationData

  return latitude && longitude ? { latitude, longitude } : null
}

const Map = ({ animate = false, className, height: heightProp = '100%' }: Props) => {
  const [state] = useData()
  const [viewport, setViewport]: ContextArray = useMap()
  const [height, setHeight] = useState<number | string>(heightProp)
  const [width, setWidth] = useState<number | string>('100%')

  const onViewportChange = useCallback((newViewport: ViewState): void => {
    /* eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion */
    const stuff = { ...newViewport } as ViewportProps

    setViewport(newViewport)

    if (stuff.height) {
      setHeight(stuff.height)
    }

    if (stuff.width) {
      setWidth(stuff.width)
    }
  }, [])

  useEffect(() => {
    setHeight(heightProp)
  }, [heightProp])

  if (animate) {
    useInterval(
      () =>
        setViewport({
          ...viewport,
          longitude: viewport.longitude + 0.1,
        }),
      50,
    )
  }

  return (
    <MapGL
      className={className}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      {...viewport}
      height={height}
      width={width}
      mapStyle="mapbox://styles/mapbox/light-v10"
      onViewportChange={(newViewport: ViewState) => onViewportChange(newViewport)}
    >
      {state.modites.map((modite: Modite): any => {
        if (!modite.id) {
          return null
        }

        const coords = moditeToCoord(modite)

        if (!coords) {
          return coords
        }

        return (
          <Marker key={modite.id} latitude={coords.latitude} longitude={coords.longitude}>
            <Pin size={viewport.modite === modite ? 'big' : 'normal'} />
          </Marker>
        )
      })}
    </MapGL>
  )
}

export default Map
