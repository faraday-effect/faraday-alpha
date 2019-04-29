// ----- TERMS -----

import { Field, Int, ObjectType, InputType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Holiday } from "../holiday/holiday.entity";
import { Section } from "../section/section.entity";

@Entity("terms")
@ObjectType()
export class Term {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ type: "varchar", length: 64 })
  @Field()
  name: string;

  @Column({ type: "date" })
  @Field()
  startDate: Date;

  @Column({ type: "date" })
  @Field()
  endDate: Date;

  @OneToMany(() => Holiday, holiday => holiday.term)
  @Field(() => [Holiday])
  holidays: Holiday[];

  @OneToMany(() => Section, section => section.term)
  @Field(() => [Section])
  sections: Section[];
}

@InputType()
export class TermCreateInput {
  @Field()
  name: string;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;
}

export interface TermWhereUniqueInput {
  id?: number;
}

export interface TermWhereInput {
  id?: number;
  name?: string;
  startDate?: Date;
  endDate?: Date;
  holidays?: Holiday[];
  sections?: Section[];
}

export interface TermUpdateInput {
  id?: number;
  name?: string;
  startDate?: Date;
  endDate?: Date;
  holidays?: Holiday[];
  sections?: Section[];
}

export enum TermOrderByInput {
  idAsc,
  idDesc,
  nameAsc,
  nameDesc,
  startDateAsc,
  startDateDesc,
  endDateAsc,
  endDateDesc,
  holidaysAsc,
  holidaysDesc,
  sectionsAsc,
  sectionsDesc
}