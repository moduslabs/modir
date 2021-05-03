const addTacosToUsers = async (users) => {
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
  users.forEach((item) => {
    item.tacos = ~~leaderboardMap[item.id] || 0
  })

  return users
}

const getModites = async (cursor = '') => {
  // seems like our cache has expired. Let's fetch slack users
  // eslint-disable-next-line no-undef
  const botKey = await KEYS.get('mosquito-bot-key-awakened')
  const usersRes = await fetch(`https://slack.com/api/users.list?cursor=${cursor}`, {
    cf: {
      cacheTtlByStatus: { '200-299': 86400, 404: 1, '500-599': 0 },
    },
    headers: {
      Authorization: `Bearer ${botKey}`,
    },
  })
  const users = await usersRes.json()

  const activeUsers = users.members.filter(
    (user) => user.name !== 'slackbot' && !user.is_bot && !user.is_restricted && !user.deleted,
  )

  let usersWithTacos = await addTacosToUsers(activeUsers)

  // We'll probably need to go to the next page
  if (users?.response_metadata?.next_cursor) {
    // recursively call the same function
    const nextUsers = await getModites(users.response_metadata.next_cursor)
    // merge users from this and the previous call
    const mergedUsers = nextUsers.concat(usersWithTacos)

    // re-associate with usersWithTacos so we get all the things
    usersWithTacos = mergedUsers
  }

  return usersWithTacos
}

const checkToken = async (req) => {
  const token = (req.headers.get('authorization') || '').replace('Bearer ', '')
  const tokenInfo = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`).then((res) => res.json())

  return tokenInfo.hd === 'moduscreate.com'
}

const getModitesResponse = async (event) => {
  const isAllowed = await checkToken(event.request)
  if (!isAllowed) {
    return new Response('', { status: 403, statusText: 'Forbidden' })
  }

  let cache = caches.default
  let response = await cache.match(event.request)

  if (!response) {
    const modites = await getModites()

    response = new Response(JSON.stringify(modites))
    response.headers.set('Content-Type', 'application/json')
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Request-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Request-Method', 'Content-Type, Authorization')
    response.headers.set('Cache-Control', 'max-age=3600')
    event.waitUntil(cache.put(event.request, response.clone()))
  }

  return response
}

addEventListener('fetch', (event) => {
  event.respondWith(getModitesResponse(event))
})
