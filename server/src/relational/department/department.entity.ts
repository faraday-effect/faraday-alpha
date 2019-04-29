// ----- DEPARTMENTS -----

import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "../course/course.entity";

@Entity("departments")
@ObjectType()
export class Department {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ type: "varchar", length: 255 })
  @Field()
  name: string;

  // @OneToMany(() => Course, course => course.department)
  // @Field(() => [Course])
  // courses: Course[];
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
