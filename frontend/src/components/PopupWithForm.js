import React from "react";

function PopupWithForm(props) {

  React.useEffect(() => {
    if (props.isOpen) {
      function closeOnEsc(evt) {
        if (evt.key === "Escape") {
          props.onClose();
        }
      }

      document.addEventListener('keydown', closeOnEsc);

      return () => {
        document.removeEventListener('keydown', closeOnEsc);
      }
    }
  }, [props.isOpen]);

  return (
    <section
      className={`popup popup_type_${props.name} ${props.isOpen ? ("popup_opened") : ""}`}
    >
      <button
        className="popup__exit"
        type="button"
        onClick={props.onClose}>
      </button>
      <form className="popup__container"
        name={props.name}
        onSubmit={props.onSubmit}
      >
        <h3 className="popup__title">
          {props.title}
        </h3>

        {props.children}

        <button className="popup__submit-btn"
          type="submit"
        >
          {props.buttonSubmitText}
        </button>

      </form>
    </section>
  );
}

export default PopupWithForm;
