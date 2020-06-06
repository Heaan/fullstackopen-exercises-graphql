import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS);
  const [name, setName] = useState('');
  const [born, setBorn] = useState('');
  const [editAuthor] = useMutation(EDIT_AUTHOR);

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>Loading...</div>;
  }

  const authors = result.data.allAuthors;

  const submit = (event) => {
    event.preventDefault();
    editAuthor({ variables: { name, born: +born } });

    setName('');
    setBorn('');
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        {/* <div>
          name
          <input type="text" value={name} onChange={({ target }) => setName(target.value)} />
        </div> */}
        <select value={name} onChange={({ target }) => setName(target.value)}>
          {authors.map((author) => (
            <option value={author.name}>{author.name}</option>
          ))}
        </select>
        <div>
          born
          <input type="number" value={born} onChange={({ target }) => setBorn(target.value)} />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
