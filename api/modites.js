const cacheActiveusers = async () => {
  // TODO: cache the modite profiles including location data
  // modites.forEach((modite, i) => {
  //   setTimeout(() => {
  //     fetch(`https://modus.app/modite/${modite.id}`);
  //   }, i * 2 + 2);
  // });
}

const addTacosToUsers = async users => {
  // fetch the tacos using the Referer header approved by HeyTaco developers
  const currentDate = new Date().getDate()
  const request = new Request(`https://www.heytaco.chat/api/v1.1/json/leaderboard/T025W8CSY?days=${currentDate}`)
  request.headers.set('Referer', 'https://dir.modus.app')
  const tacosRes = await fetch(request)

  // create a map of tacos by user id
  const { leaderboard = [] } = await tacosRes.json()
  const leaderboardMap = leaderboard.reduce((map, { received_by_id, count }) => {
    map[received_by_id] = count
    return map
  }, {})

  // map the tacos from the leaderboard to the list of users from Slack
  users.forEach(item => {
    item.tacos = ~~leaderboardMap[item.id] || 0
  })

  return users
}

const appendModiteProfiles = async modites => {
  const list = await modites.get('activeModitesList', 'json')

  // for (const modite of modites) {
  //   const profileObj = await MODITES.get(modite.id, 'json');
  //   if (profileObj) {
  //     modite.profile = profileObj.profile;
  //   }
  // }

  const profileFetches = modites.map(modite => {
    return new Promise(async resolve => {
      const profileObj = await modites.get(modite.id, 'json')
      if (profileObj) {
        modite.profile = profileObj.profile
      }
      resolve()
    })
  })

  await Promise.all(profileFetches)
}

const getModites = async () => {
  // seems like our cache has expired. Let's fetch slack users
  const botKey = await KEYS.get('mosquito-bot-key')
  const usersRes = await fetch(`https://slack.com/api/users.list?token=${botKey}`, {
    cf: { cacheTtlByStatus: { '200-299': 86400, 404: 1, '500-599': 0 } },
  })
  const users = await usersRes.json()

  // only ussers who are not bots, not restricted (usually clients) and not deleted
  const activeUsers = users.members.filter(
    user => user.name !== 'slackbot' && !user.is_bot && !user.is_restricted && !user.deleted,
  )
  const activeModitesList = activeUsers.map(item => item.id)
  await MODITES.put('activeModitesList', JSON.stringify(activeModitesList))

  await addTacosToUsers(activeUsers)
  await appendModiteProfiles(activeUsers)
  await cacheActiveusers(activeUsers)

  return activeUsers
}

const checkToken = async req => {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '')
  const tokenInfo = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`).then(res => res.json())

  return tokenInfo.hd === 'moduscreate.com'
}

const getModitesResponse = async event => {
  const isAllowed = await checkToken(event.request)
  if (!isAllowed) {
    return new Response('', { status: 403, statusText: 'Forbidden' })
  }

  let cache = caches.default
  let response = await cache.match(event.request)

  if (!response) {
    const modites = await getModites()
    const fullResp = {
      modites,
    }
    response = new Response(JSON.stringify(fullResp))
    response.headers.set('Content-Type', 'application/json')
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Cache-Control', 'max-age=3600')
    event.waitUntil(cache.put(event.request, response.clone()))
  }

  return response
}

addEventListener('fetch', event => {
  event.respondWith(getModitesResponse(event))
})
