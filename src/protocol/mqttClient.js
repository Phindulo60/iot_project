import mqtt from 'mqtt';

const client = mqtt.connect('wss://a2fr1lhmxa6xyh-ats.iot.us-east-1.amazonaws.com/mqtt', {
  clientId: 'unique-client-id-' + Math.random().toString(36).substr(2, 9),
  username: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  password: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  protocol: 'wss',
});

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('reactTest/status', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to reactTest/status');
    }
  });
  client.subscribe('reactTest/vendEvents', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to reactTest/vendEvents');
    }
  });
  client.subscribe('reactTest/freeVend', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to reactTest/freeVend');
    }
  });
});

client.on('message', (topic, message) => {
  console.log(`Received message on ${topic}: ${message.toString()}`);
});

export const sendMessage = (topic, message) => {
  console.log(`Sending message to ${topic}: ${JSON.stringify(message)}`);
  client.publish(topic, JSON.stringify(message));
};

export default client;