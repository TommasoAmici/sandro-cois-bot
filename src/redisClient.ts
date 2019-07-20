import * as redis from 'redis';

import { promisify } from 'util';

const client = redis.createClient(); // cast

client.on('error', err => {
    console.error('Error ' + err);
});

export const getAsync = promisify(client.get).bind(client);
export const saddAsync = promisify(client.sadd).bind(client);
export const scanAsync = promisify(client.scan).bind(client);
export const hmgetAsync = promisify(client.hmget).bind(client);
export const hincrbyAsync = promisify(client.hincrby).bind(client);
export const srandmemberAsync = promisify(client.srandmember).bind(client);
export const sscanAsync = promisify(client.sscan).bind(client);
export const sremAsync = promisify(client.srem).bind(client);

export default client;
