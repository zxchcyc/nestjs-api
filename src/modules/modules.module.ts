import { Global, Module } from '@nestjs/common';
import { TitleModule } from './system/title/title.module';

@Global()
@Module({
  imports: [TitleModule],
  exports: [TitleModule],
})
export class ModulesModule {}
