import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { ALL_BOOKS } from '../queries';
import BookTable from './BookTable';

const Books = ({ show }) => {
  const [books, setBooks] = useState([]);
  const [tags, setTags] = useState([]);
  const [genre, setGenre] = useState('');
  const [allBooks, { called, loading, data }] = useLazyQuery(ALL_BOOKS);

  useEffect(() => {
    if (show) {
      allBooks({ variables: { author: '', genre } });
    }
  }, [show, genre]);

  useEffect(() => {
    if (data) {
      setBooks(data.allBooks);
      if (tags.length === 0) {
        setTags([...new Set(data.allBooks.map((book) => book.genres).flat())]);
      }
    }
  }, [data]);

  if (!show) {
    return null;
  }

  const style = {
    borderColor: 'black',
  };

  return (
    <div>
      <h2>books</h2>
      {called && loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div>
            in genre <strong>{genre.length === 0 ? 'all genres' : genre}</strong>
          </div>
          <BookTable books={books} />
          <div>
            {tags.map((tag) => (
              <button
                style={genre === tag ? style : null}
                type="button"
                onClick={() => setGenre(tag)}
                key={tag}
              >
                {tag}
              </button>
            ))}
            <button
              style={genre.length === 0 ? style : null}
              type="button"
              onClick={() => setGenre('')}
            >
              all genres
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Books;
