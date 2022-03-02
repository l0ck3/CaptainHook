import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class Tracker {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  interval: number;

  @Column()
  trackedUrl: string;

  @Column({ type: 'jsonb', default: {} })
  trackedUrlHeaders: JSON;

  @Column({ nullable: true })
  latestResponseHash?: string;

  @Column()
  targetUrl: string;
}
