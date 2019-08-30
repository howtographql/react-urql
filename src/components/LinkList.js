import React, { Fragment } from 'react';
import { useQuery, useSubscription } from 'urql';
import gql from 'graphql-tag';
import { LINKS_PER_PAGE } from '../constants';
import Link from './Link';

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      links {
        id
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
        createdAt
      }
      count
    }
  }
`;

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      id
      url
      description
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
      createdAt
    }
  }
`;

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

const LinkList = ({ location, match, history }) => {
  const isNewPage = location.pathname.includes('new');

  const variables = React.useMemo(() => {
    const page = parseInt(match.params.page, 10);

    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const first = isNewPage ? LINKS_PER_PAGE : 100;
    const orderBy = isNewPage ? 'createdAt_DESC' : null;
    return { first, skip, orderBy };
  }, [match, isNewPage]);

  const [{ data, error, fetching }] = useQuery({
    query: FEED_QUERY,
    variables,
  });

  useSubscription({ query: NEW_VOTES_SUBSCRIPTION });
  useSubscription({ query: NEW_LINKS_SUBSCRIPTION });

  const linksToRender = React.useMemo(() => {
    if (fetching) return [];
    if (isNewPage) return data.feed.links;
    const rankedLinks = data.feed.links.slice();
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
    return rankedLinks;
  }, [data, fetching, isNewPage]);

  const nextPage = React.useCallback(() => {
    const page = parseInt(match.params.page, 10);
    if (page <= data.feed.count / LINKS_PER_PAGE) {
      const nextPage = page + 1;
      history.push(`/new/${nextPage}`);
    }
  }, [data, history, match.params]);

  const previousPage = React.useCallback(() => {
    const page = parseInt(match.params.page, 10);
    if (page > 1) {
      const previousPage = page - 1;
      history.push(`/new/${previousPage}`);
    }
  }, [match, history]);

  if (fetching) return <div>Fetching</div>;
  if (error) return <div>Error</div>;

  const pageIndex =match.params.page
    ? (match.params.page - 1) * LINKS_PER_PAGE
    : 0;

  return (
    <Fragment>
      {linksToRender.map((link, index) => (
        <Link
          key={link.id}
          link={link}
          index={index + pageIndex}
        />
      ))}
      {isNewPage && (
        <div className="flex ml4 mv3 gray">
          <div className="pointer mr2" onClick={previousPage}>
            Previous
          </div>
          <div className="pointer" onClick={nextPage}>
            Next
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default LinkList;
