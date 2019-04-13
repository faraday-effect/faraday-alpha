import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { StringLength } from "../enum/string-length.enum";

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: StringLength.LONG })
  name: string;
}
