// ----- DEPARTMENTS -----
// Generated 2019-04-27 19:12:17

import { Field, Int, ObjectType, InputType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Course } from "../course/course.entity";

@Entity("departments")
@ObjectType()
export class Department {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({ type: "varchar", length: 255 })
  @Field()
  name: string;

  @OneToMany(type => Course, course => course.department)
  @Field(type => [Course])
  courses: Course[];
}

@InputType()
export class DepartmentCreateInput {
  @Field(type => Int)
  id: number;

  @Field()
  name: string;

  @Field(type => [Course])
  courses: Course[];
}

export interface DepartmentWhereUniqueInput {
  id?: number;
}

export interface DepartmentWhereInput {
  id?: number;
  name?: string;
  courses?: Course[];
}

export interface DepartmentUpdateInput {
  id?: number;
  name?: string;
  courses?: Course[];
}

export enum DepartmentOrderByInput {
  idAsc,
  idDesc,
  nameAsc,
  nameDesc,
  coursesAsc,
  coursesDesc
}
