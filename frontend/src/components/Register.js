import React from "react";

import { Link, withRouter } from "react-router-dom";

import Header from "./Header";

function Register(props) {

  const [newEmail, setNewEmail] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  function handleEmailChange(evt) {
    setNewEmail(evt.target.value);
  }

  function handlePasswordChange(evt) {
    setNewPassword(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    props.handleRegistrationSubmit(newEmail, newPassword);
  }

  return (
    <>
      <Header
        loggedIn={props.loggedIn}
        email={props.email}
        textButton="Войти"
        redirect="/sign-in"
      >

      </Header>
      <form
        className="sign__container"
        name="login-form"
        onSubmit={handleSubmit}
      >
        <h3 className="sign__title">
          Регистрация
        </h3>

        <input
          className="sign__input"
          id="login"
          name="login"
          type="email"
          placeholder="Email"
          required
          autoComplete="off"
          value={newEmail}
          onChange={handleEmailChange}
        />

        <input
          className="sign__input"
          id="password"
          name="password"
          type="password"
          placeholder="Пароль"
          required
          autoComplete="off"
          value={newPassword}
          onChange={handlePasswordChange}
        />

        <button
          className="sign__button-submit"
          type="submit">
          Зарегистрироваться
        </button>
      </form>
      <p
        className="sign__caption">
        Уже зарегистрированы?
        <Link
          to="/sign-in"
          className="sign__link"
        > Войти</Link>
      </p>
    </>
  )
}


export default withRouter(Register);
