
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class DepartmentInput {
    firstName: string;
    lastName: string;
}

export class Course {
    number: string;
    title: string;
    department: Department;
}

export class Department {
    id: number;
    name: string;
    courses: Course[];
}

export abstract class IMutation {
    abstract createDepartment(data: DepartmentInput): Department | Promise<Department>;

    abstract updateDepartment(id: number, data: DepartmentInput): Department | Promise<Department>;
}

export abstract class IQuery {
    abstract helloWorld(): string | Promise<string>;

    abstract departments(): Department[] | Promise<Department[]>;

    abstract department(id: number): Department | Promise<Department>;

    abstract temp__(): boolean | Promise<boolean>;
}

export class User {
    id: number;
    firstName: string;
    lastName: string;
}
