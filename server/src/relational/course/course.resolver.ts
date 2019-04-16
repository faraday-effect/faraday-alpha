import { Query, Resolver } from '@nestjs/graphql';
import { Course } from './course.entity';
import { CourseService } from './course.service';

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
