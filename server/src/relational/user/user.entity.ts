// ----- USERS -----

import { Field, Int, ObjectType, InputType } from "type-graphql";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable
} from "typeorm";
import { Role } from "../role/role.entity";

@Entity("users")
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({ type: "varchar", length: 64, unique: true })
  @Field()
  email: string;

  @Column({ type: "varchar", length: 64 })
  @Field()
  password: string;

  @Column({ type: "varchar", length: 255 })
  @Field()
  firstName: string;

  @Column({ type: "varchar", length: 255 })
  @Field()
  lastName: string;

  @Column({ type: "varchar", length: 64, nullable: true })
  @Field()
  officePhone?: string;

  @Column({ type: "varchar", length: 64, nullable: true })
  @Field()
  mobilePhone?: string;

  @ManyToMany(() => Role, role => role.users)
  @JoinTable()
  roles?: Role[];
}

@InputType()
export class UserCreateInput implements Partial<User> {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  officePhone?: string;

  @Field()
  mobilePhone?: string;
}

export interface UserWhereUniqueInput {
  id?: number;
  email?: string;
}

export interface UserWhereInput {
  id?: number;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  officePhone?: string;
  mobilePhone?: string;
  roles?: Role[];
}

export interface UserUpdateInput {
  id?: number;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  officePhone?: string;
  mobilePhone?: string;
  roles?: Role[];
}

export enum UserOrderByInput {
  idAsc,
  idDesc,
  emailAsc,
  emailDesc,
  passwordAsc,
  passwordDesc,
  firstNameAsc,
  firstNameDesc,
  lastNameAsc,
  lastNameDesc,
  officePhoneAsc,
  officePhoneDesc,
  mobilePhoneAsc,
  mobilePhoneDesc,
  rolesAsc,
  rolesDesc
}
