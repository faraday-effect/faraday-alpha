import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { StringLength } from "../enum/string-length.enum";
import { DepartmentEntity } from "../department/department.entity";

@Entity("courses")
export class CourseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: StringLength.SHORT })
  number: string;

  @Column({ length: StringLength.LONG })
  title: string;

  @ManyToOne(type => DepartmentEntity, dept => dept.courses, { eager: true })
  department: DepartmentEntity;
}
