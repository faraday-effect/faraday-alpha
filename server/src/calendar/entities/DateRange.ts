import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Term } from "./Term";

@Entity()
@ObjectType()
export class DateRange {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  startDate: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  endDate?: Date;

  @ManyToOne(type => Term, term => term.dateRanges, { nullable: false })
  @Field(type => [Term])
  term: Term;
}

@InputType()
export class DateRangeCreateInput {
  @Field(type => Int) termId: number;
  @Field() title: string;
  @Field() startDate: Date;
  @Field({ nullable: true }) endDate?: Date;
}

export type DateRangeCreateInstance = Omit<DateRange, "id">;
