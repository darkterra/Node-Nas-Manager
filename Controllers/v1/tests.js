// v1/tests.js

const { join } = require('path');
const Datastore = require('nedb');
const moment = require('moment');

const db = {};
db.fileSystem = new Datastore({ filename: join(__dirname, '..', '..', '..', 'BDD', 'fileSystem.db'), autoload: true });

module.exports = {
  router: (fastify, opts, done) => {
    fastify.io.on('connection', socket => {
      socket.on('message', data => console.log(data));
      socket.on('disconnect', data => console.log(`Disconected: ${data}`));
    });

    // ! TEMP ROUTE
    fastify.get('/setAllData', async (request, reply) => {
      const tree_data = [
        { "id":"root", "type": "folder", "value": "NAS00", open:true, "data": [
          { "id": "1", "type": "folder", "value": "Films", "files": [
            {
              "Name": "The Shawshank Redemption.avi",
              "Type": "Multimedia",
              "Date": moment("2010-01-01T05:06:07").toString(),
              "Size": 5368729120
            },
            {
              "Name": "The Godfather.mkv",
              "Type": "Multimedia",
              "Date": moment("2018-11-21T09:46:00").toString(),
              "Size": 3221229472
            }
          ]},
          { "id": "2", "type": "folder", "value": "Series", "data": [
            { "id":"2.1", "type": "folder", "value": "Game Of Thrones", "data": [
              { "id":"2.1.1", "type": "folder", "value": "Saison 1", "files": [
                {
                  "Name": "S01E01.Winter Is Coming.mkv",
                  "Type": "Multimedia",
                  "Date": moment("2010-01-01T05:06:07").toString(),
                  "Size": 5368729120
                },
                {
                  "Name": "S01E02.The Kingsroad.mkv",
                  "Type": "Multimedia",
                  "Date": moment("2018-11-21T09:46:00").toString(),
                  "Size": 3221229472
                },
                {
                  "Name": "S01E03.Lord Snow.mkv",
                  "Type": "Multimedia",
                  "Date": moment("2018-11-21T09:46:00").toString(),
                  "Size": 3221229472
                },
                {
                  "Name": "S01E04.Cripples, Bastards, and Broken Things.mkv",
                  "Type": "Multimedia",
                  "Date": moment("2018-11-21T09:46:00").toString(),
                  "Size": 3221229472
                },
                {
                  "Name": "S01E05.The Wolf and the Lion.mkv",
                  "Type": "Multimedia",
                  "Date": moment("2018-11-21T09:46:00").toString(),
                  "Size": 3221229472
                },
                {
                  "Name": "S01E06.A Golden Crown.mkv",
                  "Type": "Multimedia",
                  "Date": moment("2018-11-21T09:46:00").toString(),
                  "Size": 3221229472
                },
                {
                  "Name": "S01E07.You Win or You Die.mkv",
                  "Type": "Multimedia",
                  "Date": moment("2018-11-21T09:46:00").toString(),
                  "Size": 3221229472
                },
                {
                  "Name": "S01E08.The Pointy End.mkv",
                  "Type": "Multimedia",
                  "Date": moment("2018-11-21T09:46:00").toString(),
                  "Size": 3221229472
                },
                {
                  "Name": "S01E09.Baelor.mkv",
                  "Type": "Multimedia",
                  "Date": moment("2018-11-21T09:46:00").toString(),
                  "Size": 3221229472
                },
                {
                  "Name": "S01E10.Fire and Blood.mkv",
                  "Type": "Multimedia",
                  "Date": moment("2018-11-21T09:46:00").toString(),
                  "Size": 3221229472
                }
              ]}
            ]}
          ]},
          { "id":"3", "type": "folder", "value": "Images", "files": [
            {
              "Name": "01 - Christmas.jpg",
              "Type": "Multimedia",
              "Date": moment("2015-03-12T12:02:15").toString(),
              "Size": 3145788
            },
            {
              "Name": "02 - moment's Eve.jpeg",
              "Type": "Multimedia",
              // "Date": moment("2013-08-24T19:01:55").toString(),
              "Date": new Date(1986, 2, 2),
              "Size": 7340132
            },
            {
              "Name": "03 - New Edge.png",
              "Type": "Multimedia",
              "Date": moment("2020-06-24T16:24:06").toString(),
              "Size": 41943060
            }
          ]},
          { "id":"4", "type": "folder", "value": "WorkSpace", "data": [
            {
              "files": [
                {
                  "Name": "server.js",
                  "Type": "Code",
                  "Date": moment("2019-08-14T16:15:41").toString(),
                  "Size": 345728
                },
                {
                  "Name": "index.html",
                  "Type": "Code",
                  "Date": moment("2019-08-14T16:16:55").toString(),
                  "Size": 40032
                },
                {
                  "Name": "mainTheme.css",
                  "Type": "Code",
                  "Date": moment("2019-08-14T16:16:55").toString(),
                  "Size": 56064
                },
                {
                  "Name": "FirstInstall.sh",
                  "Type": "Code",
                  "Date": moment("2019-08-14T15:28:32").toString(),
                  "Size": 91567
                }
              ]
            }
          ]}
        ]}
      ];

      db.fileSystem.insert(tree_data, err => {
        if (err) {
          throw err;
        }
        else {
          return { message: 'Data saved !'};
        }
      });
    });

    fastify.get('/tree_data', async (request, reply) => {
      const tree_data = [
        { "id": "1", "type": "folder", "value": "Music","data": [
          { "id": "m_0", "type": "folder", "value": "Jimi Hendrix", "data": [
            { "id": "m_0_1", "type": "file", "value": "1967 - Are You Experienced?" },
            { "id": "m_0_2", "type": "file", "value": "1967 - Axis: Bold As Love" }
          ]},
          { "id": "m_1", "type": "folder", "value": "Georgy Sviridov" }
        ]},
        { "id":"2", "type": "folder", "value":"Images", "data":[
          { "id": "p_0", "type": "folder", "value": "01 - Christmas" },
          { "id": "p_1", "type": "folder", "value": "02 - New Year's Eve" }
        ]}
      ];

      return tree_data;
    });
    
    fastify.get('/table_data', async (request, reply) => {
      const grid_data = [
        {
          "id": 1,
          "title": "The Shawshank Redemption",
          "year": 1994
        },
        {
          "id": 2,
          "title": "The Godfather",
          "year": 1972
        }
      ];

      return grid_data;
    });

    
    fastify.get('/all', async (request, reply) => {
      const all_data = [
        { "id":"root", "type": "folder", "value": "NAS00", open:true, "data": [
          { "id": "1", "type": "folder", "value": "Films", "files": [
            {
              "Name": "The Shawshank Redemption.avi",
              "Type": "Multimedia",
              "Date": moment("2010-01-01T05:06:07").toString(),
              "Size": 5368729120
            },
            {
              "Name": "The Godfather.mkv",
              "Type": "Multimedia",
              "Date": moment("2018-11-21T09:46:00").toString(),
              "Size": 3221229472
            }
          ]},
          { "id": "2", "type": "folder", "value": "Series", "data": [
            { "id":"2.1", "type": "folder", "value": "Game Of Thrones", "data": [
              { "id":"2.1.1", "type": "folder", "value": "Saison 1", "files": [
                {
                  "Name": "S01E01.Winter Is Coming.mkv",
                  "Type": "Multimedia",
                  "Date": moment("2010-01-01T05:06:07").toString(),
                  "Size": 5368729120
                },
                {
                  "Name": "S01E02.The Kingsroad.mkv",
                  "Type": "Multimedia",
                  "Date": moment("2018-11-21T09:46:00").toString(),
                  "Size": 3221229472
                },
                {
                  "Name": "S01E03.Lord Snow.mkv",
                  "Type": "Multimedia",
                  "Date": moment("2018-11-21T09:46:00").toString(),
                  "Size": 3221229472
                },
                {
                  "Name": "S01E04.Cripples, Bastards, and Broken Things.mkv",
                  "Type": "Multimedia",
                  "Date": moment("2018-11-21T09:46:00").toString(),
                  "Size": 3221229472
                },
                {
                  "Name": "S01E05.The Wolf and the Lion.mkv",
                  "Type": "Multimedia",
                  "Date": moment("2018-11-21T09:46:00").toString(),
                  "Size": 3221229472
                },
                {
                  "Name": "S01E06.A Golden Crown.mkv",
                  "Type": "Multimedia",
                  "Date": moment("2018-11-21T09:46:00").toString(),
                  "Size": 3221229472
                },
                {
                  "Name": "S01E07.You Win or You Die.mkv",
                  "Type": "Multimedia",
                  "Date": moment("2018-11-21T09:46:00").toString(),
                  "Size": 3221229472
                },
                {
                  "Name": "S01E08.The Pointy End.mkv",
                  "Type": "Multimedia",
                  "Date": moment("2018-11-21T09:46:00").toString(),
                  "Size": 3221229472
                },
                {
                  "Name": "S01E09.Baelor.mkv",
                  "Type": "Multimedia",
                  "Date": moment("2018-11-21T09:46:00").toString(),
                  "Size": 3221229472
                },
                {
                  "Name": "S01E10.Fire and Blood.mkv",
                  "Type": "Multimedia",
                  "Date": moment("2018-11-21T09:46:00").toString(),
                  "Size": 3221229472
                }
              ]}
            ]}
          ]},
          { "id":"3", "type": "folder", "value": "Images", "files": [
            {
              "Name": "01 - Christmas.jpg",
              "Type": "Multimedia",
              "Date": moment("2015-03-12T12:02:15").toString(),
              "Size": 3145788
            },
            {
              "Name": "02 - moment's Eve.jpeg",
              "Type": "Multimedia",
              // "Date": moment("2013-08-24T19:01:55").toString(),
              "Date": new Date(1986, 2, 2),
              "Size": 7340132
            },
            {
              "Name": "03 - New Edge.png",
              "Type": "Multimedia",
              "Date": moment("2020-06-24T16:24:06").toString(),
              "Size": 41943060
            }
          ]},
          { "id":"4", "type": "folder", "value": "WorkSpace", "data": [
            {
              "files": [
                {
                  "Name": "server.js",
                  "Type": "Code",
                  "Date": moment("2019-08-14T16:15:41").toString(),
                  "Size": 345728
                },
                {
                  "Name": "index.html",
                  "Type": "Code",
                  "Date": moment("2019-08-14T16:16:55").toString(),
                  "Size": 40032
                },
                {
                  "Name": "mainTheme.css",
                  "Type": "Code",
                  "Date": moment("2019-08-14T16:16:55").toString(),
                  "Size": 56064
                },
                {
                  "Name": "FirstInstall.sh",
                  "Type": "Code",
                  "Date": moment("2019-08-14T15:28:32").toString(),
                  "Size": 91567
                }
              ]
            }
          ]}
        ]}
      ];

      // return all_data;

      

      db.fileSystem.findOne({}, (err, doc) => {
        if (err) {
          throw err;
        }
        else {
          console.log('Doc: ', doc);
          return [doc];
        }
      });
      
    });
    done();
  },
  events: () => undefined
}