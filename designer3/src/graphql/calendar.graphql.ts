import gql from "graphql-tag";

export const ALL_TERMS_QUERY = gql`
  query AllTerms {
    terms {
      id
      name
      startDate
      endDate
      dateRanges {
        title
        startDate
        endDate
      }
    }
  }
`;

export const ONE_TERM_QUERY = gql`
  query oneTerm($termId: Int!) {
    term(id: $termId) {
      name
      startDate
      endDate
      dateRanges {
        startDate
        endDate
        title
      }
    }
  }
`;
