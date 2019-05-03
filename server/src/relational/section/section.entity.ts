// ----- SECTIONS -----

import { Field, Int, ObjectType, InputType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Term } from "../term/term.entity";
import { Course } from "../course/course.entity";

@Entity("sections")
@ObjectType()
export class Section {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({ type: "varchar", length: 64 })
  @Field()
  title: string;

  @Column({ type: "varchar", length: 64, nullable: true })
  @Field()
  regNumber?: string;

  @Column({ type: "integer" })
  @Field(() => Int)
  creditHours: number;

  @ManyToOne(() => Term, term => term.sections)
  @Field(() => Term)
  term: Term;

  @ManyToOne(() => Course, course => course.sections)
  @Field(() => Course)
  course: Course;
}

@InputType()
export class SectionCreateInput implements Partial<Section> {
  @Field()
  title: string;

  @Field()
  regNumber?: string;

  @Field(() => Int)
  creditHours: number;
}

export interface SectionWhereUniqueInput {
  id?: number;
}

export interface SectionWhereInput {
  id?: number;
  title?: string;
  regNumber?: string;
  creditHours?: number;
  term?: Term;
  course?: Course;
}

export interface SectionUpdateInput {
  id?: number;
  title?: string;
  regNumber?: string;
  creditHours?: number;
  term?: Term;
  course?: Course;
}

export enum SectionOrderByInput {
  idAsc,
  idDesc,
  titleAsc,
  titleDesc,
  regNumberAsc,
  regNumberDesc,
  creditHoursAsc,
  creditHoursDesc,
  termAsc,
  termDesc,
  courseAsc,
  courseDesc
}
