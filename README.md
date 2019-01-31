# swift-nodeclient
The promise support client for openstack with nodejs

# How to use it.
[example](/example/index.js)

# API
```js
  const client = new NodeSwift({
    host: "127.0.0.1", // the location of swift server, if not assign port ,will only use host option.
    port: 12345, // the port of swift server
    authUrl: '' // the auth url .default /auth/v1.0
  });
  
  /**
   * Login
   * 
   * @param {String|required} account  
   * @param {String|required} user     
   * @param {String|required} password 
   * 
   * @return {Promise} success 
   *    {
   *      status: 'ok',
   *      msg: null
   *    }
   * @return {Promise} failed 
   *    {
   *      status: 'ng',
   *      msg: {...}
   *    }
   */
  await client.login({
    account: 'test',
    user:'tester',
    password:'testing'
  }).then((d) => {
    printObj(d);
  }).catch((e) => {
    printErr(e);
  })
  
  /**
   * Get Container list
   * 
   * @return {Promise} success 
   *    {
   *      "status": "ok",
   *      "msg": {
   *        "bytesUsed": "545636",
   *        "containerCount": "2",
   *        "objectCount": "2",
   *        "data": [
   *          "test",
   *          "test1"
   *        ]
   *      }
   *    }
   * @return {Promise} failed 
   *    {
   *      status: 'ng',
   *      msg: {...}
   *    }
   */
  await client.getContainers().then((d) => {
    printObj(d);
  }).catch((e) => {
    printErr(e);
  })

  /**
   * Create a new Container
   * 
   * @param {String|required} container 
   * 
   * @return {Promise} success 
   *    {
   *      status: 'ok',
   *      msg: null
   *    }
   * @return {Promise} failed 
   *    {
   *      status: 'ng',
   *      msg: {...}
   *    }
   */
  await client.newContainer('test').then((d) => {
    printObj(d);
  }).catch((e) => {
    printErr(e);
  })

  /**
   * Create a new Container
   * for option items ref: https://docs.openstack.org/swift/latest/overview_acl.html#container-acls
   * 
   * @param {String|required} container
   * @param {Object|option} { headers: {'X-Container-Read': '.r:* | .r:<referrer>' } }
   * 
   * @return {Promise} success 
   *    {
   *      status: 'ok',
   *      msg: null
   *    }
   * @return {Promise} failed 
   *    {
   *      status: 'ng',
   *      msg: {...}
   *    }
   */
  await client.newContainer('test1', {
    headers: {
      'X-Container-Read': '.r:*'
    }
  }).then((d) => {
    printObj(d);
  }).catch((e) => {
    printErr(e);
  })

  /**
   * Delete a Container
   * 
   * @param {String|required} container
   * 
   * @return {Promise} success 
   *    {
   *      status: 'ok',
   *      msg: null
   *    }
   * @return {Promise} failed 
   *    {
   *      status: 'ng',
   *      msg: {...}
   *    }
   */
  await client.delContainer('test1').then((d) => {
    printObj(d);
  }).catch((e) => {
    printErr(e);
  })

  /**
   * Create a text Object
   * 
   * @param {String|required} container
   * @param {String|required} object
   * @param {String|Stream|required} data
   * @param {Object|option} { headers: {'Content-Type': 'text/html' } }
   * 
   * @return {Promise} success 
   *    {
   *      status: 'ok',
   *      msg: null
   *    }
   * @return {Promise} failed 
   *    {
   *      status: 'ng',
   *      msg: {...}
   *    }
   */
  await client.newObject('test', 'object1', 'hello world', {
    headers: {
      'Content-Type': 'text/html'
    }
  }).then((d) => {
    printObj(d);
  }).catch((e) => {
    printErr(e);
  })

  const stream = fs.createReadStream('./example/WechatIMG127.jpeg');
  /**
   * Create a text Object
   * 
   * @param {String|required} container
   * @param {String|required} object
   * @param {String|Stream|required} data
   * @param {Object|option} { headers: {'Content-Type': 'image/jpeg' } }
   * 
   * @return {Promise} success 
   *    {
   *      status: 'ok',
   *      msg: null
   *    }
   * @return {Promise} failed 
   *    {
   *      status: 'ng',
   *      msg: {...}
   *    }
   */
  await client.newObject('test', 'object2', stream, {
    headers: {
      'Content-Type': 'image/jpeg'
    }
  }).then((d) => {
    printObj(d);
  }).catch((e) => {
    printErr(e);
  })

  /**
   * Update a Object
   * 
   * @param {String|required} container
   * @param {String|required} object
   * @param {String|Stream|required} data
   * @param {Object|option} { headers: {'Content-Type': 'image/jpeg' } }
   * 
   * @return {Promise} success 
   *    {
   *      status: 'ok',
   *      msg: null
   *    }
   * @return {Promise} failed 
   *    {
   *      status: 'ng',
   *      msg: {...}
   *    }
   */
  await client.updateObject('test', 'object1', 'hello world two', {
    headers: {
      'Content-Type': 'text/html'
    }
  }).then((d) => {
    printObj(d);
  }).catch((e) => {
    printErr(e);
  })

  /**
   * Get object list
   * 
   * @param {String|required} container
   * 
   * @return {Promise} success 
   *    {
   *      "status": "ok",
   *      "msg": {
   *        "bytesUsed": "545636",
   *        "objectCount": "2",
   *        "data": [
   *          "test",
   *          "test1"
   *        ]
   *      }
   *    }
   * @return {Promise} failed 
   *    {
   *      status: 'ng',
   *      msg: {...}
   *    }
   */
  await client.getObjects('test').then((d) => {
    printObj(d);
  }).catch((e) => {
    printErr(e);
  })

  /**
   * Delete a Object
   * 
   * @param {String|required} container
   * @param {String|required} object
   * 
   * @return {Promise} success 
   *    {
   *      "status": "ok",
   *      "msg": null
   *    }
   * @return {Promise} failed 
   *    {
   *      status: 'ng',
   *      msg: {...}
   *    }
   */
  await client.delObject('test', 'object1').then((d) => {
    printObj(d);
  }).catch((e) => {
    printErr(e);
  })

  /**
   * copy a Object to a new path
   * 
   * @param {String|required} fromContainer
   * @param {String|required} fromobject
   * @param {String|required} toContainer
   * @param {String|required} toObject
   * 
   * @return {Promise} success 
   *    {
   *      "status": "ok",
   *      "msg": null
   *    }
   * @return {Promise} failed 
   *    {
   *      status: 'ng',
   *      msg: {...}
   *    }
   */
  await client.copyObject('test', 'object2', 'test1', 'object1').then((d) => {
    printObj(d);
  }).catch((e) => {
    printErr(e);
  })
```