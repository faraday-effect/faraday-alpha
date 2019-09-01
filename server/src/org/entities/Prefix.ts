import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { Course } from "../../catalog/entities";

@Entity()
@ObjectType()
export class Prefix extends AbstractEntity {
  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  description: string;

  @OneToMany(type => Course, course => course.prefix)
  @Field(type => [Course])
  courses: Course[];
}

@InputType()
export class PrefixCreateInput {
  @Field() name: string;
  @Field() description: string;
}
