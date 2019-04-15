import { Resolver, Query } from '@nestjs/graphql';
import { CourseService } from './course.service';
import { Course } from './course.entity';

@Resolver('Course')
export class CourseResolver {
    constructor(
        private readonly courseService: CourseService
    ) {}

    @Query(returns => [Course])
    async courses() {
        return this.courseService.readAll();
    }
}
