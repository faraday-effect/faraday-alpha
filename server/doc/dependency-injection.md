# Dependency Injection in Nest.JS

(Most of the content here is snippets from the documentation.)

## History

Changes in the `@Module` decorator:

1. `imports` used to be called `modules` (v. 4)
1. `providers` used to be called `components` (v. 4)

## Controller

- Controllers are responsible for handling incoming requests and returning responses to the client.
- Controllers always belong to a module, which is why we include the controllers array within the @Module() decorator.

## Provider

- Providers are a fundamental concept in Nest.
- Main idea: **a provider can inject dependencies**: objects can create various relationships with each other,
  and "wiring up" instances of objects can be delegated to the Nest runtime.
- A provider is a class annotated with an `@Injectable()` decorator.
- Many basic Nest classes may be treated as providers:
  1. services (data storage and retrieval)
  2. repositories
  3. factories, helpers, etc.

## Module

- A module is a class annotated with a `@Module()` decorator;
  it provides metadata that Nest uses organize application structure.
- Each application has at least one module,
  a **root module**.
- Root module is the starting point Nest uses to build the application graph:
  the internal data structure Nest uses to resolve module and provider relationships and dependencies.
- Modules are strongly recommended as an effective way to organize components.
- Employ multiple modules, each encapsulating a closely related set of capabilities.
- A module _encapsulates_ providers by default.
  It's impossible to inject providers that are neither directly part of the current module
  nor exported from imported modules.
  Consider the exported providers from a module as the module's public interface (API).

The `@Module()` decorator takes a single object whose properties describe the module:

1. `controllers` - controllers defined in this module

2. `providers` - providers:

   - Must contain all the `@Injectable`s that will be instantiated by the Nest injector
   - May be shared across the module
   - May be exported to be available to other modules.

   For example, `CourseService` is a provider in `CourseModule`
   so that it can be injected in `CourseController` and `CourseResolver`.

3. `imports` - imported modules that export
   the providers required in this module.
   For example, `TypeOrmModule.forFeature([])`
   provides `TypeORM` **repositories**
   for injection using `@InjectRepository`
   (usually in a `...Service` class).

4. `exports` - subset of `providers` that are provided by this module
   and should be available in other modules that import this module.

## Examples

(From the present code base.)

A GraphQL query for a `Department`
may also request the `Course` records associated
with that `Department`.
The `CourseService`, part of `CourseModule`,
encapsulates the data access code to retrieve
the list of `Course` records for a given
`Department.id`.

For `DepartmentModule` to inject `CourseService`,
requires this module configuration:

1. `CourseModule` has
   
   ```js
   {
     providers: [CourseService, ...],
     exports: [CourseService]
   }
   ```
   
   The `CourseService` defines the data access methods.
   It is exported so that other modules
   can refer to it.

2. `DepartmentModule` has

   ```js
   {
       imports: [..., CourseModule],
       providers: [DepartmentService, ...]

   }
   ```

   This makes the `exports` from `CourseModule`
   available to `DepartmentModule`.
   The injection happens in the constructor:

   ```js
   constructor(
     private readonly departmentService: DepartmentService,
     private readonly courseService: CourseService
   ) {}
   ```

   `DepartmentService` appears as a `provider`,
   because it is defined in the `DepartmentModule`
   itself.
