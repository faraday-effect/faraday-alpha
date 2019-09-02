import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { Topic, TopicCreateInput } from "./Topic";
import { Offering } from "../../catalog/entities";

@Entity()
@ObjectType()
export class Unit extends AbstractEntity {
  @Column()
  @Field()
  title: string;

  @Column("text")
  @Field()
  description: string;

  @OneToMany(type => Topic, topic => topic.unit)
  @Field(type => [Topic])
  topics: Topic[];

  @ManyToOne(type => Offering, offering => offering.units, { nullable: false })
  @Field(type => Offering)
  offering: Offering;
}

@InputType()
export class UnitCreateInput {
  @Field() title: string;
  @Field() description: string;

  @Field(type => [TopicCreateInput], { nullable: true })
  topics: TopicCreateInput[];
}
