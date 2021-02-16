# gc-templates example App

This is example of 2 Genesys Cloud Applications.

- clientCredentials - uses server context (usefull when creates service type of applications)
- implicitGrant - used with User context (Agent UI)

## Setup

1. First create OAuth client in Genesys Cloud, one for implicitGrant, second for clientCredentials
   https://help.mypurecloud.com/articles/create-an-oauth-client/

### implicitGrant

Remember to add your localpath to Authorized redirect URIs.
If you run your local server and index.html is accessible with address
`https://localhost/implicitGrant/index.html` then put the same path in Authorized redirect URIs config section for your OAuth setup in Genesys Cloud.

Use newly created clientId in function `client.loginImplicitGrant` then start your local server and navigate to index.html page.

### clientCredentials

1. Use clientId / clientSecret by replacing string `<put your...>` in client-credentials/app.js file
2. Go to /client-credentials folder and run `npm install` to install all required libraries
3. Run example app `node app.js`
