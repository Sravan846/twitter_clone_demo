const pubConnection = async () => {
    const redis = require("redis");
    const publisher = redis.createClient();
    createClientServer = async () => {
      await publisher.connect();
      global.publisher = publisher;
      console.log("Pub redis connected");
    };
    createClientServer();
  };
  
  module.exports = pubConnection;
  