const getModites = async () => {
  // seems like our cache has expired. Let's fetch slack users
  const usersRes = await fetch(`https://slack.com/api/users.list?token=${process.env.BOT_TOKEN}`, {
    cf: { cacheTtlByStatus: { '200-299': 86400, 404: 1, '500-599': 0 } },
  });
  const users = await usersRes.json();

  // only ussers who are not bots, not restricted (usually clients) and not deleted
  const activeUsers = users.members.filter(user => user.name !== 'slackbot' && !user.is_bot && !user.is_restricted && !user.deleted);

  return activeUsers;
};

const getModitesResponse = async event => {
  let cache = caches.default;
  let response = await cache.match(event.request);

  if (!response) {
    const modites = await getModites();
    response = new Response(JSON.stringify(modites));
    response.headers.set('Content-Type', 'application/json');
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Cache-Control', 'max-age=3600');
    event.waitUntil(cache.put(event.request, response.clone()));
  }

  return response;
};

addEventListener('fetch', event => {
  event.respondWith(getModitesResponse(event));
});
