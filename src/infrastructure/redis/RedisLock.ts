import { Redis } from 'ioredis';

export class RedisLock {
    constructor(private redisClient: Redis) {}

    async acquire(key: string, ttl: number): Promise<boolean> {
        const result = await this.redisClient.set(key, '1', 'EX', ttl, 'NX');
        return result === 'OK';
    }

    async release(key: string): Promise<void> {
        await this.redisClient.del(key);
    }
}