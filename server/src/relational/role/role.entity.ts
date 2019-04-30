// ----- ROLES -----

import { Field, Int, ObjectType, InputType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import { User } from "../user/user.entity";

@Entity("roles")
@ObjectType()
export class Role {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({ type: "varchar", length: 64 })
  @Field()
  title: string;

  @Column({ type: "text" })
  @Field()
  description: string;

  @ManyToMany(() => User, user => user.roles)
  users?: User[];
}

@InputType()
export class RoleCreateInput {
  @Field()
  title: string;

  @Field()
  description: string;
}

export interface RoleWhereUniqueInput {
  id?: number;
}

export interface RoleWhereInput {
  id?: number;
  title?: string;
  description?: string;
  users?: User[];
}

export interface RoleUpdateInput {
  id?: number;
  title?: string;
  description?: string;
  users?: User[];
}

export enum RoleOrderByInput {
  idAsc,
  idDesc,
  titleAsc,
  titleDesc,
  descriptionAsc,
  descriptionDesc,
  usersAsc,
  usersDesc
}
