'use strict';

const util = require('util');
const exec = util.promisify(require('child_process').exec);

// v1/install.js
module.exports = {
  router: (fastify, opts, done) => {
    fastify.io.on('connection', socket => {
      socket.on('message', data => console.log(data));
      socket.on('disconnect', data => console.log(`Disconected: ${data}`));
    });
    
    fastify.get('/RAID1', async (request, reply) => {
      let response = null;

      try {
        const { stdout, stderr } = await exec('sudo mdadm --create --verbose /dev/md0 --level=mirror --raid-devices=2 /dev/sda1 /dev/sdb1');
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);

        response = stdout || stderr;
      }
      catch (e) {
        console.error(`There is an error: ${e}`);
        throw e;
      }
      finally {
        return { response };
      }
    });

    fastify.get('/:command', async (request, reply) => {
      let response = null;

      try {
        // const { stdout, stderr } = await exec('mdadm --help');
        console.log(request.params);

        const { stdout, stderr } = await exec(request.params.command);
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);

        response = stdout || stderr;
      }
      catch (e) {
        console.error(`There is an error: ${e}`);
        throw e;
      }
      finally {
        return { response };
      }
    });
    done();
  },
  events: () => undefined
}