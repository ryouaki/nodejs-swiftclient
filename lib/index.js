const http = require('http');

module.exports = class NodeSwift {
  constructor(opts) {
    const {
      host = '127.0.0.1',
      port = 12345,
      authUrl = '/auth/v1.0'
    } = opts || {};

    this.options = {
      host,
      port,
      authUrl
    }
  }

  login(opts) {
    return new Promise((resolve, reject) => {
      const {
        account,
        user,
        password
      } = opts || {};

      const url = this.options.port ? 
        `${this.options.host}:${this.options.port}` :
        `${this.options.host}`

      const request = http.request(`http://${url}${this.options.authUrl}`, {
        method: 'GET',
        headers: {
          'X-Auth-User': `${account}:${user}`,
          'X-Auth-Key': password
        }
      }, (res) => {
        if (res.statusCode === 200) {
          this.token = res.headers['x-storage-token'];
          this.storeUrl = res.headers['x-storage-url'];
          resolve({
            status: 'ok',
            msg: res
          }); 
        } else {
          reject({
            status: 'ng',
            msg: res
          });
        }
      })
      request.on('error', (err) => {
        reject({
          status: 'ng',
          msg: err
        });
      });
      request.end();
    });
  }
}