import React from "react";

import { withRouter } from "react-router-dom";

import Header from "./Header";

function Login(props) {

  const [email, setNewEmail] = React.useState("");
  const [password, setNewPassword] = React.useState("");

  function handleEmailChange(evt) {
    setNewEmail(evt.target.value);
  }

  function handlePasswordChange(evt) {
    setNewPassword(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    props.handleLoginSubmit(email, password);
  }

  return (
    <>
      <Header
        loggedIn={props.loggedIn}
        email={props.email}
        textButton="Регистрация"
        redirect="/sign-up"
      >

      </Header>
      <form
        className="sign__container"
        name="login-form"
        onSubmit={handleSubmit}
      >
        <h3 className="sign__title">
          Вход
        </h3>

        <input
          className="sign__input"
          id="login"
          name="login"
          type="email"
          placeholder="Email"
          required
          autoComplete="off"
          value={email}
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
          value={password}
          onChange={handlePasswordChange}
        />

        <button
          className="sign__button-submit"
          type="submit">
          Войти
        </button>
      </form>
    </>
  )
}

export default withRouter(Login);
