import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { getToken, removeToken } from '../utils';

const Header = ({ history }) => {
  const authToken = getToken();
  return (
    <div className="flex pa1 justify-between nowrap orange">
      <div className="flex flex-fixed black">
        <div className="fw7 mr1">Hacker News</div>
        <Link to="/" className="ml1 no-underline black">
          new
        </Link>
        <div className="ml1">|</div>
        <Link to="/top" className="ml1 no-underline black">
          top
        </Link>
        <div className="ml1">|</div>
        <Link to="/search" className="ml1 no-underline black">
          search
        </Link>
        {authToken && (
          <div className="flex">
            <div className="ml1">|</div>
            <Link to="/create" className="ml1 no-underline black">
              submit
            </Link>
          </div>
        )}
      </div>
      <div className="flex flex-fixed">
        {authToken ? (
          <div
            className="ml1 pointer black"
            onClick={() => {
              removeToken();
              history.push('/');
            }}
          >
            logout
          </div>
        ) : (
            <Link to="/login" className="ml1 no-underline black">
              login
          </Link>
          )}
      </div>
    </div>
  );
}

export default withRouter(Header);