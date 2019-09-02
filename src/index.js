import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';
import { SubscriptionClient } from "subscriptions-transport-ws";

import {
  Provider,
  createClient,
  fetchExchange,
  dedupExchange,
  subscriptionExchange
} from "urql";

import { cacheExchange } from '@urql/exchange-graphcache';

import "./styles/index.css";

import App from './components/App';
import { FEED_QUERY } from './components/LinkList';
import { getToken } from './token';

const cache = cacheExchange({
  updates: {
    Mutation: {
      post: ({ post }, _args, cache) => {
        const variables = { first: 10, skip: 0, orderBy: "createdAt_DESC" };
        cache.updateQuery({ query: FEED_QUERY, variables }, data => {
          if (data !== null) {
            data.feed.links.unshift(post);
            data.feed.count++;
            return data;
          } else {
            return null;
          }
        });
      }
    },
    Subscription: {
      newLink: ({ newLink }, _args, cache) => {
        const variables = { first: 10, skip: 0, orderBy: "createdAt_DESC" };
        cache.updateQuery({ query: FEED_QUERY, variables }, data => {
          if (data !== null) {
            data.feed.links.unshift(newLink);
            data.feed.count++;
            return data;
          } else {
            return null;
          }
        });
      }
    }
  }
});

const subscriptionClient = new SubscriptionClient(
  'ws://localhost:4000',
  {
    reconnect: true,
    connectionParams: {
      authToken: getToken()
    }
  }
);

const client = createClient({
  url: 'http://localhost:4000',
  fetchOptions: () => {
    const token = getToken();
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' }
    }
  },
  exchanges: [
    dedupExchange,
    cache,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation)
    })
  ]
});

ReactDOM.render(
  <BrowserRouter>
    <Provider value={client}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root'),
);
