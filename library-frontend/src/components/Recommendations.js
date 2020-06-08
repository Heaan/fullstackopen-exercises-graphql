import React, { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { ME, ALL_BOOKS } from '../queries';
import BookTable from './BookTable';

const Recommendations = ({ show }) => {
  const [me, user] = useLazyQuery(ME);
  const [genre, setGenre] = useState(null);
  const [allBooks, books] = useLazyQuery(ALL_BOOKS);

  useEffect(() => {
    if (show) {
      me();
    }
  }, [show]);

  useEffect(() => {
    if (user.data) {
      setGenre(user.data.me?.favoriteGenre);
    }
  }, [user.data]);

  useEffect(() => {
    if (genre) {
      allBooks({ variables: { author: '', genre } });
    }
  }, [genre]);

  if (!show) {
    return null;
  }

  if (user.called && user.loading) {
    return <div>Loading...</div>;
  }

  if (!genre) {
    return (
      <button type="button" onClick={() => me()}>
        刷新
      </button>
    );
  }

  return (
    <>
      <h2>recommendations</h2>
      <div>
        books in your favorite genre <strong>{genre}</strong>
      </div>
      <BookTable books={books.data?.allBooks || []} />
    </>
  );
};

export default Recommendations;
