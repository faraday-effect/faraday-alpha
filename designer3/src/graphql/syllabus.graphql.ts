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
