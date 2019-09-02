import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { Term } from "../../calendar/entities";
import { Course } from "./Course";

@Entity()
@ObjectType()
export class Section extends AbstractEntity {
  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  regNumber: string;

  @Column()
  @Field({ description: "Meeting days (e.g., 'MWF', 'TR')" })
  days: string;

  @Column()
  @Field({ description: "Daily start time (e.g., '09:00')" })
  startTime: string;

  @Column()
  @Field({ description: "Daily stop time (e.g., '09:50')" })
  stopTime: string;

  @ManyToOne(type => Term, term => term.sections)
  @Field(type => Term)
  term: Term;

  @ManyToOne(type => Course, course => course.sections)
  @Field(type => Course)
  course: Course;
}

@InputType()
export class SectionCreateInput {
  @Field() title: string;
  @Field() regNumber: string;
  @Field(type => Int) creditHours: number;
  @Field(type => Int) termId: number;
  @Field(type => Int) courseId: number;
}
