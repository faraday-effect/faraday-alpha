import { Field, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { Department, Prefix } from "../../org/entities";
import { Offering } from "./Offering";

@Entity()
@ObjectType()
export class Course extends AbstractEntity {
  @Column()
  @Field()
  number: string;

  @Column()
  @Field()
  title: string;

  @ManyToOne(type => Prefix, prefix => prefix.courses)
  @Field(type => Prefix)
  prefix: Prefix;

  @ManyToOne(type => Department, department => department.courses)
  @Field(type => Department)
  department: Department;

  @OneToMany(type => Offering, offering => offering.course)
  @Field(type => [Offering])
  offerings: Offering[];
}
