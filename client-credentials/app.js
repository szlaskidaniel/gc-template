const platformClient = require('purecloud-platform-client-v2');

const env = 'mypurecloud.ie';
const clientId = '<put here OAuth clientId>';
const clientSecret = '<put here OAuth clientSecret>';

// Node.js - Client credentials strategy
let client = platformClient.ApiClient.instance;

client.setEnvironment(env);
client
  .loginClientCredentialsGrant(clientId, clientSecret)
  .then(function () {
    console.log('Service is connected to Genesys Cloud!');
    console.log('accessToken: ', client.authData.accessToken);

    // your query to Genesys Cloud API
    // query();
  })
  .catch(function (err) {
    console.error(err);
  });

function query() {
  let apiInstance = new platformClient.RoutingApi();

  let opts = {
    pageSize: 25, // Number | Page size
    pageNumber: 1, // Number | Page number
  };

  apiInstance
    .getRoutingSkills(opts)
    .then((data) => {
      console.log(
        `getRoutingSkills success! data: ${JSON.stringify(data, null, 2)}`
      );
    })
    .catch((err) => {
      console.log('There was a failure calling getRoutingSkills');
      console.error(err);
    });
}
