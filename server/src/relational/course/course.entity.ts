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

  @Field(type => Prefix)
  prefix: Prefix;

  @Field(type => Department)
  department: Department;

  @Field(type => [Section])
  sections: Section[];
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
