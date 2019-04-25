import { Field, Int, ObjectType, ArgsType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Holiday } from "../holiday/holiday.entity";
import { IsString, IsDate, IsArray } from "class-validator";

@Entity("terms")
@ObjectType()
export class Term {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  startDate: Date;

  @Column()
  @Field()
  endDate: Date;

  @OneToMany(type => Holiday, holiday => holiday.term)
  @Field(type => [Holiday])
  holidays: Holiday[];
}

@ArgsType()
export class TermCreateInput {
  @Field()
  @IsString()
  public readonly name: string;

  @Field()
  @IsDate()
  public readonly startDate: Date;

  @Field()
  @IsDate()
  public readonly endDate: Date;

  @Field(type => [Holiday])
  @IsArray()
  public readonly holidays?: Holiday[];
}
