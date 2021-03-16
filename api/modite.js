// TEST: https://modus.app/modite/U0AUTJZUL
// fetches the location data for a given location string
const getGeocode = async location => {
  const address = encodeURI(location)
  const request = new Request(`https://nominatim.openstreetmap.org/search?q=${address}&format=json`)
  request.headers.set('Referer', 'https://dir.modus.app')
  const geocodeResp = await fetch(request)
  const geocoded = await geocodeResp.json()

  if (!geocoded || !geocoded.length) {
    return false
  } else {
    const [sorted] = geocoded.sort((a, b) => b.importance - a.importance)
    sorted.lat = parseFloat(sorted.lat)
    sorted.lon = parseFloat(sorted.lon)
    return sorted
  }
}

// gets the location data for a given modite from the geocode service
const addLocationPoint = async modite => {
  const { Location: location } = modite.profile.fields

  if (!location) return // if the user hasn't populated a location no lookup can be performed

  const geocode = await getGeocode(location)

  modite.profile.fields.locationData = geocode
}

// adds key / value from label / value data in the Modite profile
const addFields = moditeResp => {
  let { fields = {} } = moditeResp.profile
  fields = fields || {}

  moditeResp.profile.fields = Object.values(fields).reduce((map, item) => {
    map[item.label] = item.value
    return map
  }, {})
}

const getModite = async slackId => {
  try {
    // seems like our cache has expired. Let's fetch the slack user
    const userKey = await KEYS.get('mosquito-bot-key-awakened')
    const moditeRes = await fetch(`https://slack.com/api/users.profile.get?user=${slackId}&include_labels=true`, {
      cf: { cacheTtlByStatus: { '200-299': 300, 404: 1, '500-599': 0 } },
      headers: {
        Authorization: `Bearer ${userKey}`,
      },
    })
    const modite = await moditeRes.json()

    addFields(modite)
    await addLocationPoint(modite, slackId)

    return modite
  } catch (e) {
    console.log('error', e)
    return new Response('', { status: 404, statusText: e })
  }
}

const checkToken = async req => {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '')

  const tokenInfo = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`).then(res => res.json())

  return tokenInfo.hd === 'moduscreate.com'
}

const getModiteResponse = async event => {
  const isAllowed = await checkToken(event.request)
  if (!isAllowed) {
    return new Response('', { status: 403, statusText: 'Forbidden' })
  }

  let cache = caches.default
  let response = await cache.match(event.request)

  if (!response) {
    const { url } = event.request
    const slackId = url.split('/').pop()
    const moditeResp = await getModite(slackId)
    response = new Response(JSON.stringify(moditeResp))
    response.headers.set('Content-Type', 'application/json')
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Cache-Control', 'max-age=300')
    event.waitUntil(cache.put(event.request, response.clone()))
  }

  return response
}

addEventListener('fetch', event => {
  event.respondWith(getModiteResponse(event))
})
