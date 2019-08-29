import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import App from './components/App'
import * as serviceWorker from './serviceWorker'
import { SubscriptionClient } from "subscriptions-transport-ws";
import {
  Provider,
  createClient,
  fetchExchange,
  dedupExchange,
  subscriptionExchange
} from "urql";
import { cacheExchange } from '@urql/exchange-graphcache'
import { suspenseExchange } from '@urql/exchange-suspense'
import { BrowserRouter } from 'react-router-dom'
import { AUTH_TOKEN, LINKS_PER_PAGE } from './constants'
import { FEED_QUERY } from './components/LinkList';

const cache = cacheExchange({
  keys: {
    Feed: data => data.id || data._id || null,
    Link: data => data.id || data._id || null
  },
  updates: {
    Mutation: {
      post: (result, args, cache) => {
        // This doesn't seem needed...
        // const first = LINKS_PER_PAGE
        // const skip = 0
        // const orderBy = 'createdAt_DESC'
        // cache.updateQuery(FEED_QUERY, { first, skip, orderBy }, data => {
        //   data.feed.links.unshift(post);
        //   return data;
        // });
      },
      vote: () => {
        // This doesn't seem needed...
        // _updateCacheAfterVote = (store, createVote, linkId) => {
        //   const isNewPage = this.props.location.pathname.includes("new");
        //   const page = parseInt(this.props.match.params.page, 10);
        //   const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
        //   const first = isNewPage ? LINKS_PER_PAGE : 100;
        //   const orderBy = isNewPage ? "createdAt_DESC" : null;
        //   const data = store.readQuery({
        //     query: FEED_QUERY,
        //     variables: { first, skip, orderBy }
        //   });
        //   const votedLink = data.feed.links.find(link => link.id === linkId);
        //   votedLink.votes = createVote.link.votes;
        //   store.writeQuery({ query: FEED_QUERY, data });
        // };
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
    suspenseExchange,
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
)
serviceWorker.unregister()
