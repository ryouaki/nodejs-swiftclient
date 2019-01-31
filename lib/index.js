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

    this.updateObject = this.newObject;
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
            msg: {
              statusCode: res.statusCode,
              statusMessage: res.statusMessage
            }
          }); 
        } else {
          reject({
            status: 'ng',
            msg: {
              statusCode: res.statusCode,
              statusMessage: res.statusMessage
            }
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
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getContainers() {
    return new Promise((resolve, reject) => {
      const request = http.request(this.storeUrl, {
        method: 'GET',
        headers: {
          'X-Storage-Token': this.token
        }
      }, (res) => {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          if (res.statusCode === 200 || res.statusCode === 204) {
            const bytesUsed = res.headers['x-account-bytes-used'];
            const containerCount= res.headers['x-account-container-count'];
            const objectCount = res.headers['x-account-object-count'];
            const data = rawData.split('\n');
            data.pop();
            resolve({
              status: 'ok',
              msg: {
                bytesUsed,
                containerCount,
                objectCount,
                data: data
              }
            }); 
          } else {
            reject({
              status: 'ng',
              msg: {
                statusCode: res.statusCode,
                statusMessage: res.statusMessage
              }
            });
          }
        });
      })
      request.on('error', (err) => {
        reject({
          status: 'ng',
          msg: err
        });
      });
      request.end();
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  newContainer(name, opts = {}) {
    return new Promise((resolve, reject) => {
      const request = http.request(`${this.storeUrl}/${name}`, {
        method: 'PUT',
        headers: {
          'X-Storage-Token': this.token,
          ...opts.headers
        }
      }, (res) => {
        if (res.statusCode === 201 || res.statusCode === 202) {
          resolve({
            status: 'ok',
            msg: null
          }); 
        } else {
          reject({
            status: 'ng',
            msg: {
              statusCode: res.statusCode,
              statusMessage: res.statusMessage
            }
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
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  delContainer(name) {
    return new Promise((resolve, reject) => {
      const request = http.request(`${this.storeUrl}/${name}`, {
        method: 'DELETE',
        headers: {
          'X-Storage-Token': this.token
        }
      }, (res) => {
        if (res.statusCode === 204) {
          resolve({
            status: 'ok',
            msg: null
          }); 
        } else {
          reject({
            status: 'ng',
            msg: {
              statusCode: res.statusCode,
              statusMessage: res.statusMessage
            }
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
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  getObjects(container) {
    return new Promise((resolve, reject) => {
      const request = http.request(`${this.storeUrl}/${container}`, {
        method: 'GET',
        headers: {
          'X-Storage-Token': this.token
        }
      }, (res) => {
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          if (res.statusCode === 200 || res.statusCode === 204) {
            const bytesUsed = res.headers['x-container-bytes-used'];
            const objectCount = res.headers['x-container-object-count'];
            const data = rawData.split('\n');
            data.pop();
            resolve({
              status: 'ok',
              msg: {
                bytesUsed,
                objectCount,
                data: data
              }
            }); 
          } else {
            reject({
              status: 'ng',
              msg: {
                statusCode: res.statusCode,
                statusMessage: res.statusMessage
              }
            });
          }
        });
      })
      request.on('error', (err) => {
        reject({
          status: 'ng',
          msg: err
        });
      });
      request.end();
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  newObject(container, name, data, opts = {}) {
    return new Promise((resolve, reject) => {
      if (!data) {
        reject({
          status: 'ng',
          msg: 'data is undefined'
        })
      }

      const request = http.request(`${this.storeUrl}/${container}/${name}`, {
        method: 'PUT',
        headers: {
          'X-Storage-Token': this.token,
          ...opts.headers
        }
      }, (res) => {
        if (res.statusCode === 201) {
          resolve({
            status: 'ok',
            msg: null
          }); 
        } else {
          reject({
            status: 'ng',
            msg: {
              statusCode: res.statusCode,
              statusMessage: res.statusMessage
            }
          });
        }
      });

      request.on('error', (err) => {
        reject({
          status: 'ng',
          msg: err
        });
      });

      if (Object.prototype.toString.call(data) === '[object Object]') {
        data.on('data', (chunk) => {
          request.write(chunk);
        });
        data.on('end', () => {
          request.end();
        });
      } else {
        request.write(data);
        request.end();
      }
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  delObject(container, name) {
    return new Promise((resolve, reject) => {
      const request = http.request(`${this.storeUrl}/${container}/${name}`, {
        method: 'DELETE',
        headers: {
          'X-Storage-Token': this.token
        }
      }, (res) => {
        if (res.statusCode === 204) {
          resolve({
            status: 'ok',
            msg: null
          }); 
        } else {
          reject({
            status: 'ng',
            msg: {
              statusCode: res.statusCode,
              statusMessage: res.statusMessage
            }
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
    }).catch((err) => {
      return Promise.reject(err);
    });
  }

  copyObject(fromContainer, fromObject, toContainer, toObject) {
    return new Promise((resolve, reject) => {
      const request = http.request(`${this.storeUrl}/${toContainer}/${toObject}`, {
        method: 'PUT',
        headers: {
          'X-Storage-Token': this.token,
          'X-Copy-From': `${fromContainer}/${fromObject}`
        }
      }, (res) => {
        if (res.statusCode === 201) {
          resolve({
            status: 'ok',
            msg: null
          }); 
        } else {
          reject({
            status: 'ng',
            msg: {
              statusCode: res.statusCode,
              statusMessage: res.statusMessage
            }
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
    }).catch((err) => {
      return Promise.reject(err);
    });
  } 
}