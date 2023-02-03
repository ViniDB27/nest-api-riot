import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  puuid: string;

  @Column()
  accountId: string;

  @Column()
  summonerId: string;

  @Column({ length: 500 })
  name: string;

  @Column('int')
  summonerLevel: number;

  @Column('int')
  pdl: number;

  @Column('int')
  winRate: number;

  @Column()
  region: string;
}
