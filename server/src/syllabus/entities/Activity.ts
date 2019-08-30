import { Field, InputType, ObjectType, Int } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";

@Entity()
@ObjectType()
export class Activity extends AbstractEntity {
  @Column("int")
  @Field(type => Int, { defaultValue: -1 })
  sequence: number;

  @Column("text")
  @Field()
  description: string;

  @Column("int")
  @Field()
  duration: number;
}

@InputType()
export class ActivityCreateInput {}
