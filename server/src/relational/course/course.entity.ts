import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { StringLength } from "../enum/string-length.enum";
import { Department } from "../department/department.entity";
import { ObjectType, Field, Int } from "type-graphql";

@Entity("courses")
@ObjectType()
export class Course {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({ length: StringLength.SHORT })
  @Field()
  number: string;

  @Column({ length: StringLength.LONG })
  @Field()
  title: string;

  @ManyToOne(type => Department, dept => dept.courses, { eager: true })
  @Field(type => Department)
  department: Department;
}
