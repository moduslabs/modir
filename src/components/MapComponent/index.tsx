import React from 'react';
import GoogleMapReact from 'google-map-react';
import MapComponentProps from './MapComponentProps';
import lightMapStyle from './mapStyle';

// default center point at Reston, VA, for times when a location is not available
const defaultCenter = {
  lat: 38.9555767,
  lng: -77.3837376
};

// default options to apply to the map.  Can be applied to an options prop later if desired
const defaultOptions = {
  styles: lightMapStyle
};

// map component - to render correctly should be the child of a container that has been given an explicit size or whose size is managed by a display layout
function MapComponent({ center = defaultCenter} : MapComponentProps) {
  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: 'AIzaSyD4_PXNfezw8mDmjeLEZCdZYr3g-Mt9EcA' }} // this is my own dev Google Maps API key.  We'll want to get a REAL one eventually if we stick with Google Maps, but that requires setting up a key on a Modus owned login with billing set up and everything (a new requirement by Google)
      defaultCenter={center}
      defaultZoom={11}
      options={defaultOptions}
    ></GoogleMapReact>
  );
}

export default MapComponent;
