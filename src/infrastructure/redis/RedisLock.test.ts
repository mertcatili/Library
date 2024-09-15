import { RedisLock } from './RedisLock';
import { Redis } from 'ioredis';
import RedisMock from 'ioredis-mock';

describe('RedisLock', () => {
    let redisLock: RedisLock;
    let redisMock: Redis;

    beforeEach(() => {
        redisMock = new RedisMock() as unknown as Redis;
        redisLock = new RedisLock(redisMock);
    });

    it('should acquire a lock successfully', async () => {
        const result = await redisLock.acquire('testKey', 10000);
        expect(result).toBe(true);
    });

    it('should fail to acquire a lock when already locked', async () => {
        await redisLock.acquire('testKey', 1000);
        const result = await redisLock.acquire('testKey', 10000);
        expect(result).toBe(false);
    });

    it('should release a lock successfully', async () => {
        await redisLock.acquire('testKey', 1000);
        await redisLock.release('testKey');
        const result = await redisLock.acquire('testKey', 10000);
        expect(result).toBe(true);
    });
});