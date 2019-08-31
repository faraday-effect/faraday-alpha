export interface Fixture {
  uniqueName: string;
  description: string; // Description for human consumption
  graphQlMutation: any; // GraphQL mutation
  graphQlData: object[];
  idPath: string; // Lodash object path to printable identifier
  tablesToTruncate: string[];
}
