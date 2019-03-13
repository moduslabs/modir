function handleClientLoad(cb: Function) {
  // Loads the client library and the auth2 library together for efficiency.
  // Loading the auth2 library is optional here since `gapi.client.init` function will load
  // it if not already loaded. Loading it upfront can save one network request.
  gapi.load('client:auth2', () => {
    initClient(cb);
  });
}

function initClient(cb: Function) {
  // Initialize the client with API key and People API, and initialize OAuth with an
  // OAuth 2.0 client ID and scopes (space delimited string) to request access.
  gapi.client
    .init({
      discoveryDocs: ['https://people.googleapis.com/$discovery/rest?version=v1'],
      clientId: '398317159902-tq6ld761e6f8tut1m46l09nbrdld74q1.apps.googleusercontent.com',
      scope: 'profile',
      // @ts-ignore
      ux_mode: 'redirect',
    })
    .then(function() {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      // Handle the initial sign-in state.
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get(), cb);
    });
}

function updateSigninStatus(isSignedIn: boolean, cb?: Function) {
  // When signin status changes, this function is called.
  // If the signin status is changed to signedIn, we make an API call.
  if (isSignedIn) {
    makeApiCall();
    if (cb) cb();
  } else {
    signIn();
  }
}

function signIn() {
  // Ideally the button should only show up after gapi.client.init finishes, so that this
  // handler won't be called before OAuth is initialized.
  return gapi.auth2.getAuthInstance().signIn();
}

function signOut() {
  gapi.auth2.getAuthInstance().signOut();
}

// todo: move this to the app state
function makeApiCall() {
  // Make an API call to the People API, and print the user's given name.
  // @ts-ignore
  gapi.client.people.people
    .get({
      resourceName: 'people/me',
      'requestMask.includeField': 'person.names',
    })
    .then(
      function(response: any) {
        console.log('Hello, ' + response.result.names[0].givenName);
      },
      function(reason: any) {
        console.log('Error: ' + reason.result.error.message);
      },
    );
}

function initAuth(cb: Function) {
  const head = document.getElementsByTagName('head')[0];
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.onload = () => {
    handleClientLoad(cb);
  };
  script.src = 'https://apis.google.com/js/api.js';
  head.appendChild(script);
}

export default initAuth;
