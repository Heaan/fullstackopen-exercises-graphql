import React from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';

const BookTable = ({ variables }) => {
  const result = useQuery(ALL_BOOKS, {
    variables,
  });

  if (result.loading) {
    return <div>Loading...</div>;
  }

  const books = result.data?.allBooks || [];

  return (
    <table>
      <thead>
        <tr>
          <td></td>
          <td>author</td>
          <td>published</td>
        </tr>
      </thead>
      <tbody>
        {books.map((book) => (
          <tr key={book.id}>
            <td>{book.title}</td>
            <td>{book.author.name}</td>
            <td>{book.published}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BookTable;
