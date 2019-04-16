import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Department } from "../department/department.entity";
import { StringLength } from "../enum/string-length.enum";

@Entity("courses")
@ObjectType()
export class Course {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({ length: StringLength.SHORT })
  @Field({ description: "Course number (e.g., `COS243`)" })
  number: string;

  @Column({ length: StringLength.LONG })
  @Field({
    description: "Course title (e.g., `Multi-tier Web Application Develoment`"
  })
  title: string;

  @ManyToOne(type => Department, dept => dept.courses, { eager: true })
  @Field(type => Department)
  department: Department;
}
