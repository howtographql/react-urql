import React from 'react';
import ReactDOM from 'react-dom';
import { SubscriptionClient } from "subscriptions-transport-ws";
import {
  Provider,
  createClient,
  fetchExchange,
  dedupExchange,
  subscriptionExchange
} from "urql";
import { cacheExchange } from '@urql/exchange-graphcache';
// import { suspenseExchange } from '@urql/exchange-suspense';
import { BrowserRouter } from 'react-router-dom';
import "./styles/index.css";
import App from "./components/App";
import { AUTH_TOKEN, LINKS_PER_PAGE } from './constants';
import { FEED_QUERY } from './components/LinkList';
import * as serviceWorker from "./serviceWorker";
// import { timeDifferenceForDate } from './utils';

const cache = cacheExchange({
  keys: {
    // TODO: evaluate if we're not indicating wrong things by
    // warning on these.
    Feed: data => data.id || data._id || null,
    Link: data => data.id || data._id || null,
  },
  // Optimistic is not possible due to the nature of the data-structure
  // every vote needs to have an unique id for a unique userId...

  // We could write a custom resolver to format the datetime of a post
  // to indicate the text of x time ago.
  // TODO: found inconsistency with resolvers
  // Initial write does not respect the resolvers given for querying data.
  // resolvers: {
  //   Link: {
  //     createdAt: (parent) => {
  //       console.log('in link resolver');
  //       return timeDifferenceForDate(parent.createdAt);
  //     }
  //   }
  // },

  // Mutations that need updates due to adding/removing/... to a list
  // Will most likely come here. We can't make assumptions for adding to
  // a list.
  updates: {
    Mutation: {
      post: ({ post }, _, cache) => {
        const first = LINKS_PER_PAGE;
        const skip = 0;
        const orderBy = 'createdAt_DESC';
        // TODO: update @urql/exchange-graphcache for this to work
        cache.updateQuery(FEED_QUERY, { first, skip, orderBy }, data => {
          data.feed.links.unshift(post);
          data.feed.count += 1;
          return data;
        });
      },
    },
    Subscription: {
      newLink: ({ newLink }, _, cache) => {
        const first = LINKS_PER_PAGE;
        const skip = 0;
        const orderBy = 'createdAt_DESC';
        // TODO: update @urql/exchange-graphcache for this to work
        cache.updateQuery(FEED_QUERY, { first, skip, orderBy }, data => {
          data.feed.links.unshift(newLink);
          data.feed.count += 1;
          return data;
        });
      }
    }
  }
});

const subscriptionClient = new SubscriptionClient(
  "ws://localhost:4000",
  {}
);

const client = createClient({
  fetchOptions: () => {
    const token = localStorage.getItem(AUTH_TOKEN);
    return {
      headers: {
        authorization: token ? `Bearer ${token}` : ""
      }
    }
  },
  url: "http://localhost:4000",
  // suspense: true,
  exchanges: [
    dedupExchange,
    // suspenseExchange,
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

serviceWorker.unregister();
