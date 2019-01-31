const NodeSwift = require('../index');

const client = new NodeSwift({ 
  host: "127.0.0.1",
  port: 12345
})
describe('NodeSwift Login', () => {
  it('NodeSwift test Login: success', async () => {
    try {
      const ret = await client.login({
        account: 'test',
        user:'tester',
        password:'testing'
      })
      expect(ret).toHaveProperty('status', 'ok');
      expect(ret.msg.statusCode).toBe(200);
    } catch(e) {
      expect(e).toHaveProperty('status', 'ng');
    }
  })
  
  it('NodeSwift test Login: failed', async () => {
    try {
      const ret = await client.login({
        account: 'test',
        user:'tester',
        password:'testing1111'
      })
    } catch(e) {
      expect(e).toHaveProperty('status', 'ng');
      expect(e.msg.statusCode).toBe(401);
    }
  })  
})
