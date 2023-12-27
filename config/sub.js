const subConnection = async () => {
    const redis = require("redis");
    const subscriber = redis.createClient();
    createClientServer = async () => {
      await subscriber.connect();
      global.subscriber = subscriber;
      console.log("Sub redis connected");
    };
    createClientServer();
    subscriber.subscribe("pChat", (data) => {
      const { event,  response } = JSON.parse(data);
      io.emit(event, response);
    });
  };
  module.exports = subConnection;
  