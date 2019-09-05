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
  id = NaN;
  title = "";
  description = "";
}

export class Unit {
  id = NaN;
  title = "";
  description = "";
  topics: Topic[] = [];
}
