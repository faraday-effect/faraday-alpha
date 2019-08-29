import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Term } from "./Term";
import { AbstractEntity } from "../../shared/abstract-entity";

@Entity()
@ObjectType()
export class DateRange extends AbstractEntity {
  @Column()
  @Field()
  title: string;

  @Column({ length: 10 })
  @Field()
  startDate: string;

  @Column({ nullable: true, length: 10 })
  @Field({ nullable: true })
  endDate?: string;

  @ManyToOne(type => Term, term => term.dateRanges, { nullable: false })
  @Field(type => [Term])
  term: Term;
}

@InputType()
export class DateRangeCreateInput {
  @Field() title: string;
  @Field() startDate: string;
  @Field({ nullable: true }) endDate?: string;
}
