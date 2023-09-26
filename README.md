# Cypress e2e and API testing Advanced

Please create a file named `cypress.config.json` in the root folder and fill it with:

```js
{
  "user_name": "USER_NAME",
  "user_password": "USER_PASSWORD",
  "gitlab_access_token": "GILAB_ACCESS_TOKEN"
}
```

# Install dependencies

`yarn`

# Running the specific test headless

`yarn cy:spec path-to-file` 

# Running the Cypress GUI

`yarn cy:open`