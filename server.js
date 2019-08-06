'use strict';

// Core requirement
const fastify = require('fastify')({ logger: true });
const helmet = require('fastify-helmet')

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

// Routing
fastify.register(User.router, { prefix: '/v1/user', io });
fastify.register(Install.router, { prefix: '/v1/install', io });

fastify.get('/', async (request, reply) => {
  // console.log(request);
  return { hello: 'world' };
});

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