import { Global, Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';

@Global()
@Module({
  providers: [CacheService],
  exports: [CacheService],
  imports: [NestCacheModule.registerAsync({
    useFactory: () => ({
      store: 'redis',
      host: 'redis',
      port: 6379,
      ttl: 300,
    }),
  })],
})
export class CacheModule { }
