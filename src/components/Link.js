import React from 'react';
import { useMutation } from 'urql';
import gql from 'graphql-tag';

import { timeDifferenceForDate } from '../dates';
import { getToken } from '../token';

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      link {
        id
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

const Link = ({ link, index }) => {
  const isLoggedIn = getToken();

  const [state, executeMutation] = useMutation(VOTE_MUTATION);

  const upvote = React.useCallback(() => {
    if (!state.fetching) {
      executeMutation({ linkId: link.id });
    }
  }, [state.fetching, link, executeMutation]);

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{index + 1}.</span>
        {isLoggedIn && (
          <div className="ml1 gray f11" onClick={upvote}>
            ▲
          </div>
        )}
      </div>
      <div className="ml1">
        <div>
          {link.description} ({link.url})
        </div>
        <div className="f6 lh-copy gray">
          {link.votes.length} votes | by{' '}
          {link.postedBy
            ? link.postedBy.name
            : 'Unknown'}{' '}
          {timeDifferenceForDate(link.createdAt)}
        </div>
      </div>
    </div>
  );
}

export default Link;
