import { Module } from '@nestjs/common';
import { TitleService } from './title.service';
import { TitleController } from './controller/web/v1/title.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Title, titleSchema } from './schemas/title.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: Title.name,
          schema: titleSchema,
        },
      ],
      'default',
    ),
  ],
  controllers: [TitleController],
  providers: [TitleService],
  exports: [TitleService],
})
export class TitleModule {}
