const Path = require('path');
const Http = require('http');
const Https = require('https');
const FS = require('fs');

const MagicBytes = require('magic-bytes.js');

class DownloadTest {

  async execute() {
    const content = await this.download('https://images.unsplash.com/photo-1599946347371-68eb71b16afc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmVybGlufGVufDB8fDB8fA%3D%3D&w=1000&q=80');
    
  }

  download(from) {
    const API = from.startsWith('https') ? Https : Http;

    return new Promise((res) => {
      let data = '';
      let ext = null;
      API.get(from, (response) => {
        response.on('data', (buffer) => {
          if (ext === null) {
            const extension = MagicBytes.filetypeextension(buffer);

            if (extension.length) {
              ext = extension.shift();
            }
          }
          data += buffer;
        });

        response.on('end', () => {
          res({ data, ext });
        });
      });
    });
  }

}

const test = new DownloadTest();
test.execute();