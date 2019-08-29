import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { Topic, TopicCreateInput } from "./Topic";

@Entity()
@ObjectType()
export class Unit extends AbstractEntity {
  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  description: string;

  @OneToMany(type => Topic, topic => topic.unit)
  @Field(type => [Topic])
  topics: Topic[];
}

@InputType()
export class UnitCreateInput {
  @Field() title: string;
  @Field() description: string;

  @Field(type => [TopicCreateInput], { nullable: true })
  topics: TopicCreateInput[];
}
