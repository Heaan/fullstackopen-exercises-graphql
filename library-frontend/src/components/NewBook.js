import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries';

const NewBook = (props) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const [createBook] = useMutation(ADD_BOOK, {
    update: (store, { data: { addBook } }) => {
      const genres = [...addBook.genres, ''];
      genres.forEach((genre) => {
        try {
          const dataInStore = store.readQuery({
            query: ALL_BOOKS,
            variables: { author: '', genre },
          });
          store.writeQuery({
            query: ALL_BOOKS,
            variables: { author: '', genre },
            data: { ...dataInStore, allBooks: [...dataInStore.allBooks, addBook] },
          });
        } catch {
          console.log('not in cache');
        }
      });
    },
  });

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    createBook({ variables: { title, author, published: +published, genres } });

    setTitle('');
    setPublished('');
    setAuthor('');
    setGenres([]);
    setGenre('');
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre('');
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author
          <input value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input value={genre} onChange={({ target }) => setGenre(target.value)} />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
