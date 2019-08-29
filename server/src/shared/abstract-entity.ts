import { Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export abstract class AbstractEntity {
  @PrimaryGeneratedColumn()
  @Field(type => Int, {
    description: "Unique ID for this entity"
  })
  id: number;
}
