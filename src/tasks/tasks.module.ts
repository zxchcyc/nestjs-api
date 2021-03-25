import { Global, Module } from '@nestjs/common';
import { DemoModule } from './demo/demo.module';

@Global()
@Module({
  imports: [DemoModule],
  exports: [DemoModule],
})
export class TasksModule {}
