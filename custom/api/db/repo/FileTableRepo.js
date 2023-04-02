const Path = require('path');
const Url = require('url');
const Http = require('http');
const Https = require('https');
const FS = require('fs');
const MagicBytes = require('magic-bytes.js');
const Crypto = require('crypto');

const BaseTableRepo = require('./BaseTableRepo');
const DBFieldError = require('../error/DBFieldError');

/**
 * @service (table.repo.file.default)
 * @arg (@service.time)
 * @tag (table.repo.file)
 */
module.exports = class FileTableRepo extends BaseTableRepo {

  /**
   * @param {import('../service/TimeService')} time 
   */
  constructor(time) {
    super();
    this.time = time;
    this.root = Path.join(__dirname, '../../../..');
  }

  /**
   * @param {string} action
   * @param {Object} data 
   * @param {import('./BaseTableRepo').T_TableRepoInfo} info 
   */
  async hookPreprocess(action, data, info) {
    if (action === 'save') {
      if (data.id && !data.path) {
        const fileinfo = await info.result.transaction.select()
          .from(info.result.info('schema.table').table)
          .where('id', '=', data.id);
        
        if (fileinfo && fileinfo.length && fileinfo[0].path) {
          data.path = fileinfo[0].path;
        }
      }
      switch (data.media_type) {
        case 'image':
        case 'file':
          if (!data.path && data.extern) {
            const filename = data.name.toLowerCase().trim().replace(/([^0-9a-z])/, '-').replace(/(-+)/, '-');
            data.path = Path.join(data.media_type, filename);
          }
          
          if (data.path && data.extern) {
            const root = Path.join(this.root, 'static/uploads');
            if (!FS.existsSync(Path.join(root, data.path))) {
              const dir = Path.join(root, data.media_type);
            
              if (!FS.existsSync(dir)) FS.mkdirSync(dir);
    
              const download = await this.download(data.extern, root, data.path);
    
              data.path = download.to;
              info.result.notify({type: 'success', title: 'Download file', message: 'Successful ' + data.path});
            }
          }
          break;
        case 'video':
          if (!data.path && data.extern) {
            const yt = this.getYoutubeID(data.extern);

            if (yt) {
              data.path = 'youtube/' + yt;
            }
          }
          if (!data.path) {
            throw new DBFieldError('No valid driver found for this video. Please validate the external path.', 'No driver found', 'extern');
          }
          if (data.extern) {
            const yt = this.getYoutubeID(data.extern);

            if (yt) {
              const hash = Crypto.createHash('md5').update(data.extern).digest("hex");
              const info = JSON.parse(data.info || '{}');

              if (!info.youtube || info.youtube.hash !== hash) {
                info.youtube = info.youtube || {};
                info.youtube.hash = hash;
                info.youtube.original = await this.getJSON('https://www.googleapis.com/youtube/v3/videos?id=' + yt + '&part=contentDetails&key=AIzaSyC2oT9mp0f_qH8LRvn0nMoe7n-4hghdkVo');
                if (info.youtube.original.items && info.youtube.original.items[0] && info.youtube.original.items[0].contentDetails && info.youtube.original.items[0].contentDetails.duration) {
                  info.youtube.processed = {
                    duration: this.time.getSeconds(info.youtube.original.items[0].contentDetails.duration),
                  };
                }
              }
              data.info = JSON.stringify(info);
            }
          }
          if (data.start) {
            const start = this.time.getSeconds(data.start);
            if (this.time.getSeconds(data.start) === null) {
              throw new DBFieldError('Not valid time format. Allowed formats are "2h30m45s", "2:30:45", "253" for field "Video: Starttime"', 'No valid time format', 'start');
            }
            const info = JSON.parse(data.info || '{}');

            info.processed = info.processed || {};
            info.processed.start = start;
            data.info = JSON.stringify(info);
          }
          if (data.end) {
            const end = this.time.getSeconds(data.end);
            if (end === null) {
              throw new DBFieldError('Not valid time format. Allowed formats are "2h30m45s", "2:30:45", "253" for field "Video: Endtime"', 'No valid time format', 'end');
            }
            const info = JSON.parse(data.info || '{}');

            info.processed = info.processed || {};
            info.processed.end = end;
            data.info = JSON.stringify(info);
          }
          break;
      }
    }

    if (action === 'delete') {
      if (data.media_type === undefined) {
        const media_result = await info.result.transaction.select(['media_type', 'path'])
          .from(info.result.info('schema.table').table)
          .where('id', '=', data.id);
        
        if (media_result && media_result.length) {
          data.media_type = media_result[0].media_type;
          data.path = media_result[0].path;
        }
      }
      if (['image', 'file'].includes(data.media_type)) {
        const file = Path.join(this.root, 'static/uploads', data.path);

        if (FS.existsSync(file)) {
          FS.unlinkSync(file);
          info.result.notify({type: 'success', title: 'Remove file', message: 'Successful ' + data.path});
        }
      }
    }
  }

  getJSON(url) {
    const API = url.startsWith('https') ? Https : Http;

    return new Promise((res) => {
      let stream = '';
      API.get(url, (response) => {
        response.on('data', (buffer) => {
          console.log(buffer + '');
          stream += buffer;
        });

        response.on('end', () => {
          res(JSON.parse(stream));
        });
      });
    });
  }

  download(from, root, to) {
    const OpenStream = (from, callback) => {
      if (from.startsWith('file:')) {
        callback(FS.createReadStream(Url.fileURLToPath(from)));
      } else {
        const API = from.startsWith('https') ? Https : Http;
        API.get(from, (stream) => {
          callback(stream);
        });
      }
    };

    return new Promise((res) => {
      let stream = null;
      let ext = null;
      OpenStream(from, (response) => {
        response.on('data', (buffer) => {
          if (stream === null) {
            const extension = MagicBytes.filetypeextension(buffer);

            if (extension.length) {
              ext = extension.shift();
            }

            if (ext === null && Path.extname(to).length === 0) {
              to += Path.extname(from);
            } else if (Path.extname(to).substring(1) !== ext) {
              to += '.' + ext;
            }

            stream = FS.createWriteStream(Path.join(root, to));
          }
          stream.write(buffer);
        });

        response.on('end', () => {
          res({ stream, ext, to });
        });
      });
    });
  }

  getYoutubeID(url) {
    const match = url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);

    if (match && match[2].length == 11) return match[2];
    return null;
  }

}