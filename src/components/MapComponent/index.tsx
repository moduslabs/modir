import { Circle, color, create } from '@amcharts/amcharts4/core'
import { MapChart, MapImageSeries, MapPolygonSeries, projections, MapPolygon, MapImage } from '@amcharts/amcharts4/maps'
import React, { useEffect, useRef, RefObject } from 'react'
import Modite, { LocationData } from '../../models/Modite'
import MapComponentProps from '../../types/components/MapComponent'
import s from './styles.module.css'

interface LatLon {
  latitude: number
  longitude: number
}

interface Marker extends LatLon {
  title: string
}

let map: MapChart
let imageSeries: MapImageSeries
let cachedRecords: string
let circle: Circle
let timeout: number

const updateMap = (markerData: any) => {
  if (imageSeries.data === markerData) return
  clearTimeout(timeout)

  requestAnimationFrame(() => {
    imageSeries.deepInvalidate()

    if (markerData.length === 1) {
      const { latitude, longitude }: LatLon = markerData[0]

      circle.radius = 12
      circle.strokeWidth = 10
      circle.stroke = color('#FF5C5D')
      circle.strokeOpacity = 0.3
      imageSeries.data = markerData
      imageSeries.show(0)
      map.zoomToGeoPoint({ latitude, longitude }, 5, true, 500)
    } else {
      circle.radius = 6
      circle.strokeWidth = 2
      circle.stroke = color('#FFFFFF')
      circle.strokeOpacity = 1
      map.goHome(0)
      imageSeries.hide()
      timeout = window.setTimeout(() => {
        imageSeries.data = markerData
        imageSeries.show(1500)
      }, 500)
    }
  })
}

/**
 * Initialize the map asynchronously
 */
async function initMap(mapRef: RefObject<HTMLDivElement>) {
  if (!mapRef.current) return

  // Lazy-load the World in low res
  // This is a big chunk which is why we need to consider lazy-loading
  const am4geodataWorldLow = await import('@amcharts/amcharts4-geodata/worldLow' /* webpackChunkName: "world-detail" */)

  const el: HTMLDivElement = mapRef.current
  map = create(el, MapChart)
  map.geodata = am4geodataWorldLow.default
  map.projection = new projections.Miller()
  const polygonSeries: MapPolygonSeries = map.series.push(new MapPolygonSeries())
  polygonSeries.useGeodata = true
  polygonSeries.exclude = ['AQ']

  map.seriesContainer.draggable = false
  map.seriesContainer.resizable = false
  // map.maxZoomLevel = 1;
  map.seriesContainer.events.disableType('doublehit')
  map.chartContainer.background.events.disableType('doublehit')

  // Configure series
  const polygonTemplate: MapPolygon = polygonSeries.mapPolygons.template
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
  const imageSeriesTemplate: MapImage = imageSeries.mapImages.template
  circle = imageSeriesTemplate.createChild(Circle)
  circle.fill = color('#ff5c5d')
  circle.nonScaling = true
  circle.tooltipText = '{title}'

  // Set property fields
  imageSeriesTemplate.propertyFields.latitude = 'latitude'
  imageSeriesTemplate.propertyFields.longitude = 'longitude'
}

const MapComponent = React.memo(({ mapRecords }: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null)

  const populateMap = (): void => {
    const cacheVal: string = mapRecords.map(item => item.id).join('')
    const doUpdate = cachedRecords !== cacheVal

    if (map && mapRecords && doUpdate) {
      const mapData: Modite[] = Array.isArray(mapRecords) ? mapRecords : [mapRecords]
      const markerData: (Marker | null)[] = mapData
        .map((modite: Modite) => {
          if (!modite.profile || !modite.profile.fields) {
            return null
          }

          const { locationData = {}, Location: title } = modite.profile.fields
          const { lat: latitude, lon: longitude } = locationData as LocationData
          return latitude && longitude && title ? { latitude, longitude, title } : null
        })
        .filter(Boolean)

      if (map.isReady()) {
        updateMap(markerData)
      } else {
        map.events.on('ready', () => {
          updateMap(markerData)
        })
      }
      cachedRecords = cacheVal
    }
  }

  useEffect(() => {
    if (!map && mapRef.current) {
      initMap(mapRef)
    }
  }, [])

  useEffect(populateMap, [mapRecords])

  return <div className={`MapEl ${s.mapCt}`} ref={mapRef} />
})

export default MapComponent
