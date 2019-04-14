import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DepartmentController } from "./department.controller";
import { DepartmentService } from "./department.service";
import { DepartmentEntity } from "./department.entity";

@Module({
  imports: [TypeOrmModule.forFeature([DepartmentEntity])],
  controllers: [DepartmentController],
  providers: [DepartmentService]
})
export class DepartmentModule {}
