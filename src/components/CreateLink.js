import React from 'react';
import { useMutation } from 'urql';
import gql from 'graphql-tag';
import usePreviousValue from '../hooks/usePreviousValue';

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`

const CreateLink = ({ history }) => {
  const [description, setDescription] = React.useState("");
  const [url, setUrl] = React.useState('');
  const [state, executeMutation] = useMutation(POST_MUTATION);
  const prevFetching = usePreviousValue(state.fetching);

  React.useEffect(() => {
    if (state.fetching === false && prevFetching === true) {
      history.push('/new/1');
    }
  }, [state.fetching, prevFetching, history]);

  const postMutation = React.useCallback(() => {
    executeMutation({ url, description });
  }, [url, description, executeMutation]);

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
      <button onClick={postMutation}>Submit</button>
    </div>
  );
}

export default CreateLink;
