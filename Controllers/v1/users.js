// v1/users.js
module.exports = {
  router: (fastify, opts, done) => {
    fastify.io.on('connection', socket => {
      socket.on('message', data => console.log(data));
      socket.on('disconnect', data => console.log(`Disconected: ${data}`));
    });
    fastify.get('/', async (request, reply) => {
      return { hello: "User !!!" };
    });
    done();
  },
  events: () => undefined
}