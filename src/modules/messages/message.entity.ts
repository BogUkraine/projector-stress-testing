import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Message {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: 'varchar', length: 255 })
	text: string
}