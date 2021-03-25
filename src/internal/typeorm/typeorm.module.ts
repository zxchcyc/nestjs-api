import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongoService } from './mongo.service';
import { MysqlService } from './mysql.service';

@Module({
  imports: [
    // TypeOrmModule.forRootAsync({
    //   name: 'mysql',
    //   useClass: MysqlService,
    // }),
    TypeOrmModule.forRootAsync({
      name: 'mongo',
      useClass: MongoService,
    }),
  ],
})
export class MyTypeOrmModule {}
