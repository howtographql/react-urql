import React from 'react';
import { useMutation } from 'urql';
import gql from 'graphql-tag';
import { AUTH_TOKEN } from "../constants";

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const Login = ({ history }) => {
  const [login, setLogin] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');

  const [{ fetching }, executeMutation] = useMutation(login ? LOGIN_MUTATION : SIGNUP_MUTATION);

  const mutate = React.useCallback(() => {
    executeMutation({ email, password, name }).then(({ data }) => {
      const { token } = login ? data.login : data.signup;
      localStorage.setItem(AUTH_TOKEN, token);
      history.push(`/`);
    });
  }, [email, password, name, executeMutation, history, login]);

  return (
    <div>
      <h4 className="mv3">{login ? "Login" : "Sign Up"}</h4>
      <div className="flex flex-column">
        {!login && (
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            type="text"
            placeholder="Your name"
          />
        )}
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="text"
          placeholder="Your email address"
        />
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          placeholder="Choose a safe password"
        />
      </div>
      <div className="flex mt3">
        <button
          type="button"
          className="pointer mr2 button"
          onClick={mutate}
          disabled={fetching}
        >
          {login ? "login" : "create account"}
        </button>
        <button
          type="button"
          className="pointer button"
          onClick={() => setLogin(!login)}
        >
          {login ? "need to create an account?" : "already have an account?"}
        </button>
      </div>
    </div>
  );
}

export default Login;
