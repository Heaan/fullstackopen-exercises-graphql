import React, { useState, useEffect } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { LOGIN, ME } from '../queries';

const LoginForm = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, result] = useMutation(LOGIN, {
    onError: (err) => {
      console.error(err.graphQLErrors[0].message);
    },
  });
  // for refetch the cache
  const [me] = useLazyQuery(ME, { fetchPolicy: 'network-only' });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem('library-user-token', token);
      me();
    }
  }, [result.data, setToken]); // eslint-disable-line

  if (!show) {
    return null;
  }

  const submit = (event) => {
    event.preventDefault();
    login({ variables: { username, password } });
    setPage('authors');
    setUsername('');
    setPassword('');
  };

  return (
    <form onSubmit={submit}>
      <div>
        username{' '}
        <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password{' '}
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );
};

export default LoginForm;
