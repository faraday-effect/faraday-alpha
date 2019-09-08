import gql from "graphql-tag";

export const CREATE_TOPIC_MUTATION = gql`
  mutation CreateTopic($createInput: TopicCreateInput!) {
    createTopic(createInput: $createInput) {
      id
      title
      description
    }
  }
`;

export const ALL_TOPICS_QUERY = gql`
  query AllTopics {
    topics {
      id
      title
      description
    }
  }
`;

export const UPDATE_TOPIC_MUTATION = gql`
  mutation UpdateTopic($updateInput: TopicUpdateInput!) {
    updateTopic(updateInput: $updateInput) {
      id
      title
      description
    }
  }
`;

export const DELETE_TOPIC_MUTATION = gql`
  mutation DeleteTopic($topicId: Int!) {
    deleteTopic(id: $topicId) {
      id
      title
      description
    }
  }
`;
