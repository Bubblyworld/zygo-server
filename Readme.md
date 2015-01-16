# Zygo-Server

Zygo is the beginnings of a slim dual client/server rendering framework built around [JSPM](github.com/jspm/jspm-cli) and [React](github.com/facebook/react). This repo contains the server-side rendering and routing code. It is intended to be run as a server bootstrap for a JSPM app using zygo-client. 

## Installation
To install it in a JSPM project, run:
``` bash
$ jspm install github:bubblyworld/zygo
```

## Example Usage
For a more detailed description of the client API, see the [project wiki](github.com/Bubblyworld/zygo/wiki).
For a complete example, see [zygo-example](https://www.github.com/Bubblyworld/zygo-example).

``` javascript
import * as zygo from 'zygo';

//Set the initial state of the application.
zygo._setInitialState({
  myState: someValue,
  meOtherState: someOtherValue
});

//Set up the routes.
zygo._setRoutes({
  '/' : 'handlers/indexHandler',
  '/about' : 'handlers/aboutHandler',
  '/post/[:id]' : 'handlers/postHandler',

  '/protected' : ['handlers/auth', 'handlers/secretHandler']
});

//Link router with anchor tags
zygo._addLinkHandlers();

//Start the router at the index route
zygo.route('/');
```
