import { gql } from '@apollo/client';

const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    id
    name
    born
    bookCount
  }
`;

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    id
    title
    published
    genres
  }
`;

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      ...AuthorDetails
      books {
        ...BookDetails
      }
    }
  }
  ${BOOK_DETAILS}
  ${AUTHOR_DETAILS}
`;

export const ALL_BOOKS = gql`
  query allBooks($author: String!, $genre: String!) {
    allBooks(author: $author, genre: $genre) {
      ...BookDetails
      author {
        ...AuthorDetails
      }
    }
  }
  ${BOOK_DETAILS}
  ${AUTHOR_DETAILS}
`;

export const ADD_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      ...BookDetails
      author {
        ...AuthorDetails
        books {
          ...BookDetails
        }
      }
    }
  }
  ${BOOK_DETAILS}
  ${AUTHOR_DETAILS}
`;

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      ...AuthorDetails
      books {
        ...BookDetails
      }
    }
  }
  ${AUTHOR_DETAILS}
  ${BOOK_DETAILS}
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const ME = gql`
  query {
    me {
      favoriteGenre
    }
  }
`;

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
      author {
        ...AuthorDetails
        books {
          ...BookDetails
        }
      }
    }
  }
  ${BOOK_DETAILS}
  ${AUTHOR_DETAILS}
`;
