import React from "react";

import PopupWithForm from "./PopupWithForm";

function AddPlacePopup(props) {

  const [place, setPlace] = React.useState("");
  const [link, setLink] = React.useState("");

  function handleAddPlace(evt) {
    setPlace(evt.target.value);
  }

  function handleAddLink(evt) {
    setLink(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    props.onAddPlace({
      name: place,
      link
    })
  }

  return (
    <PopupWithForm
      name="add-card"
      title="Новое место"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      buttonSubmitText="Создать"
    >

      <input className="popup__input"
        id="place" name="name"
        type="text"
        minLength="2"
        maxLength="30"
        placeholder="Название"
        required
        autoComplete="off"
        value={place}
        onChange={handleAddPlace}
      />

      <span className="popup__error place-error">
      </span>

      <input className="popup__input"
        id="link" name="link"
        type="url"
        placeholder="Ссылка на картинку"
        required
        autoComplete="off"
        value={link}
        onChange={handleAddLink}
      />

      <span className="popup__error link-error">
      </span>

    </PopupWithForm>
  )
}

export default AddPlacePopup;
