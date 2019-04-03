import am4geodataWorldLow from '@amcharts/amcharts4-geodata/worldLow'
import { Circle, color, create } from '@amcharts/amcharts4/core'
import { MapChart, MapImageSeries, MapPolygonSeries, projections } from '@amcharts/amcharts4/maps'
import React, { useEffect, useRef } from 'react'
import IModite, { defaultModite } from '../../models/Modite'
import MapComponentProps from './MapComponentProps'
import s from './styles.module.css'
import IProject from '../../models/Project'

let map: MapChart
let imageSeries: any

const updateMap = (markerData: any) => {
  imageSeries.data = markerData
  if (markerData.length === 1) {
    const { latitude, longitude } = markerData[0]
    map.zoomToGeoPoint({ latitude, longitude }, 5, true, 500)
  } else {
    map.goHome(500)
  }
}

const MapComponent = ({ modites }: MapComponentProps) => {
  const mapRef: React.MutableRefObject<null> = useRef(null)

  useEffect(() => {
    if (!map && mapRef.current) {
      const el: any = mapRef.current
      map = create(el, MapChart)
      map.geodata = am4geodataWorldLow
      map.projection = new projections.Miller()
      const polygonSeries = map.series.push(new MapPolygonSeries())
      polygonSeries.useGeodata = true
      polygonSeries.exclude = ['AQ']

      map.seriesContainer.draggable = false
      map.seriesContainer.resizable = false
      // map.maxZoomLevel = 1;
      map.seriesContainer.events.disableType('doublehit')
      map.chartContainer.background.events.disableType('doublehit')

      // Configure series
      const polygonTemplate = polygonSeries.mapPolygons.template
      polygonTemplate.tooltipText = '{name}'
      polygonTemplate.fill = color('#d6d6d6')

      // Create hover state and set alternative fill color
      const hs = polygonTemplate.states.create('hover')
      hs.properties.fill = color('#d6d6d6')

      polygonTemplate.events.on('hit', (event: any) => {
        map.maxZoomLevel = 1
        event.target.isActive = false
      })

      // Create image series
      imageSeries = map.series.push(new MapImageSeries())

      // Create a circle image in image series template so it gets replicated to all new images
      const imageSeriesTemplate = imageSeries.mapImages.template
      const circle = imageSeriesTemplate.createChild(Circle)
      circle.radius = 6
      circle.fill = color('#ff5c5d')
      circle.stroke = color('#FFFFFF')
      circle.strokeWidth = 2
      circle.nonScaling = true
      circle.tooltipText = '{title}'

      // Set property fields
      imageSeriesTemplate.propertyFields.latitude = 'latitude'
      imageSeriesTemplate.propertyFields.longitude = 'longitude'
    }

    if (map && modites) {
      const isIndividual = !Array.isArray(modites)
      const sampleRecord: any = isIndividual ? modites : (modites as (IProject | IModite)[])[0]
      let mapData: IModite | IModite[] | IProject[]

      // if the modites data passed in is a user or users then just use it directly
      // else find the users list on the record passed in and use that for the map data
      if (sampleRecord.recordType === 'user') {
        mapData = modites
      } else {
        mapData = sampleRecord.users || []
      }

      ;(mapData as IModite[]) = isIndividual ? [mapData as IModite] : (mapData as IModite[])

      let markerData: any = (mapData as IModite[]).map(modite => {
        if (!modite.profile || !modite.profile.fields) {
          return
        }

        const { locationData = {}, Location: title } = modite.profile.fields
        const { lat: latitude, lon: longitude } = locationData
        return latitude && longitude && title ? { latitude, longitude, title } : null
      })

      markerData = markerData.filter((item: any) => item)

      if (map.isReady()) {
        updateMap(markerData)
      } else {
        map.events.on('ready', () => {
          requestAnimationFrame(() => {
            updateMap(markerData)
          })
        })
      }
    }
  })

  return <div className={s.mapCt} ref={mapRef} />
}

export default MapComponent
