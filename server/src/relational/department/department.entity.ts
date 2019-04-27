// ----- DEPARTMENTS -----
// Generated 2019-04-26 23:07:12

import { Field, Int, ObjectType, ArgsType, InputType } from "type-graphql";
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
  @Field()
  name: string;
}

export interface DepartmentWhereUniqueInput {
  id?: number;
}

export interface DepartmentWhereInput {
  name?: string;
}

export interface DepartmentUpdateInput {
  name?: string;
}

export enum DepartmentOrderByInput {
  nameAsc,
  nameDesc
}
