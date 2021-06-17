const platformClient = require('purecloud-platform-client-v2');
const Axios = require('axios').default;

// Emeabilling
// const env = 'mypurecloud.ie';
// const clientId = '1b2d2962-f4fa-4b74-a0bb-5ba225371192';
// const clientSecret = 'aY5froP__ofufRJOrDR0IQj7ATES7EIeSHySJROV7M0';

// TestDriveTest
const env = 'mypurecloud.ie';
const clientId = 'fc4a4216-497c-4b02-8307-a86f3319f3a5';
const clientSecret = 'cA2xaWimH5tAcVvOwAA10hDCKCbEoHxFsnOmbjg5IV4';


const urlPath = `https://api.${env}/platform`;

// Node.js - Client credentials strategy
let client = platformClient.ApiClient.instance;

client.setEnvironment(env);
client
  .loginClientCredentialsGrant(clientId, clientSecret)
  .then(async function () {
    console.log('Service is connected to Genesys Cloud!');
    console.log('accessToken: ', client.authData.accessToken);

    // your query to Genesys Cloud API
    //await query();
    //await scim_getUsers('agent-uk@emeabilling.com');
    //await scim_updateUserId();
    await getProcessAutomationTriggers(client.authData.accessToken);
    // await putProcessAutomationTrigger(
    //   client.authData.accessToken,
    //   '7c33c4e7-6809-43e7-a836-15859a8db57b'
    // );
    // await deleteProcessAutomationTrigger(
    //   client.authData.accessToken,
    //   'd9e190ac-bdf0-498e-b8af-3db95f5a93bf'
    // );
    await postProcessAutomationTrigger(client.authData.accessToken);

    //console.log('DONE!');
  })
  .catch(function (err) {
    console.error(err);
  });

async function query() {
  let apiInstance = new platformClient.UsersApi();

  let opts = {
    pageSize: 25, // Number | Page size
    pageNumber: 1, // Number | Page number
    state: 'active', // String | Only list users of this state
  };

  apiInstance
    .getUsers(opts)
    .then((data) => {
      console.log(`getUsers success! data: ${JSON.stringify(data, null, 2)}`);
    })
    .catch((err) => {
      console.log('There was a failure calling getUsers');
      console.error(err);
    });
}

async function scim_getUsers(_userName) {
  let apiInstance = new platformClient.SCIMApi();

  let filter = `userName eq ${_userName}`; // String | Filters results.

  let opts = {
    startIndex: 1, // Number | The 1-based index of the first query result.
    count: 25, // Number | The requested number of items per page. A value of 0 returns \"totalResults\". A page size over 25 may exceed internal resource limits and return a 429 error. For a page size over 25, use the \"excludedAttributes\" or \"attributes\" query parameters to exclude or only include secondary lookup values such as \"externalId\",  \"roles\", \"urn:ietf:params:scim:schemas:extension:genesys:purecloud:2.0:User:routingLanguages\", or \"urn:ietf:params:scim:schemas:extension:genesys:purecloud:2.0:User:routingSkills\".
    //   attributes: ['attributes_example'], // [String] | Indicates which attributes to include. Returns these attributes and the \"id\", \"userName\", \"active\", and \"meta\" attributes. Use \"attributes\" to avoid expensive secondary calls for the default attributes.
    //   excludedAttributes: ['excludedAttributes_example'], // [String] | Indicates which attributes to exclude. Returns the default attributes minus \"excludedAttributes\". Always returns the \"id\", \"userName\", \"active\", and \"meta\" attributes. Use \"excludedAttributes\" to avoid expensive secondary calls for the default attributes.
  };

  apiInstance
    .getScimUsers(filter, opts)
    .then((data) => {
      console.log(
        `getScimUsers success! data: ${JSON.stringify(data, null, 2)}`
      );
    })
    .catch((err) => {
      console.log('There was a failure calling getScimUsers');
      console.error(err);
    });
}

async function scim_updateUserId() {
  let apiInstance = new platformClient.SCIMApi();

  let body = {
    //active: _active,
    displayName: 'Agent UK - 2',
    // 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User': {
    //   division: _division,
    // },
    'urn:ietf:params:scim:schemas:extension:genesys:purecloud:2.0:User': {
      routingSkills: [
        {
          name: 'AI Technology',
          proficiency: 5,
        },
      ],
    },
  };

  console.log(body);

  apiInstance
    .putScimUser('c1a955cf-2b52-4d23-a04e-d00a30c0ac5a', body)
    .then((data) => {
      console.log(JSON.stringify(data));
    })
    .catch((err) => {
      console.log('there was a failure calling putScimUser');
      console.log(err);
    });
}

//#region Process Automation

async function getProcessAutomationTriggers(_token) {
  return new Promise(async (resolve, reject) => {
    try {
      return await Axios({
        url: `${urlPath}/api/v2/processautomation/triggers/`,
        method: 'GET',
        headers: {
          Host: `api.${env}`,
          Authorization: `Bearer ${_token}`,
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        console.log(response.data);
        resolve();
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

async function postProcessAutomationTrigger(_token) {
  return new Promise(async (resolve, reject) => {
    try {
      let body = {
        topicName: 'v2.organization.conversations',
        name: 'Process Automation external interaction disconnected',
        target: {
          type: 'Workflow',
          id: 'a1b20775-405b-4040-b421-c43adafbc722',
        },
        matchCriteria: [
          {
            "jsonPath": "participants[?(@.purpose == 'external' && @.endTime)]",
            "operator": "NotEqual",
            "value": "[]"
          }, {
            "jsonPath": "participants[?(@.attributes['Disconnect Processing Completed'] == true)]",
            "operator": "Equal",
            "value": "[]" 
          }                  
        ],        
      };
      return await Axios({
        url: `${urlPath}/api/v2/processautomation/triggers`,
        method: 'POST',
        headers: {
          Host: `api.${env}`,
          Authorization: `Bearer ${_token}`,
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(body),
      }).then((response) => {
        console.log(response.data);
        resolve();
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

async function putProcessAutomationTrigger(_token, _id) {
  console.log('putProcessAutomationTrigger()');
  return new Promise(async (resolve, reject) => {
    try {
      let body = {
        topicName: 'v2.organization.conversations',
        name: 'Process Automation interaction disconnected',
        target: {
          type: 'Workflow',
          id: 'a1b20775-405b-4040-b421-c43adafbc722',
        },
        matchCriteria: [
          {
            "jsonPath": "participants[?(@.purpose == 'customer' && @.endTime)]",
            "operator": "NotEqual",
            "value": "[]"
          }, {
            "jsonPath": "participants[?(@.attributes['Disconnect Processing Completed'] == true)]",
            "operator": "Equal",
            "value": "[]" 
          }                  
        ],
        version: 7
      };
      return await Axios({
        url: `${urlPath}/api/v2/processautomation/triggers/${_id}`,
        method: 'PUT',
        headers: {
          Host: `api.${env}`,
          Authorization: `Bearer ${_token}`,
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(body),
      }).then((response) => {
        console.log(response.data);
        resolve();
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

async function deleteProcessAutomationTrigger(_token, _triggerId) {
  return new Promise(async (resolve, reject) => {
    try {
      return await Axios({
        url: `${urlPath}/api/v2/processautomation/triggers/${_triggerId}`,
        method: 'DELETE',
        headers: {
          Host: `api.${env}`,
          Authorization: `Bearer ${_token}`,
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        console.log(response.data);
        resolve();
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

//#endregion
