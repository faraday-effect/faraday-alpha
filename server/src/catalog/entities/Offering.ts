import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { Course } from "./Course";
import { Unit } from "../../syllabus/entities";
import { Term } from "../../calendar/entities";
import { Section } from "./Section";

@Entity()
@ObjectType()
export class Offering extends AbstractEntity {
  @Column()
  @Field()
  title: string;

  @Column("int")
  @Field(type => Int, { defaultValue: -1 })
  creditHours: number;

  @Column("int") courseId: number;
  @ManyToOne(type => Course, course => course.offerings, { nullable: false })
  @Field(type => Course)
  course: Course;

  @Column("int") termId: number;
  @ManyToOne(type => Term, term => term.offerings)
  @Field(type => Term)
  term: Term;

  @OneToMany(type => Unit, unit => unit.offering)
  @Field(type => [Unit])
  units: Unit[];

  @OneToMany(type => Section, section => section.offering)
  @Field(type => [Section])
  sections: Section[];
}
