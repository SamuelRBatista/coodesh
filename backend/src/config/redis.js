import Redis from 'ioredis';

const host = process.env.REDIS_HOST || '127.0.0.1';
const port = process.env.REDIS_PORT || '6379';

const redis = new Redis(`redis://${host}:${port}`);

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.warn('Redis error', err.message));

export default redis;
