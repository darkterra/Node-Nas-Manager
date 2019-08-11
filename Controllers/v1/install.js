'use strict';

// const util = require('util');
// const exec = util.promisify(require('child_process').exec);
const { mkdirSync } = require('fs');
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
      return await getBLKID();
    });
    
    fastify.get('/RAID1', async (request, reply) => {
      let response = null;

      try {
        const { stdout, stderr } = await exec('echo yes | sudo mdadm --create --verbose /dev/md0 --level=mirror --raid-devices=2 /dev/sda1 /dev/sdb1');
        // console.log('stdout:', stdout);
        // console.log('stderr:', stderr);

        response = stdout || stderr;

        requestProgressionRAID_UntilIsFinish();
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
        response = await getProgressionRAID();
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
        console.log('exec: "sudo cp /etc/mdadm/mdadm.conf /home/pi/mdadm.temp"');
        await exec('sudo cp /etc/mdadm/mdadm.conf /home/pi/mdadm.temp');

        console.log('exec: "sudo chown pi:pi /home/pi/mdadm.temp"');
        await exec('sudo chown pi:pi /home/pi/mdadm.temp');

        console.log('exec: "sudo mdadm --detail --scan >> /home/pi/mdadm.temp"');
        let { stdout2, stderr2 } = await exec('sudo mdadm --detail --scan >> /home/pi/mdadm.temp');

        console.log('exec: "sudo chown root:root /home/pi/mdadm.temp"');
        await exec('sudo chown root:root /home/pi/mdadm.temp');

        console.log('exec: "sudo mv /home/pi/mdadm.temp /etc/mdadm/mdadm.conf"');
        await exec('sudo mv /home/pi/mdadm.temp /etc/mdadm/mdadm.conf');
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
    
    fastify.get('/formatHDDs', async (request, reply) => {
      let response = null;

      try {
        console.log('exec: "echo y | sudo mkfs.vfat -F 32 /dev/sda1 && sudo mkfs.vfat -F 32 /dev/sdb1"');
        let { stdout, stderr } = await exec('echo y | sudo mkfs.vfat -F 32 /dev/sda1 && sudo mkfs.vfat -F 32 /dev/sdb1');

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
    
    fastify.get('/formatRAID1', async (request, reply) => {
      let response = null;

      try {
        console.log('exec: "echo y | sudo mkfs.ext4 -v -m .1 -b 4096 -E stride=32,stripe-width=64 /dev/md0"');
        let { stdout, stderr } = await exec('echo y | sudo mkfs.ext4 -v -m .1 -b 4096 -E stride=32,stripe-width=64 /dev/md0');

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
    
    fastify.get('/mountRAID1', async (request, reply) => {
      let response = null;
      
      try {
        console.log('Create the USBHDD folder');
        await exec('sudo mkdir /media/USBHDD');

        console.log('exec: "sudo mount /dev/md0 /media/USBHDD/"');
        let { stdout, stderr } = await exec('sudo mount /dev/md0 /media/USBHDD/');

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
    
    fastify.get('/umountRAID1', async (request, reply) => {
      let response = null;

      try {
        console.log('exec: "sudo umount /dev/md0"');
        let { stdout, stderr } = await exec('sudo umount /dev/md0');

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
    
    fastify.get('/confAutoMount', async (request, reply) => {
      let response = null;
      
      try {
        console.log('exec: "sudo cp /etc/fstab /etc/fstab.bak"');
        await exec('sudo cp /etc/fstab /etc/fstab.bak ');

        const { UUID } = await getUUID_RAID();
        if (UUID) {
          console.log('exec: "sudo chown pi:pi /etc/fstab"');
          await exec('sudo chown pi:pi /etc/fstab');

          console.log(`exec: "echo "UUID=${UUID} /mnt ext4 defaults 0 0" >> /etc/fstab"`);
          let { stdout, stderr } = await exec(`echo "UUID=${UUID} /mnt ext4 defaults 0 0" >> /etc/fstab`);

          console.log('exec: "sudo chown root:root /etc/fstab"');
          await exec('sudo chown root:root /etc/fstab');
          
          response = stdout || stderr;
        }
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


async function getBLKID () {
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
    return new Promise(resolve => resolve({ response }));
  }
}

async function getUUID_RAID () {
  let UUID = null;

  try {
    let { response: UUID } = await getBLKID();
    console.log('UUID: ', UUID);

    UUID = UUID.reduce((acc, current) => {
      if (current.FILESYS === '/dev/md0') {
        return current.UUID;
      }
    });
  }
  catch (e) {
    console.error(`There is an error: ${e}`);
    throw e;
  }
  finally {
    return { UUID };
  }
}

async function getProgressionRAID () {
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
    return response;
  }
}

function requestProgressionRAID_UntilIsFinish () {
  let syncFinish = false;
  let response = null;
  let idInterval = null;

  // if (!syncFinish) {
    idInterval = setInterval(() => {
      response = getProgressionRAID();
      console.log('Progess: ', response);
      
      if (response.includes('resync')) {
        // syncFinish = true;
        idInterval && clearInterval(idInterval);
      }
    }, 1000 * 60);
  // }
}