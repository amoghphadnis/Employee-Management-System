import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';
import ErrorBoundary from './ErrorBoundary'; // Import ErrorBoundary

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache()
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ApolloProvider>
  </React.StrictMode>
);

reportWebVitals();
