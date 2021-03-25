import { Logger, Module, Global } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { EnvService } from '../env/env.service';
const logger: Logger = new Logger('redis.module');

@Global()
@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: (envService: EnvService) => {
        return {
          name: envService.get('REDIS_NAME'),
          host: envService.get('REDIS_HOST'),
          port: Number(envService.get('REDIS_PORT')),
          db: Number(envService.get('REDIS_DATABASE')),
          password: envService.get('REDIS_PASSWORD'),
          keyPrefix: envService.get('REDIS_KEYPREFIX'),
          // retryStrategy: (times) => 5000,
          reconnectOnError: (error: Error) => 1,
          onClientReady: async (client) => {
            client.on('close', (error) => {
              logger.error(error);
            });
            client.on('connect', (error) => {
              logger.log('Redis connect connected');
            });
            client.on('error', (error) => {
              logger.error(error);
            });
            client.on('end', () => {
              logger.error('Redis end');
            });
            client.on('ready', () => {
              logger.log('Redis ready connected');
            });
            client.on('reconnecting', () => {
              logger.log('Redis re-connecting');
              logger.log(envService.get('REDIS_NAME'));
              logger.log(envService.get('REDIS_HOST'));
              logger.log(Number(envService.get('REDIS_PORT')));
              logger.log(Number(envService.get('REDIS_DATABASE')));
              logger.log(envService.get('REDIS_PASSWORD'));
              logger.log(envService.get('REDIS_KEYPREFIX'));
            });
          },
        };
      },
      inject: [EnvService],
    }),
  ],
})
export class IoRedisModule {}
