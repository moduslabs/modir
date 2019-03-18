const getModite = async (slackId) => {
  // seems like our cache has expired. Let's fetch the slack user
  const userRes = await fetch(`https://slack.com/api/users.profile.get?token=${process.env.USER_TOKEN}&user=${slackId}&include_labels=true`, {
    cf: { cacheTtlByStatus: { '200-299': 300, 404: 1, '500-599': 0 } },
  });
  const user = await userRes.json();

  return user;
};

// fetch the gitHubUser from the user profile API
const addGitHubUser = (modite) => {
  const { fields = {} } = modite.profile;
  const gitHubUser = Object.values(fields).find(item => item.label === "GitHub User") || {};
  modite.profile.gitHubUser = gitHubUser.value;
};

const getModiteResponse = async event => {
  let cache = caches.default;
  let response = await cache.match(event.request);

  if (!response) {
    const { url } = event.request;
    const slackId = url.split('/').pop();
    const modite = await getModite(slackId);
    addGitHubUser(modite);
    response = new Response(JSON.stringify(modite));
    response.headers.set('Content-Type', 'application/json');
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Cache-Control', 'max-age=3600');
    event.waitUntil(cache.put(event.request, response.clone()));
  }

  return response;
};

addEventListener('fetch', event => {
  event.respondWith(getModiteResponse(event));
});
