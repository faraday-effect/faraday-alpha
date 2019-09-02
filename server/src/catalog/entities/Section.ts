import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { Term } from "../../calendar/entities";
import { Course } from "./Course";
import { Matches } from "class-validator";

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
  @Matches(/^[MTWRF]+$/)
  days: string;

  @Column()
  @Field({ description: "Daily start time (e.g., '09:00')" })
  startTime: string;

  @Column()
  @Field({ description: "Daily stop time (e.g., '09:50')" })
  stopTime: string;

  @ManyToOne(type => Term, term => term.sections, { nullable: false })
  @Field(type => Term)
  term: Term;

  @ManyToOne(type => Course, course => course.sections, { nullable: false })
  @Field(type => Course)
  course: Course;
}

@InputType()
export class SectionCreateInput {
  @Field() title: string;
  @Field() regNumber: string;
  @Field() days: string;
  @Field() startTime: string;
  @Field() stopTime: string;
  @Field(type => Int) termId: number;
  @Field(type => Int) courseId: number;
}
