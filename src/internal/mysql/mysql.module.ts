import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MysqlService } from './mysql.service';

@Module({
  imports: [
    // 支持多库配置
    SequelizeModule.forRootAsync({
      name: 'default',
      useClass: MysqlService,
    }),
  ],
})
export class MysqlModule {}
