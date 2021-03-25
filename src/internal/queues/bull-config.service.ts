import { EnvService } from './../env/env.service';
import { Injectable } from '@nestjs/common';
import { BullModuleOptions, BullOptionsFactory } from '@nestjs/bull';

@Injectable()
export class BullConfigService implements BullOptionsFactory {
  constructor(
    private readonly envService: EnvService,
  ) {}

  createBullOptions(): Promise<BullModuleOptions> | BullModuleOptions {
    return {
      prefix: this.envService.get('REDIS_KEYPREFIX'),
      redis: {
        // name: envService.get('REDIS_NAME'),
        host: this.envService.get('REDIS_HOST'),
        port: Number(this.envService.get('REDIS_PORT')),
        db: Number(this.envService.get('REDIS_DATABASE')),
        password: this.envService.get('REDIS_PASSWORD'),
        // reconnectOnError: (error: Error) => 1,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
      },
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: true,
        // removeOnFail: true,
      },
      settings: {
        retryProcessDelay: 5000,
      },
    };
  } 
}
