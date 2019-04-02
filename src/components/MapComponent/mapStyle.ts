const lightMapStyle = [
  {
    elementType: 'labels.text.fill',
    featureType: 'administrative',
    stylers: [
      {
        color: '#444444',
      },
    ],
  },
  {
    elementType: 'all',
    featureType: 'landscape',
    stylers: [
      {
        color: '#f2f2f2',
      },
    ],
  },
  {
    elementType: 'all',
    featureType: 'poi',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'all',
    featureType: 'road',
    stylers: [
      {
        saturation: -100,
      },
      {
        lightness: 45,
      },
    ],
  },
  {
    elementType: 'all',
    featureType: 'road.highway',
    stylers: [
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    featureType: 'road.arterial',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'all',
    featureType: 'transit',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'all',
    featureType: 'water',
    stylers: [
      {
        color: '#3a5268',
      },
      {
        visibility: 'on',
      },
    ],
  },
]

export default lightMapStyle
