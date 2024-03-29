// **** Token Implicit Grant (Browser) - UserLogin ****

//redirectUri = 'https://szlaskidaniel.github.io/pc-sendMail/index.html';
const redirectUri = window.location.href.split('?')[0];
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;

client.setPersistSettings(true);

let foo = unescape(getUrlVars()['foo']);

let myParams = {
  foo: foo,
};

// Set Environment (in case page reloaded)
client.setEnvironment('mypurecloud.ie');

// Create API instance
const usersApi = new platformClient.UsersApi();

// Authenticate & perform Action if URL Param is set to TRUE
client
  .loginImplicitGrant('1abe2ac3-f16b-4cbf-a2cd-a9515f56c50f', redirectUri, {
    state: JSON.stringify(myParams),
  })
  .then(() => {
    console.log('Logged-In');

    //retrieve URL params from state
    let myParams;
    try {
      console.log(client);
      myParams = JSON.parse(client.authData.state);
    } catch (error) {
      console.error(error);
    }

    if (myParams?.foo && myParams.foo !== 'undefined') {
      console.log(myParams.foo);
    }

    // Call your functions now (you're authenticated)
    getMe();
  })
  .catch((err) => {
    // Handle failure response
    console.log(err);
  });

// Sample action onClick
function getMe() {
  console.log('action()');
  return usersApi.getUsersMe({ expand: ['presence'] });
}

// help function
function getUrlVars() {
  var vars = [],
    hash;
  var hashes = window.location.href
    .slice(window.location.href.indexOf('?') + 1)
    .split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}
