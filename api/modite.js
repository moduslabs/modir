// fetches the location data for a given location string
const getGeocode = async (location) => {
  const address = encodeURI(location);
  const request = new Request(`https://nominatim.openstreetmap.org/search?q=${address}&format=json`);
  request.headers.set('Referer', 'https://dir.modus.app');
  const geocodeResp = await fetch(request);
  const geocoded = await geocodeResp.json();

  if (!geocoded || !geocoded.length) {
    return false;
  } else {
    const [sorted] = geocoded.sort((a, b) => b.importance - a.importance);
    sorted.lat = parseFloat(sorted.lat);
    sorted.lon = parseFloat(sorted.lon);
    return sorted;
  }
}

// gets the location data for a given modite either from the KV store or from the geocode service
const addLocationPoint = async (modite, slackId) => {
  const { Location: location } = modite.profile.fields;

  if (!location) return; // if the user hasn't populated a location no lookup can be performed

  const locations = await MODITES.get('locations', 'json') || {};
  const moditeLocationObj = locations[slackId];

  // if there is no saved location object or
  // if the location changed since it was last saved to KV fetch it once more else use what was stored
  const geocode = (!moditeLocationObj || location !== moditeLocationObj.location) ? await getGeocode(location) : moditeLocationObj.geocode;
  const locationData = { location, geocode };

  locations[slackId] = locationData;
  await MODITES.put('locations', JSON.stringify(locations));  // cache the location data
  modite.profile.fields.locationData = locationData;
}

// adds key / value from label / value data in the Modite profile
const addFields = (moditeResp) => {
  const { fields = {} } = moditeResp.profile;

  moditeResp.profile.fields = Object.values(fields).reduce((map, item) => {
    map[item.label] = item.value;
    return map;
  }, {});
};

const getModite = async (slackId) => {
  // seems like our cache has expired. Let's fetch the slack user
  const userKey = await KEYS.get('mosquito-user-key');
  const userRes = await fetch(`https://slack.com/api/users.profile.get?token=${userKey}&user=${slackId}&include_labels=true`, {
    cf: { cacheTtlByStatus: { '200-299': 300, 404: 1, '500-599': 0 } },
  });
  const user = await userRes.json();

  addFields(user);
  await addLocationPoint(user, slackId);


  return user;
};

const getModiteResponse = async event => {
  let cache = caches.default;
  let response = await cache.match(event.request);

  if (!response) {
    const { url } = event.request;
    const slackId = url.split('/').pop();
    const moditeResp = await getModite(slackId);
    response = new Response(JSON.stringify(moditeResp));
    response.headers.set('Content-Type', 'application/json');
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Cache-Control', 'max-age=300');
    event.waitUntil(cache.put(event.request, response.clone()));
  }

  return response;
};

addEventListener('fetch', event => {
  event.respondWith(getModiteResponse(event));
});
