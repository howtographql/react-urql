import React from 'react';
import { useMutation } from 'urql';
import gql from 'graphql-tag';

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
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
    }
  }
`;

const CreateLink = props => {
  const [description, setDescription] = React.useState('');
  const [url, setUrl] = React.useState('');

  const [state, executeMutation] = useMutation(POST_MUTATION);

  const postMutation = React.useCallback(() => {
    executeMutation({ url, description }).then(() => {
      props.history.push('/new/1');
    });
  }, [url, description, executeMutation, props.history]);

  return (
    <div>
      <div className="flex flex-column mt3">
        <input
          className="mb2"
          value={description}
          onChange={e => setDescription(e.target.value)}
          type="text"
          placeholder="A description for the link"
        />
        <input
          className="mb2"
          value={url}
          onChange={e => setUrl(e.target.value)}
          type="text"
          placeholder="The URL for the link"
        />
      </div>
      <button
        disabled={state.fetching}
        onClick={postMutation}
      >
        Submit
      </button>
    </div>
  );
};

export default CreateLink;
