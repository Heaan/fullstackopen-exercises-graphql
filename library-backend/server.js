/* eslint-disable no-underscore-dangle */
const { ApolloServer, gql, UserInputError, AuthenticationError, PubSub } = require('apollo-server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const pubsub = new PubSub();

const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');

mongoose.set('useFindAndModify', false);

const { MONGODB_URI } = process.env;
const { JWT_SECRET } = process.env;

console.log('connecting to', MONGODB_URI);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((err) => {
    console.error('error connection to MongoDB:', err.message);
  });

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    books: [Book!]!
    bookCount: Int
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(title: String!, author: String!, published: Int!, genres: [String!]!): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`;

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return Book.find({}).populate('author');
      }
      if (!args.author) {
        return Book.find({ genres: args.genre }).populate('author');
      }
      const author = await Author.findOne({ name: args.author });
      if (!args.genre && author) {
        return Book.find({ author: author._id }).populate('author');
      }
      if (args.genre && author) {
        return Book.find({ genres: args.genre, author: author._id }).populate('author');
      }
      return [];
    },
    allAuthors: () => Author.find({}).populate('books'),
    me: (root, args, { currentUser }) => currentUser,
  },
  Author: {
    // bookCount: (root) => Book.countDocuments({ author: root.id }),
    bookCount: (root) => root.books.length,
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }

      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
      }
      const book = new Book({ ...args, author: author._id });
      author.books = author.books.concat(book._id);
      try {
        await author.save();
        await book.save();
      } catch (err) {
        throw new UserInputError(err.message, {
          invalidArgs: args,
        });
      }
      const bookAdded = await book
        .populate({ path: 'author', populate: { path: 'books' } })
        .execPopulate();

      pubsub.publish('BOOK_ADDED', { bookAdded });

      return bookAdded;
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }

      const author = await Author.findOne({ name: args.name });
      if (!author) {
        return null;
      }
      author.born = args.setBornTo;
      try {
        await author.save();
      } catch (err) {
        throw new UserInputError(err.message, {
          invalidArgs: args,
        });
      }
      return author.populate('books').execPopulate();
    },
    createUser: (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre });
      return user.save().catch((err) => {
        throw new UserInputError(err.message, {
          invalidArgs: args,
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== '123') {
        throw new UserInputError('wrong credentials');
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);

      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
    return null;
  },
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`);
  console.log(`Subscriptions ready at ${subscriptionsUrl}`);
});
