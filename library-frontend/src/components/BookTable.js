import React from 'react';

const BookTable = ({ books }) => {
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
