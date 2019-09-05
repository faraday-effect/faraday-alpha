import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../shared/abstract-entity";
import { Term } from "../../calendar/entities";
import { Course } from "./Course";
import { Matches } from "class-validator";
import { Offering } from "./Offering";

@Entity()
@ObjectType()
export class Section extends AbstractEntity {
  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  regNumber: string;

  @Column()
  @Field({ description: "Meeting days (e.g., 'MWF', 'TR')" })
  @Matches(/^[MTWRF]+$/)
  daysOfWeek: string;

  @Column()
  @Field({ description: "Daily start time (e.g., '09:00')" })
  startTime: string;

  @Column()
  @Field({ description: "Daily stop time (e.g., '09:50')" })
  stopTime: string;

  @Column("int") offeringId: number;
  @ManyToOne(type => Offering, offering => offering.sections, {
    nullable: false
  })
  @Field(type => Offering)
  offering: Offering;
}

@InputType()
export class SectionCreateInput {
  @Field() title: string;
  @Field() regNumber: string;
  @Field() days: string;
  @Field() startTime: string;
  @Field() stopTime: string;
  @Field(type => Int) offeringId: number;
}
