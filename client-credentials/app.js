const platformClient = require('purecloud-platform-client-v2');
const Axios = require('axios').default;

// Emeabilling
const env = 'mypurecloud.ie';
const clientId = 'ccf5b0b3-805f-460b-b2e1-8be9c82b64cc';
const clientSecret = 'pmr8QBO_d_wF2ydm8Qr6ER6k7G1z6imTTwx7RSS6Ld4';

// TestDriveTest
// const env = 'mypurecloud.ie';
// const clientId = 'fc4a4216-497c-4b02-8307-a86f3319f3a5';
// const clientSecret = 'cA2xaWimH5tAcVvOwAA10hDCKCbEoHxFsnOmbjg5IV4';

// Kari Test
// const env = 'mypurecloud.ie';
// const clientId = 'ba59caae-307f-4d52-ad12-e02c225a5330';
// const clientSecret = '95TFrB9p94BiNgjYa9DQ1D8n2Qk3NKBGUt1L0hTpwk8';

const urlPath = `https://api.${env}/platform`;

// Node.js - Client credentials strategy
let client = platformClient.ApiClient.instance;

client.setEnvironment(env);
console.log('Attempt to login...');
client
  .loginClientCredentialsGrant(clientId, clientSecret)
  .then(async function () {
    console.log('Service is connected to Genesys Cloud!');
    console.log('accessToken: ', client.authData.accessToken);

    // your query to Genesys Cloud API

    //await patchConversation('123');
    //await startWorkFlow('b78b16ad-439f-4844-af89-42c7e7537df3');
    await getWorkflowExecution('zf2mn3rf2omll1pui24131arbs98b3uekrtuc0qlg0ndl42f06');

    //await query();
    //await scim_getUsers('daniel.szlaski@genesys.com');
    //await scim_updateUserId();
    //await getProcessAutomationTriggers(client.authData.accessToken);
    // await putProcessAutomationTrigger(
    //   client.authData.accessToken,
    //   '432f6623-2316-4d44-b28e-49085ea61db8'
    // );
    // await deleteProcessAutomationTrigger(
    //   client.authData.accessToken,
    //   '97886086-6268-4dfe-b1f7-0c1710d49a3f'
    // );
    //await postProcessAutomationTrigger(client.authData.accessToken);

    //console.log('DONE!');
  })
  .catch(function (err) {
    console.error('ERROR!');
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
      console.log(`getScimUsers success! data: ${JSON.stringify(data, null, 2)}`);
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
        console.log(JSON.stringify(response.data));
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
      // let body = {
      //   topicName: 'v2.organization.conversations.messages',
      //   name: 'Process Automation New Message - delete me',
      //   enabled: false,
      //   target: {
      //     type: 'Workflow',
      //     id: '9405b9e3-2399-4a6d-8915-5c3e59b13264',
      //   },
      //   matchCriteria: [
      //     {
      //       "jsonPath": "participants[?(@.type == 'sms')]",
      //       "operator": "NotEqual",
      //       "value": "[]"
      //     }
      //   ]
      // };

      let body = {
        topicName: 'v2.organization.conversations.messages',
        name: 'notificationTest',
        enabled: false,
        target: {
          type: 'Workflow',
          id: '06586d68-4879-402a-9200-e8c3b221cbce', // Recording Consent
        },
        matchCriteria: [
          {
            jsonPath: "participants[?(@.purpose == 'external' && @.state =='disconnected')]",
            operator: 'NotEqual',
            value: '[]',
          },
          {
            jsonPath: "participants[?(@.attributes['Disconnect Processing Completed'] == 'true')]",
            operator: 'Equal',
            value: '[]',
          },
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
        topicName: 'v2.organization.conversations.messages',
        name: 'Process Automation New Message',
        enabled: true,
        target: {
          type: 'Workflow',
          id: '9405b9e3-2399-4a6d-8915-5c3e59b13264',
        },
        matchCriteria: [
          {
            jsonPath: "participants[?(@.queue.id == '21cb5843-5a7e-4d36-a4b0-0268c5b2d242')]",
            operator: 'NotEqual',
            value: '[]',
          },
        ],
        version: 1,
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

async function patchConversation(conversationId) {
  let apiInstance = new platformClient.ConversationsApi();

  let body = {
    startTime: '',
    recordingState: 'PAUSED',
  };

  apiInstance
    .patchConversationsCall(conversationId, body)
    .then((data) => {
      console.log(`patchConversationsCall success! data: ${JSON.stringify(data, null, 2)}`);
    })
    .catch((err) => {
      console.log('There was a failure calling patchConversationsCall');
      console.error(err);
    });
}

async function startWorkFlow(id) {
  let apiInstance = new platformClient.ArchitectApi();

  const flowLaunchRequest = {
    flowId: id,
  };

  apiInstance
    .postFlowsExecutions(flowLaunchRequest)
    .then((data) => {
      console.log(`postFlowsExecutions success! data: ${JSON.stringify(data, null, 2)}`);
    })
    .catch((err) => {
      console.log('There was a failure calling postFlowsExecutions');
      console.error(err);
    });
}

async function getWorkflowExecution(id) {
  let apiInstance = new platformClient.ArchitectApi();

  apiInstance
    .getFlowsExecution(id)
    .then((data) => {
      console.log(`getFlowsExecution success! data: ${JSON.stringify(data, null, 2)}`);
    })
    .catch((err) => {
      console.log('There was a failure calling getFlowsExecution');
      console.error(err);
    });
}

//
