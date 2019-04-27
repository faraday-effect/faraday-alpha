// ----- COURSES -----
// Generated 2019-04-26 23:07:12

import { Field, Int, ObjectType, ArgsType, InputType } from "type-graphql";
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

  @ManyToOne(type => Prefix, prefix => prefix.courses)
  @Field(type => Prefix)
  prefix: Prefix;

  @ManyToOne(type => Department, department => department.courses)
  @Field(type => Department)
  department: Department;

  @OneToMany(type => Section, section => section.course)
  @Field(type => [Section])
  sections: Section[];
}

@InputType()
export class CourseCreateInput {
  @Field()
  number: string;

  @Field()
  title: string;
}

export interface CourseWhereUniqueInput {
  id?: number;
}

export interface CourseWhereInput {
  number?: string;
  title?: string;
}

export interface CourseUpdateInput {
  number?: string;
  title?: string;
}

export enum CourseOrderByInput {
  numberAsc,
  numberDesc,
  titleAsc,
  titleDesc
}
