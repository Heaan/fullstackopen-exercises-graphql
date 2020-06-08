import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';

const Books = (props) => {
  const [genre, setGenre] = useState('ALL');
  const result = useQuery(ALL_BOOKS);

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>Loading...</div>;
  }

  const books = result.data.allBooks;
  const genres = [...new Set(books.map((book) => book.genres).flat())];
  const booksToView = genre !== 'ALL' ? books.filter((book) => book.genres.includes(genre)) : books;
  const style = {
    borderColor: 'black',
  };

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToView.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          style={genre === 'ALL' ? style : null}
          type="button"
          onClick={() => setGenre('ALL')}
        >
          all
        </button>
        {genres.map((g) => (
          <button
            style={genre === g ? style : null}
            type="button"
            onClick={() => setGenre(g)}
            key={g}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;
