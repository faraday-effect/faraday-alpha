import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { Department, Prefix } from "../../org/entities";
import { Offering } from "./Offering";

@Entity()
@ObjectType()
export class Course extends AbstractEntity {
  @Column()
  @Field()
  number: string;

  @Column()
  @Field()
  title: string;

  @Column("int") prefixId: number;
  @ManyToOne(type => Prefix, prefix => prefix.courses, { nullable: false })
  @Field(type => Prefix)
  prefix: Prefix;

  @Column("int") departmentId: number;
  @ManyToOne(type => Department, department => department.courses, {
    nullable: false
  })
  @Field(type => Department)
  department: Department;

  @OneToMany(type => Offering, offering => offering.course)
  @Field(type => [Offering])
  offerings: Offering[];
}

@InputType()
export class CourseCreateInput {
  @Field() number: string;
  @Field() title: string;
  @Field(type => Int) prefixId: number;
  @Field(type => Int) departmentId: number;
}
