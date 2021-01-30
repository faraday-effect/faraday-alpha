import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export abstract class AbstractEntity {
  @PrimaryGeneratedColumn()
  @Field(type => Int, {
    description: "Unique ID for this entity"
  })
  id: number;

  // Maybe turn these on in the future; during development, just adds clutter.
  //
  // @CreateDateColumn()
  // createdOn: Date;
  //
  // @UpdateDateColumn()
  // updatedOn: Date;
  //
  // @VersionColumn()
  // version: number;
}