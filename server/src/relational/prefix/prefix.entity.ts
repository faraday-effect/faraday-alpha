// ----- PREFIXES -----
// Generated 2019-04-27 19:12:17

import { Field, Int, ObjectType, InputType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Course } from "../course/course.entity";

@Entity("prefixes")
@ObjectType()
export class Prefix {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({ type: "varchar", length: 64 })
  @Field()
  value: string;

  @OneToMany(type => Course, course => course.prefix)
  @Field(type => [Course])
  courses: Course[];
}

@InputType()
export class PrefixCreateInput {
  @Field(type => Int)
  id: number;

  @Field()
  value: string;

  @Field(type => [Course])
  courses: Course[];
}

export interface PrefixWhereUniqueInput {
  id?: number;
}

export interface PrefixWhereInput {
  id?: number;
  value?: string;
  courses?: Course[];
}

export interface PrefixUpdateInput {
  id?: number;
  value?: string;
  courses?: Course[];
}

export enum PrefixOrderByInput {
  idAsc,
  idDesc,
  valueAsc,
  valueDesc,
  coursesAsc,
  coursesDesc
}
