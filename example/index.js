const NodeSwift = require('./../index');
const fs = require('fs');

function printObj(obj) {
  console.log(JSON.stringify(obj))
}

function printErr(obj) {
  console.error(JSON.stringify(obj))
}

async function example() {
  const client = new NodeSwift({
    host: "127.0.0.1",
    port: 12345
  });
  
  /**
   * Login
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
   */
  await client.getContainers().then((d) => {
    printObj(d);
  }).catch((e) => {
    printErr(e);
  })

  /**
   * Create a new Container
   */
  await client.newContainer('test').then((d) => {
    printObj(d);
  }).catch((e) => {
    printErr(e);
  })

  /**
   * Create a new Container
   * for option items ref: https://docs.openstack.org/swift/latest/overview_acl.html#container-acls
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
   */
  await client.delContainer('test1').then((d) => {
    printObj(d);
  }).catch((e) => {
    printErr(e);
  })

  /**
   * Create a new Object
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
   * Create a new Object
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
   */
  await client.getObjects('test').then((d) => {
    printObj(d);
  }).catch((e) => {
    printErr(e);
  })

  /**
   * Delete a Object
   */
  await client.delObject('test', 'object1').then((d) => {
    printObj(d);
  }).catch((e) => {
    printErr(e);
  })

  /**
   * Get object list
   */
  await client.getObjects('test').then((d) => {
    printObj(d);
  }).catch((e) => {
    printErr(e);
  })

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
   * copy a Object to a new path
   */
  await client.copyObject('test', 'object2', 'test1', 'object1').then((d) => {
    printObj(d);
  }).catch((e) => {
    printErr(e);
  })
}

example();