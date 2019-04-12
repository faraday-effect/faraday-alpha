import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { StringLength } from "src/enum/rdbms.enum";

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: StringLength.SHORT })
  value: string;
}
