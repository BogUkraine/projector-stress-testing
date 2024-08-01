import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	// use fastify to compare
	const configService = app.get<ConfigService>(ConfigService)
	app.useGlobalPipes(new ValidationPipe())

	await app.listen(configService.get('PORT'))
}
bootstrap()
