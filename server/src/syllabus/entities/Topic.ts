import {Field, InputType, ObjectType} from "type-graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { Unit } from "./Unit";

@Entity()
@ObjectType()
export class Topic extends AbstractEntity {
  @Column()
  @Field()
  title: string;

  @Column("text")
  @Field()
  description: string;

  @ManyToOne(type => Unit, unit => unit.topics)
  @Field(type => Unit)
  unit: Unit;
}

@InputType()
export class TopicCreateInput {
  @Field() title: string;
  @Field() description: string;
}