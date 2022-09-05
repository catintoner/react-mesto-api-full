import React from "react";

function ImagePopup({ card, onClose }) {

  React.useEffect(() => {
    if (card) {
      function closeOnEsc(evt) {
        console.log(evt.key);
        if (evt.key === "Escape") {
          onClose();
        }
      }

    document.addEventListener('keydown', closeOnEsc);

    return () => {
      document.removeEventListener('keydown', closeOnEsc);
    }
  }}, [card]);

  return (
    <section className={`popup popup_type_picture ${card ? ("popup_opened") : ""}`}>
      <button
        className="popup__exit popup__exit_type_picture"
        type="button"
        onClick={onClose}
        >
      </button>
      <figure className="popup__figure">
        <img className="popup__image" src={card ? (card.link) : "#"} alt={card ? (card.name) : ""} />
        <figcaption className="popup__caption">
        {card ? (card.name) : ""}
        </figcaption>
      </figure>
    </section>
  );
}

export default ImagePopup;
