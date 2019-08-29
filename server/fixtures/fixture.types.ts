export interface FixtureMutation {
  graphQL: any; // GraphQL mutation
  paramName: string; // Parameter name (e.g., "data")
  data: object[]; // Array of objects, one per mutation
  description: string; // Description for human consumption
  idPath: string; // Lodash object path to printable identifier
}
