import React from "react";
import { withRouter } from "react-router-dom";

import Accept from "../images/Accept.svg";
import NotAccept from "../images/Not_accept.svg";

function InfoTooltip(props) {

  React.useEffect(() => {
    if (props.isOpen) {
      function closeOnEsc(evt) {
        if (evt.key === "Escape" && props.registerSuccess) {
          props.history.push("/sign-in");
          props.onClose();
        } else {
          props.onClose();
        }
      }

      document.addEventListener('keydown', closeOnEsc);

      return () => {
        document.removeEventListener('keydown', closeOnEsc);
      }
    }
  }, [props.isOpen]);

  function onCloseButton() {
    if (props.registerSuccess) {
      props.history.push("/sign-in");
      props.onClose();
      return;
    }
    props.onClose();
  }

  return (
    <section
      className={`popup popup_type_${props.name} ${props.isOpen && ("popup_opened")}`}
    >
      <button
        className="popup__exit"
        type="button"
        onClick={onCloseButton}>
      </button>
      <div
        className="popup__container">
        <img
          className="popup__registration-img"
          src={props.registerSuccess ? Accept : NotAccept}
          alt="Регистрация"
        />
        <h3
          className="popup__title popup__title_type_registration">
            {props.registerSuccess ? props.popupTextAccept : props.popupTextError}
          </h3>
      </div>
    </section>
  )
}

export default withRouter(InfoTooltip);
