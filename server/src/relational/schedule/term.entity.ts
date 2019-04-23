import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Holiday } from "./holiday.entity";

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
  holidays: Holiday[]
}
