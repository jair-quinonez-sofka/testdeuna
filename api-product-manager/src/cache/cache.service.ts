import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class CacheService {
    private readonly redisClient;
    constructor() {
        this.redisClient = createClient({
            url: 'redis://redis:6379',
        });

        this.redisClient.on('error', (err) => {
            console.log('Redis Client Error', err);
        });
        this.redisClient.connect();

        this.redisClient.on('ready', () => {
            console.log('Redis Client Ready');
        });
    }


    async setData(key: string, value: any, ttl: number = 300) {
        await this.redisClient.setEx(key, ttl, JSON.stringify(value));
    }

    async getData(key: string): Promise<any> {
        const data = await this.redisClient.get(key);
        return data ? JSON.parse(data) : null;
    }


    async delete(key: string): Promise<void> {
        await this.redisClient.del(key);
    }
}
