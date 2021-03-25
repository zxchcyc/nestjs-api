import { Module } from '@nestjs/common';
import {
  I18nModule,
  I18nJsonParser,
  QueryResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import { APP_CONFIG } from '../../common';

@Module({
  imports: [
    I18nModule.forRoot({
      // 语言包存放地址
      parserOptions: {
        path: APP_CONFIG.I18NPATH,
      },

      // 兜底语言包
      fallbackLanguage: APP_CONFIG.FALLBACKLANG,
      parser: I18nJsonParser,

      // 定义请求语言解析器
      resolvers: [
        // 由请求URL的参数中读取语言标志
        new QueryResolver(['lang']),
        // 在Cookie中读取语言标志，default: lang
        // new CookieResolver()
        // 在请求头中读取语言标志，default: accept-language
        // 用自定义的头即可
        // new HeaderResolver(['x-edc-lang']),
      ],
    }),
  ],
})
export class I18nOptionsModule {}
