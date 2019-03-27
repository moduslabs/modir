import React, { useEffect, useRef } from 'react';
import { Circle, color, create } from '@amcharts/amcharts4/core';
import { MapChart, projections, MapPolygonSeries, MapImageSeries } from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import MapComponentProps from './MapComponentProps';
import { defaultModite } from '../../models/Modite';
import s from './styles.module.css';

function MapComponent({ modite = defaultModite }: MapComponentProps) {
  const mapRef: React.MutableRefObject<null> = useRef(null);
  let map: MapChart;

  useEffect(() => {
    const { locationData = {} } = modite.profile.fields;

    if (!map && mapRef.current) {
      const el: any = mapRef.current;
      map = create(el, MapChart);
      map.geodata = am4geodata_worldLow;
      map.projection = new projections.Miller();
      const polygonSeries = map.series.push(new MapPolygonSeries());
      polygonSeries.useGeodata = true;
      polygonSeries.exclude = ['AQ'];

      map.seriesContainer.draggable = false;
      map.seriesContainer.resizable = false;
      // map.maxZoomLevel = 1;
      map.seriesContainer.events.disableType('doublehit');
      map.chartContainer.background.events.disableType('doublehit');

      // Configure series
      const polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.tooltipText = '{name}';
      polygonTemplate.fill = color('#d6d6d6');

      // Create hover state and set alternative fill color
      const hs = polygonTemplate.states.create('hover');
      hs.properties.fill = color('#d6d6d6');

      polygonTemplate.events.on('hit', function(event: any) {
        map.maxZoomLevel = 1;
        event.target.isActive = false;
      });

      // Create image series
      var imageSeries = map.series.push(new MapImageSeries());

      // Create a circle image in image series template so it gets replicated to all new images
      var imageSeriesTemplate = imageSeries.mapImages.template;
      var circle = imageSeriesTemplate.createChild(Circle);
      circle.radius = 10;
      circle.fill = color('#ff5c5d');
      circle.stroke = color('#FFFFFF');
      circle.strokeWidth = 4;
      circle.nonScaling = true;
      circle.tooltipText = '{title}';

      // Set property fields
      imageSeriesTemplate.propertyFields.latitude = 'latitude';
      imageSeriesTemplate.propertyFields.longitude = 'longitude';

      if (locationData) {
        // Add user location by lat / lon
        const { Location: title } = modite.profile.fields;
        let { lat: latitude, lon: longitude } = locationData;

        map.events.on('ready', () => {
          if (latitude && longitude) {
            requestAnimationFrame(() => {
              map.zoomToGeoPoint({ latitude, longitude }, 5, true, 500);
              imageSeries.data = [{ latitude, longitude, title }];
            });
          }
        });
      }
    }
  });

  return <div className={s.mapCt} ref={mapRef} />;
}

export default MapComponent;
