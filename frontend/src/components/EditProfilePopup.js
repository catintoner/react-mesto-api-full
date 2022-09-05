import React from "react";

import PopupWithForm from "./PopupWithForm";

import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup(props) {

  const currentUser = React.useContext(CurrentUserContext);

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, props.isOpen]);

  function handleNameChange(evt) {
    setName(evt.target.value);
  }

  function handleDescriptionChange(evt) {
    setDescription(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    props.onUpdateUser({
      name,
      about: description
    })
  }

  return (
    <PopupWithForm
      name="edit-profile"
      title="Редактировать профиль"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      buttonSubmitText="Сохранить"
    >
      <>
        <input
          className="popup__input"
          id="profile-name"
          name="name"
          minLength="2"
          maxLength="40"
          type="text"
          placeholder="Имя"
          required
          autoComplete="off"
          value={name}
          onChange={handleNameChange}
        />

        <span className="popup__error profile-name-error">
        </span>

        <input
          className="popup__input"
          id="profile-about"
          name="about"
          minLength="2"
          maxLength="200"
          type="text"
          placeholder="О себе"
          required
          autoComplete="off"
          value={description}
          onChange={handleDescriptionChange}
        />
        <span className="popup__error profile-about-error">
        </span>
      </>
    </PopupWithForm>
  )

}

export default EditProfilePopup;
