import * as redis from 'redis';

const client = redis.createClient();
client.on('error', err => {
    console.error('Error ' + err);
});

export default client;
