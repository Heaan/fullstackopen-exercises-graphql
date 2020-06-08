import React from 'react';
import { useQuery } from '@apollo/client';
import { ME } from '../queries';
import BookTable from './BookTable';

const Recommendations = ({ show }) => {
  const result = useQuery(ME);

  if (!show) {
    return null;
  }

  if (result.loading) {
    return <div>Loading...</div>;
  }

  const genre = result.data?.me?.favoriteGenre;

  return (
    <>
      <h2>recommendations</h2>
      <div>
        books in your favorite genre <strong>{genre}</strong>
      </div>
      <BookTable variables={{ author: '', genre }} />
    </>
  );
};

export default Recommendations;
