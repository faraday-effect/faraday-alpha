import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { StringLength } from "../enum/string-length.enum";

@Entity()
export class CourseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: StringLength.SHORT })
  number: string;

  @Column({ length: StringLength.LONG })
  title: string;
}
