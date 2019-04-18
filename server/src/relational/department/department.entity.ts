import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "../course/course.entity";
import { StringLength } from "../enum/string-length.enum";
import { ObjectType, Field, Int } from "type-graphql";
import { IsString, IsArray } from "class-validator";

@Entity("departments")
@ObjectType()
export class Department {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({ length: StringLength.LONG })
  @Field()
  name: string;

  @OneToMany(type => Course, course => course.department)
  @Field(type => [Course])
  courses: Course[];
}

export class DepartmentCreateInput {
  @IsString()
  readonly name: string;

  @IsArray()
  readonly courses?: Course[];
}
