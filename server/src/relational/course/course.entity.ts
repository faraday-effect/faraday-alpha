// ----- COURSES -----

import { Field, Int, ObjectType, InputType } from "type-graphql";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany
} from "typeorm";
import { Prefix } from "../prefix/prefix.entity";
import { Department } from "../department/department.entity";
import { Section } from "../section/section.entity";

@Entity("courses")
@ObjectType()
export class Course {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({ type: "varchar", length: 64 })
  @Field()
  number: string;

  @Column({ type: "varchar", length: 255 })
  @Field()
  title: string;

  @ManyToOne(() => Prefix, prefix => prefix.courses)
  @Field(() => Prefix)
  prefix: Prefix;

  @ManyToOne(() => Department, department => department.courses)
  @Field(() => Department, { nullable: true })
  department?: Department;

  @OneToMany(() => Section, section => section.course)
  @Field(type => [Section])
  sections: Section[];
}

@InputType()
export class CourseCreateInput implements Partial<Course> {
  @Field()
  number: string;

  @Field()
  title: string;

  @Field(() => Int, { nullable: true })
  departmentId?: number;
}

export interface CourseWhereUniqueInput {
  id?: number;
}

export interface CourseWhereInput {
  id?: number;
  number?: string;
  title?: string;
  prefix?: Prefix;
  department?: Department;
  sections?: Section[];
}

export interface CourseUpdateInput {
  id?: number;
  number?: string;
  title?: string;
  prefix?: Prefix;
  department?: Department;
  sections?: Section[];
}

export enum CourseOrderByInput {
  idAsc,
  idDesc,
  numberAsc,
  numberDesc,
  titleAsc,
  titleDesc,
  prefixAsc,
  prefixDesc,
  departmentAsc,
  departmentDesc,
  sectionsAsc,
  sectionsDesc
}
