import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Logo from '../images/Logo.png';

function Header(props) {

  return (
    <header className="header">
      <img className="header__logo" src={Logo} alt="Логотип" />
      {props.loggedIn && <p className="header__user-email">{props.email}</p>}
      {props.loggedIn ?

        <Link
        to={props.redirect}
          className="header__button header__button_type_logg-out"
          type="button"
          onClick={props.onSignOut}
        >
          {props.textButton}
        </Link> :

        <Link
          to={props.redirect}
          className="header__button"
        >
          {props.textButton}
        </Link>}
    </header>
  );
}

export default withRouter(Header);
