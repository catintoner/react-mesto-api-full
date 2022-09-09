import React from "react";

import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {

  const avatarRef = React.useRef();

  function handleSubmit(evt) {
    evt.preventDefault();

    props.onUpdateAvatar({
      avatar: avatarRef.current.value
    });
  }

  return (
    <PopupWithForm
      name="edit-avatar"
      title="Обновить аватар"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      buttonSubmitText="Сохранить"
    >
      <>
        <input
          className="popup__input"
          id="avatar"
          name="avatar"
          type="url"
          placeholder="Ссылка на картинку"
          required
          autoComplete="off"
          ref={avatarRef}
        />
        <span className="popup__error avatar-error">
        </span>
      </>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;
