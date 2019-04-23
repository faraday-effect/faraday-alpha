import { Field, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Term } from "./term.entity";

@Entity("holidays")
@ObjectType()
export class Holiday {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  startDate: Date;

  @Column()
  @Field()
  endDate: Date;

  @ManyToOne(type => Term, term => term.holidays)
  @Field(type => Term)
  term: Term
}
