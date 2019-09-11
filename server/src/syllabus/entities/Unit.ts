import { Field, InputType, Int, ObjectType } from "type-graphql";
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

  @Column("int") offeringId: number;
  @ManyToOne(type => Offering, offering => offering.units, { nullable: false })
  @Field(type => Offering)
  offering: Offering;
}

@InputType()
export class UnitCreateInput {
  @Field(type => Int) offeringId: number;
  @Field() title: string;
  @Field() description: string;
}

@InputType()
export class UnitUpdateInput {
  @Field(type => Int) id: number;
  @Field() title: string;
  @Field() description: string;
}
