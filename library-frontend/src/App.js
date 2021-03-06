import React, { useState, useEffect } from 'react';
import { useApolloClient, useSubscription } from '@apollo/client';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import LoginForm from './components/LoginForm';
import Recommendations from './components/Recommendations';
import { BOOK_ADDED, ALL_BOOKS, ALL_AUTHORS } from './queries';
import { useCacheUpdate } from './hooks/index';

const App = () => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  const updateBookCacheWith = useCacheUpdate(ALL_BOOKS);
  const updateAuthorCacheWith = useCacheUpdate(ALL_AUTHORS);
  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addBook = subscriptionData.data.bookAdded;
      const genres = [...addBook.genres, ''];
      const author = addBook.author;
      updateAuthorCacheWith(author, 'allAuthors');
      genres.forEach((genre) => {
        try {
          updateBookCacheWith(addBook, 'allBooks', { author: '', genre });
        } catch (err) {
          if (!err.message.startsWith(`Can't find field`)) {
            console.error(err.message);
          }
        }
      });
    },
  });

  useEffect(() => {
    const userToken = localStorage.getItem('library-user-token');
    if (userToken) {
      setToken(userToken);
    }
  }, []);

  const logout = () => {
    setPage('authors');
    setToken(null);
    localStorage.removeItem('library-user-token');
    client.resetStore();
  };

  return (
    <div>
      <div>
        <button type="button" onClick={() => setPage('authors')}>
          authors
        </button>
        <button type="button" onClick={() => setPage('books')}>
          books
        </button>
        {token ? (
          <>
            <button type="button" onClick={() => setPage('add')}>
              add book
            </button>
            <button type="button" onClick={() => setPage('recommend')}>
              recommend
            </button>
            <button type="button" onClick={logout}>
              logout
            </button>
          </>
        ) : (
          <button type="button" onClick={() => setPage('login')}>
            login
          </button>
        )}
      </div>

      <Authors show={page === 'authors'} token={token} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Recommendations show={page === 'recommend'} />

      <LoginForm show={page === 'login'} setToken={setToken} setPage={setPage} />
    </div>
  );
};

export default App;
