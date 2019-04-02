import am4geodataWorldLow from '@amcharts/amcharts4-geodata/worldLow'
import { Circle, color, create } from '@amcharts/amcharts4/core'
import { MapChart, MapImageSeries, MapPolygonSeries, projections } from '@amcharts/amcharts4/maps'
import React, { useEffect, useRef } from 'react'
import s from './styles.module.css'

// TODO: type the props correctly
function GlobeComponent() {
  const mapRef: React.MutableRefObject<null> = useRef(null)
  let map: MapChart

  useEffect(() => {
    if (!map && mapRef.current) {
      const el: any = mapRef.current
      map = create(el, MapChart)
      map.geodata = am4geodataWorldLow
      map.projection = new projections.Orthographic()
      const polygonSeries = map.series.push(new MapPolygonSeries())
      polygonSeries.useGeodata = true
      // polygonSeries.exclude = ["AQ"];

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
      const imageSeries = map.series.push(new MapImageSeries())

      // Create a circle image in image series template so it gets replicated to all new images
      const imageSeriesTemplate = imageSeries.mapImages.template
      const circle = imageSeriesTemplate.createChild(Circle)
      circle.radius = 10
      circle.fill = color('#ff5c5d')
      circle.stroke = color('#FFFFFF')
      circle.strokeWidth = 4
      circle.nonScaling = true
      circle.tooltipText = '{title}'

      // Set property fields
      imageSeriesTemplate.propertyFields.latitude = 'latitude'
      imageSeriesTemplate.propertyFields.longitude = 'longitude'

      setInterval(() => {
        const latitude = 43.5858014
        const longitude = -116.1219831
        const title = 'Boise, ID'
        imageSeries.data = [{ latitude, longitude, title }]
        map.deltaLongitude = -longitude
      }, 5000)

      setInterval(() => {
        const latitude = 40.6974034
        const longitude = -74.1197614
        const title = 'New York City, NY'
        imageSeries.data = [{ latitude, longitude, title }]
        map.deltaLongitude = -longitude
      }, 10000)
    }
  })

  return <div className={s.globeInnerCt} ref={mapRef} />
}

export default GlobeComponent
