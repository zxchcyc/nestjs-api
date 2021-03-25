import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';

@Injectable()
export class MongoService implements TypeOrmOptionsFactory {
  constructor(private readonly envService: EnvService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mongodb',
      host: this.envService.get('MONGODB_ENDPOINT'),
      username: this.envService.get('MONGODB_USERNAME'),
      password: this.envService.get('MONGODB_PASSWORD'),
      database: this.envService.get('MONGODB_DATABASE'),
      autoLoadEntities: true,
      synchronize: true,
      useUnifiedTopology: true,
    };
  }
}
