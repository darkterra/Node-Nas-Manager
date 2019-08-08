'use strict';

// Core requirement
const { join } = require('path');
const fastify = require('fastify')({ logger: true });
const helmet = require('fastify-helmet');
const statics = require('fastify-static');

// WS
const io = require('socket.io')(fastify.server);

// Controllers Requirement
const User = require('./Controllers/v1/users');
const Install = require('./Controllers/v1/install');

// Conf
const IP = '0.0.0.0';
const PORT = 3000;

// Fastify Core Middleware
fastify.register(helmet);

// Add all important data for all app
fastify.decorate('io', io);

// Static files général (View)
fastify.register(statics, {
  root: join(__dirname, 'View'),
  prefix: '/', // optional: default '/'
  decorateReply: false
});

// Static Files (Webix)
fastify.register(statics, {
  root: join(__dirname, 'node_modules', 'webix'),
  prefix: '/webix/', // optional: default '/'
});

// Routing
fastify.register(User.router, { prefix: '/v1/user', io });
fastify.register(Install.router, { prefix: '/v1/install', io });

fastify.addHook('onSend', function (req, reply, payload, next) {
  console.log(payload.filename)
  next()
});

// fastify.get('/', async (request, reply) => {
//   // console.log(request);
//   return { hello: 'world' };
// });

// io.on('connection', socket => {
//   socket.on('message', data => console.log(data));
//   socket.on('disconnect', data => console.log(`Disconected: ${data}`));
// });

// Run the server!
const start = async () => {
  try {
    await fastify.listen(PORT, IP);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  }
  catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();

// Just peace of sugar
fastify.ready(() => {
  console.log(fastify.printRoutes());
})