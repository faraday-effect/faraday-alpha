import { Resolver } from "@nestjs/graphql";
import { Course } from "./entities";

@Resolver(of => Course)
export class CourseResolver {}
