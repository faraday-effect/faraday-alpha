import gql from "graphql-tag";

export const ALL_TOPICS_QUERY = gql`
  query AllTopics {
    topics {
      id
      title
      description
    }
  }
`;

export class Topic {
  public id = -Infinity;
  public title = "";
  public description = "";
}

export class Unit {
  public id = -Infinity;
  public title = "";
  public description = "";
  public topics: Topic[] = [];
}
