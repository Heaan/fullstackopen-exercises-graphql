import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { EDIT_AUTHOR } from '../queries';

const UpdateForm = ({ authors }) => {
  const [name, setName] = useState('');
  const [born, setBorn] = useState('');
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: (err) => {
      console.error(err.graphQLErrors[0].message);
    },
  });

  const submit = (event) => {
    event.preventDefault();
    editAuthor({ variables: { name, born: +born } });

    setName('');
    setBorn('');
  };

  return (
    <>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <select value={name} onChange={({ target }) => setName(target.value)}>
          <option value={''}>select a author</option>
          {authors.map((author) => (
            <option key={author.id} value={author.name}>
              {author.name}
            </option>
          ))}
        </select>
        <div>
          born
          <input type="number" value={born} onChange={({ target }) => setBorn(target.value)} />
        </div>
        <button type="submit">update author</button>
      </form>
    </>
  );
};

export default UpdateForm;
