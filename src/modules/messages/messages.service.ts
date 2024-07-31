import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateMessageDto } from './dtos/create-message.dto'
import { UpdateMessageDto } from './dtos/update-message.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Message } from './message.entity'
import { Repository } from 'typeorm'

@Injectable()
export class MessagesService {
	constructor(@InjectRepository(Message) private readonly userRepository: Repository<Message>) {}

	async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
		const newMessage = await new this.messageModel(createMessageDto)
		const data = await newMessage.save()

		return data
	}

	async updateMessage(messageId: string, updateMessageDto: UpdateMessageDto): Promise<Message> {
		const existingMessage = await this.messageModel.findByIdAndUpdate(messageId, updateMessageDto, { new: true })
		if (!existingMessage) {
			throw new NotFoundException(`Message #${messageId} not found`)
		}

		return existingMessage
	}

	async getAllMessages(): Promise<Message[] | []> {
		const messageData = await this.messageModel.find()
		if (!messageData || messageData.length == 0) {
			throw new NotFoundException('Messages data not found!')
		}

		return messageData
	}

	async getMessage(messageId: string): Promise<Message> {
		const existingMessage = await this.messageModel.findById(messageId).exec()
		if (!existingMessage) {
			throw new NotFoundException(`Message #${messageId} not found`)
		}

		return existingMessage
	}

	async deleteMessage(messageId: string): Promise<Message> {
		const deletedMessage = await this.messageModel.findByIdAndDelete(messageId)
		if (!deletedMessage) {
			throw new NotFoundException(`Message #${messageId} not found`)
		}

		return deletedMessage
	}

	async searchMessages(text: string): Promise<Message[] | []> {
		const results = await this.messageSearchService.search(text)
		const ids = results.map((result) => result.message_id)
		if (!ids.length) {
			return []
		}

		return await this.messageModel.find().where('_id').in(ids)
	}
}
