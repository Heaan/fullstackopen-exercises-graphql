import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';

const Books = (props) => {
  const [genre, setGenre] = useState('ALL');
  const result = useQuery(ALL_BOOKS, {
    variables: { author: '', genre: '' },
  });

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>Loading...</div>;
  }

  const books = result.data.allBooks;
  const genres = [...new Set(books.map((book) => book.genres).flat())];
  const bookToView = genre === 'ALL' ? books : books.filter((book) => book.genres.includes(genre));
  const style = {
    borderColor: 'black',
  };

  return (
    <div>
      <h2>books</h2>
      <table>
        <thead>
          <tr>
            <td></td>
            <td>author</td>
            <td>published</td>
          </tr>
        </thead>
        <tbody>
          {bookToView.map((book) => (
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
