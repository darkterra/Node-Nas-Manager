'use strict';

const util = require('util');
// const exec = util.promisify(require('child_process').exec);
const { exec } = require('shelljs');

// v1/install.js
module.exports = {
  router: (fastify, opts, done) => {
    fastify.io.on('connection', socket => {
      socket.on('message', data => console.log(data));
      socket.on('disconnect', data => console.log(`Disconected: ${data}`));
    });

    // TODO: Change this by a post and get data from body
    fastify.get('/moutedDevices/:fileSys', async (request, reply) => {
      let response = null;

      try {
        const { stdout, stderr } = await exec('df -h');
        if (stderr) {
          response = stderr;
        }
        else {
          let data = stdout.split('\n');
          
          if (data.length > 0) {
            console.log(data.shift());
            
            data = data.filter(element => element !== '').map(element => element.split(' ').filter(element => element !== ''));

            data = data.map(element => {
              const [fileSys, total, use, free, percentUse, mount] = element;
  
              return { fileSys, total, use, free, percentUse, mount };
            });
          }
          
          if (request.params.fileSys) {
            data = data.filter(element => element.fileSys === request.params.fileSys);
          }
  
          console.log('data:', data);
          console.log('stderr:', stderr);
          
          response = data;
        }
      }
      catch (e) {
        console.error(`There is an error: ${e}`);
        throw e;
      }
      finally {
        return { response };
      }
    });

    fastify.get('/blkid', async (request, reply) => {
      let response = null;

      try {
        const { stdout, stderr } = await exec('blkid');
        let data = stdout.replace(/"/g, '').split('\n');

        if (data.length > 0) {
          data = data.filter(element => element.includes('UUID=') && element !== '').map(element => {
            const [FILESYS, REST] = element.split(':');

            const temp = REST.split(' ').filter(element => element !== '');
            const { LABEL, UUID, TYPE, PARTUUID } = Object.fromEntries(temp.map(el => el.split('=')));
            
            return { FILESYS, LABEL, UUID, TYPE, PARTUUID };
          }).filter(element => element.LABEL !== 'boot' || element.LABEL !== 'rootfs');
        }
        
        console.log('data:', data);
        console.log('stderr:', stderr);
        
        response = data || stderr;
      }
      catch (e) {
        console.error(`There is an error: ${e}`);
        throw e;
      }
      finally {
        return { response };
      }
    });
    
    fastify.get('/RAID1', async (request, reply) => {
      let response = null;

      try {
        const { stdout, stderr } = await exec('echo yes | sudo mdadm --create --verbose /dev/md0 --level=mirror --raid-devices=2 /dev/sda1 /dev/sdb1');
        // console.log('stdout:', stdout);
        // console.log('stderr:', stderr);

        response = stdout || stderr;
      }
      catch (e) {
        console.error(`There is an error: ${e}`);
        response = e;
        throw e;
      }
      finally {
        return { response };
      }
    });
    
    fastify.get('/progress', async (request, reply) => {
      let response = null;

      try {
        const { stdout, stderr } = await exec('cat /proc/mdstat');
        // console.log('stdout:', stdout);
        // console.log('stderr:', stderr);

        response = stdout || stderr;
      }
      catch (e) {
        console.error(`There is an error: ${e}`);
        response = e;
        throw e;
      }
      finally {
        return { response };
      }
    });
    
    fastify.get('/saveConf', async (request, reply) => {
      let response = null;

      try {
        console.log('exec: "sudo cp /etc/mdadm/mdadm.conf /etc/mdadm/mdadm.conf.backup"');
        let { stdout, stderr } = await exec('sudo cp /etc/mdadm/mdadm.conf /etc/mdadm/mdadm.conf.backup');
        // console.log('stdout:', stdout);
        // console.log('stderr:', stderr);

        console.log('exec: "mdadm --detail --scan >> /etc/mdadm/mdadm.conf"');
        let { stdout2, stderr2 } = await exec('sudo -i | mdadm --detail --scan >> /etc/mdadm/mdadm.conf');
        // console.log('stdout:', stdout);
        // console.log('stderr:', stderr);

        response = stdout || stderr || stdout2 || stderr2;
      }
      catch (e) {
        console.error(`There is an error: ${e}`);
        response = e;
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
        // console.log('stdout:', stdout);
        // console.log('stderr:', stderr);

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