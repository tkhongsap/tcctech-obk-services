import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import configuration, { validate } from './config/configuration';
import { ConfigService } from './config/config.service';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
      validationOptions: {
        alllowUnknown: false,
      },
    }),
    AccountModule,
  ],
  controllers: [AppController],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class AppModule {}
