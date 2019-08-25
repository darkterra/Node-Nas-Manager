// v1/tests.js

const { join } = require('path');
const Datastore = require('nedb');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

const db = {};
db.fileSystem = new Datastore({ filename: join(__dirname, '..', '..', '..', 'BDD', 'fileSystem.db'), autoload: true });

module.exports = {
  router: (fastify, opts, done) => {
    fastify.io.on('connection', socket => {
      socket.on('message', data => console.log(data));
      socket.on('disconnect', data => console.log(`Disconected: ${data}`));
    });

    fastify.get('/generateFileSystem', async (request, reply) => {
      const fileSystem = { id: "root", type: "folder", value: "NAS00", open: true, files: [], data: [] };

      fileWalker('/media/USBHDD/NAS00', fileSystem, (err, data) => {
        if (err) {
          console.error(err);
        }

        console.log('final result: ', data);

        console.log('\nDetail Final Result:');
        console.log(JSON.stringify(data));
      });
      return { message: 'Data generated !', data };
    });
    // ! TEMP ROUTE
    fastify.get('/setAllData', async (request, reply) => {
      

      // db.fileSystem.insert(tree_data, err => {
      //   if (err) {
      //     throw err;
      //   }
      //   else {
      //     return { message: 'Data saved !'};
      //   }
      // });
    });
    
    fastify.get('/all', (request, reply) => {
      db.fileSystem.findOne({}, (err, doc) => {
        if (err) {
          throw err;
        }
        else {
          console.log('Doc: ', doc);
          reply.send([doc]);
        }
      });
      
    });
    done();
  },
  events: () => undefined
}


function fileWalker (dir, fileSystem, done) {
  let ids = 1;

  fs.readdir(dir, (err, list) => {
    if (err) {
      return done(err);
    }

    let pending = list.length;

    if (!pending) {
      return done(null, fileSystem);
    }

    list.forEach(file => {
      file = path.resolve(dir, file);

      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
      
          fileSystem.files.push({
            FolderId: ids.toString(),
            Name: path.basename(file),
            IconType: `<span class="mdi mdi-Folder"></span>`,
            Type: 'Folder',
            Date: moment(stat.birthtime).format('DD/MM/YYYY HH:mm'),
            Size: 0
          });

          fileSystem.data.push({
            id: ids.toString(),
            value: path.basename(file),
            type: 'Folder',
            files: [],
            data: []
          });

          ids++;

          fileWalker(file, fileSystem.data[fileSystem.data.length - 1], (err, res) => {
            console.log('res: ', res);

            // fileSystem.data.push(res);
            // fileSystem = { ...fileSystem, ...res };

            if (! --pending) {
              done(null, fileSystem);
            }
          });
        }
        else {
          const { type, iconType } = getTypeFile(file);

          fileSystem.files.push({
            id: ids.toString(),
            Name: path.basename(file),
            IconType: `<span class="mdi ${iconType}"></span>`,
            Type: type,
            Date: moment(stat.birthtime).format('DD/MM/YYYY HH:mm'),
            Size: stat.size
          });

          if (! --pending) {
            done(null, fileSystem);
          }
        }
      });
    });
  });
}
  
// Format Files Types
const defaultIcon = { iconType: 'mdi-file', type: 'Unknown' };
const typesFiles = [
  { type: 'MultiMedia', iconType: 'mdi-video', extensionFile: ['avi', 'mov', 'mkv', 'mp4', 'flv'] },
  { type: 'MultiMedia', iconType: 'mdi-file-image', extensionFile: ['jpg', 'jpeg', 'png', 'bmp', 'tif'] },
  { type: 'MultiMedia', iconType: 'mdi-file-music', extensionFile: ['mp3', 'wav', 'flac'] },
  { type: 'Document', iconType: 'mdi-file-pdf', extensionFile: ['pdf'] },
  { type: 'Document', iconType: 'mdi-file-excel', extensionFile: ['xls', 'xlsx'] },
  { type: 'Document', iconType: 'mdi-file-word', extensionFile: ['doc', 'docx'] },
  { type: 'Document', iconType: 'mdi-file-powerpoint', extensionFile: ['ppt', 'pptx'] },
  { type: 'Code', iconType: 'mdi-nodejs', extensionFile: ['js'] },
  { type: 'Code', iconType: 'mdi-language-html5', extensionFile: ['html', 'xhtml', 'htm'] },
  { type: 'Code', iconType: 'mdi-language-css3', extensionFile: ['css'] },
  { type: 'Code', iconType: 'mdi-visual-studio-code', extensionFile: ['sh', 'bash', 'php', 'ico', 'h', 'c', 'h++', 'cpp', 'java'] },
];

function getTypeFile (value) {
  // console.log('value: ', value);

  if (value.includes('.')) {
    [value] = value.split('.').slice(-1);
  }

  value = value.toLowerCase();
  
  return typesFiles.reduce((acc, current) => {
    if (current.extensionFile.includes(value)) {
      acc = { iconType: current.iconType, type: current.type };
    }
    return acc;
  }, defaultIcon);
}