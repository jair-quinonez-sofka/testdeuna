

import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { createClient } from 'redis';
import { RedisClientType } from 'redis';


const mockRedisClient = {
  connect: jest.fn(),
  on: jest.fn(),
  setEx: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
} as unknown as RedisClientType;

jest.mock('redis', () => ({
  createClient: jest.fn(() => mockRedisClient),
}));

describe('CacheService', () => {
  let service: CacheService;
  let redisClient: RedisClientType;

  beforeEach(async () => {
    jest.clearAllMocks(); 

    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheService],
    }).compile();

    service = module.get<CacheService>(CacheService);
    redisClient = (service as any).redisClient; 

    
    expect(redisClient.connect).toHaveBeenCalled();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setData', () => {
    it('should call setEx with correct parameters', async () => {
      const key = 'testKey';
      const value = { data: 'testData' };
      const ttl = 60;

      await service.setData(key, value, ttl);

      expect(redisClient.setEx).toHaveBeenCalledWith(key, ttl, JSON.stringify(value));
    });

    it('should use default TTL if not provided', async () => {
      const key = 'testKey';
      const value = { data: 'testData' };
      const defaultTTL = 300;

      await service.setData(key, value);

      expect(redisClient.setEx).toHaveBeenCalledWith(key, defaultTTL, JSON.stringify(value));
    });
  });

  describe('getData', () => {
    it('should return parsed data when data exists in Redis', async () => {
      const key = 'testKey';
      const expectedData = { data: 'testData' };
      (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(expectedData));

      const result = await service.getData(key);

      expect(redisClient.get).toHaveBeenCalledWith(key);
      expect(result).toEqual(expectedData);
    });

    it('should return null when data does not exist in Redis', async () => {
      const key = 'testKey';
      (redisClient.get as jest.Mock).mockResolvedValue(null);

      const result = await service.getData(key);

      expect(redisClient.get).toHaveBeenCalledWith(key);
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should call del with the correct key', async () => {
      const key = 'testKey';

      await service.delete(key);

      expect(redisClient.del).toHaveBeenCalledWith(key);
    });
  });

  describe('Redis Client Events', () => {
    it('should handle the "error" event', () => {
      expect(redisClient.on).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('should handle the "ready" event', () => {
      expect(redisClient.on).toHaveBeenCalledWith('ready', expect.any(Function));
    });
  });
});