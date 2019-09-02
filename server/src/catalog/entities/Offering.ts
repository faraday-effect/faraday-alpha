import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { Course } from "./Course";
import { Unit } from "../../syllabus/entities";

@Entity()
@ObjectType()
export class Offering extends AbstractEntity {
  @Column()
  @Field()
  title: string;

  @Column("int")
  @Field(type => Int, { defaultValue: -1 })
  creditHours: number;

  @ManyToOne(type => Course, course => course.offerings, { nullable: false })
  @Field(type => Course)
  course: Course;

  @OneToMany(type => Unit, unit => unit.offering)
  @Field(type => [Unit])
  units: Unit[];
}
