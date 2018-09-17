const ipfsAPI = require('ipfs-api');
const fs = require('fs');

const IPFS_LOCAL = 0;
const ipfsHostConfig = {
  node: IPFS_LOCAL ? 'localhost' : 'ipfs.infura.io',
  port: '5001',
  protocol: IPFS_LOCAL ? 'http' : 'https',
};

class IpfsService {
  constructor() {
    this.ipfs = ipfsAPI({host: ipfsHostConfig.node, port: ipfsHostConfig.port, protocol: ipfsHostConfig.protocol});
  }

  addData(data) {
    return new Promise((done, fail) => {
      this.ipfs.files.add(data)
      .then(files => {
        const file = files[0];
        return this.ipfs.pin.add(file.hash, {recursive: true});
      })
      .then((files) => {
        done(files[0].hash);
      })
      .catch(fail);
    });
  };

  readFile(ipfsHash) {
    return new Promise((done, fail) => {
      this.ipfs.files.cat(ipfsHash, (err, data) => {
        if (err) {
          console.log(err);
          fail(err);
        } else {
          done(data);
        }
      });
    });
  };

  async addFileToIpfs(filename, filePath) {
    try {
      const result = await this.addToIpfs(fs.readFileSync(filePath));
      await fs.unlinkSync(filePath);
      const url = result['hash'] ? `${ipfsHost}/${result['hash']}` : ``;
      return { filename, url, ...result };
    } catch (err) {
      await fs.unlinkSync(filePath);
      throw err;
    }
  }

  async addToIpfs(input) {
    function handler (p) {
      // window.postMessage(`progress: ${p}%`, '*');
      console.log(p);
    }
    try {
      const res = await this.ipfs.files.add(input, {progress: handler});
      const result = [];
      res.forEach(function (file) {
        if (file && file.hash) {
          result.push(file);
        }
      });
      return result.length ? result[0] : {};
    } catch (err) {
      throw err;
    }
  }
}

exports.default = new IpfsService();
