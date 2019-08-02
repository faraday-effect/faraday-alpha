import { Field, InputType, Int, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
@ObjectType()
export class Calendar {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @CreateDateColumn()
  created: Date;

  @Field()
  @UpdateDateColumn()
  updated: Date;

  @Field()
  @Column()
  isFrozen: boolean = false;
}

@InputType()
export class CalendarUpdateInput {
  @Field(type => Int) id: number;
  @Field({ nullable: true }) name: string;
  @Field({ nullable: true }) isFrozen: boolean;
}
