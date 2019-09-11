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

export const CREATE_UNIT_MUTATION = gql`
  mutation CreateUnit($createInput: UnitCreateInput!) {
    createUnit(createInput: $createInput) {
      id
      title
      description
    }
  }
`;

export const UPDATE_UNIT_MUTATION = gql`
  mutation UpdateUnit($updateInput: UnitUpdateInput!) {
    updateUnit(updateInput: $updateInput) {
      id
      title
      description
    }
  }
`;

export const DELETE_UNIT_MUTATION = gql`
  mutation DeleteUnit($unitId: Int!) {
    deleteUnit(id: $unitId) {
      id
      title
      description
    }
  }
`;
