import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { Course } from "../../catalog/entities";

@Entity()
@ObjectType()
export class Department extends AbstractEntity {
  @Column()
  @Field()
  name: string;

  @OneToMany(type => Course, course => course.department)
  @Field(type => [Course])
  courses: Course[];
}

@InputType()
export class DepartmentCreateInput {
  @Field() name: string;
}
