const NodeSwift = require('../index');

const client = new NodeSwift({ 
  host: "127.0.0.1",
  port: 12345
})

beforeAll(async () => {
  await client.login({
    account: 'test',
    user:'tester',
    password:'testing'
  })
});

describe('NodeSwift Container operate', () => {
  it('NodeSwift create a new Container', async () => {
    try {
      const ret = await client.newContainer('test');
      expect(ret).toHaveProperty('status', 'ok');
    } catch(e) {
      expect(e).toHaveProperty('status', 'ng');
    }
  })

  it('NodeSwift create a new Container with readable', async () => {
    try {
      const ret = await client.newContainer('test1', {
        headers: {
          'X-Container-Read': '.r:*'
        }
      });
      expect(ret).toHaveProperty('status', 'ok');
    } catch(e) {
      expect(e).toHaveProperty('status', 'ng');
    }
  })

  it('NodeSwift get container list', async () => {
    try {
      const ret = await client.getContainers();
      expect(ret).toHaveProperty('status', 'ok');
    } catch(e) {
      expect(e).toHaveProperty('status', 'ng');
    }
  })

  it('NodeSwift delete a container', async () => {
    try {
      const ret = await client.delContainer('test');
      expect(ret).toHaveProperty('status', 'ok');
    } catch(e) {
      expect(e).toHaveProperty('status', 'ng');
    }
  })
})
