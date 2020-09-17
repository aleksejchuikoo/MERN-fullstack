import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import AuthContext from '../context/AuthContext';

function NavBar() {
  const history = useHistory(); // будем делать навигацию
  const auth = React.useContext(AuthContext);

  const logoutHandler = (e) => {
    e.preventDefault();
    auth.logout();
    history.push('/'); // redirect
  };

  return (
    <nav>
      <div className="nav-wrapper" style={{ padding: '0 2rem' }}>
        <span href="/" className="brand-logo">
          Сокращение ссылок
        </span>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li>
            <NavLink to="/create">Создать</NavLink>
          </li>
          <li>
            <NavLink to="/links">Ссылки</NavLink>
          </li>
          <li>
            <a href="#" onClick={logoutHandler}>
              Выйти
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
