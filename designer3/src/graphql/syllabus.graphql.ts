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

export const CREATE_TOPIC_MUTATION = gql`
  mutation CreateTopic($createInput: TopicCreateInput!) {
    createTopic(createInput: $createInput) {
      id
      title
      description
    }
  }
`;
