import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CourseEntity } from "../course/course.entity";
import { StringLength } from "../enum/string-length.enum";

@Entity("departments")
export class DepartmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: StringLength.LONG })
  name: string;

  @OneToMany(type => CourseEntity, course => course.department)
  courses: CourseEntity[];
}
