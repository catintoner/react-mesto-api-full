import React from "react";

import { Route, Switch, useHistory, withRouter } from "react-router-dom";

import Main from "./Main";
import Footer from "./Footer";

import Login from "./Login";
import Register from "./Register";

import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import InfoTooltip from "./InfoTooltip";

import ProtectedRoute from "./ProtectedRoute";

import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { CurrentCardContext } from "../contexts/CurrentCardContext";

import { api } from "../utils/Api";
import { auth } from "../utils/Auth";

function App() {

  const history = useHistory();

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isRegistrationPopupOpen, setIsRegistrationPopupOpen] = React.useState(false);

  const [selectedCard, setSelectedCard] = React.useState(null);

  const [currentUser, setCurrentUser] = React.useState({ name: "", about: "", avatar: "" });
  const [cards, setCards] = React.useState([]);

  const [registerSuccess, setRegisterSuccess] = React.useState(null);
  const [loggedIn, setLoggedIn] = React.useState(null);

  const [email, setEmail] = React.useState("");

  React.useEffect(() => {

    handleCheckToken();

    if (loggedIn) {
      Promise.all([
        api.getUserInfo(),
        api.getInitialCards()
      ])

        .then(([userInfo, cards]) => {
          setCurrentUser(userInfo);
          setCards(cards);
        })

        .catch((err) => {
          console.log(err);
        })
    }

  }, [loggedIn]);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function autoNotifiedRegistration() {
    setIsRegistrationPopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsRegistrationPopupOpen(false);
    setSelectedCard(null);
  }

  function handleCardClick(props) {
    setSelectedCard(props);
  }

  function onCardLike(props) {
    setCards(props);
  }

  function onTrashClick(props) {
    setCards(props);
  }

  function handleUpdateUser(userData) {
    api.setUserInfo(userData)

      .then((newUserInfo) => {
        setCurrentUser(newUserInfo);
        closeAllPopups();
      })

      .catch(err => {
        console.log(err);
      });
  }

  function handleUpdateAvatar(avatarLink) {
    api.editAvatar(avatarLink)

      .then((newUserInfo) => {
        setCurrentUser(newUserInfo);
        closeAllPopups();
      })

      .catch(err => {
        console.log(err);
      });
  }

  function handleAddPlace(newCard) {
    api.addNewCard(newCard)
      .then((newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      }))

      .catch(err => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    api.deleteCard(card.cardId)
      .then(() => {
        onTrashClick((state) => {
          return state.filter(item => item._id !== card.cardId);
        });
      })

      .catch(err => {
        console.log(err);
      })
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(item => item === currentUser._id);

    if (!isLiked) {
      api.addLike(card.cardId)

        .then((modifiedCard) => {

          onCardLike((state) => {

            return state.map(
              (c) => (
                c._id === card.cardId ? modifiedCard : c
              ))
          });
        })

        .catch(err => {
          console.log(err);
        })

    } else {

      api.removeLike(card.cardId)

        .then((modifiedCard) => {

          onCardLike((state) => {

            return state.map(
              (c) => (
                c._id === card.cardId ? modifiedCard : c
              ))
          });
        })

        .catch(err => {
          console.log(err);
        })
    }
  }

  function handleCheckToken() {
    const userId = localStorage.getItem("user");
    if (userId && userId !== null) {

      return auth.checkToken(userId)

        .then((res) => {
          setEmail(res.email);
          setLoggedIn(true);
          history.push("/");
        })

        .catch((err) => {
          console.log(err);
        })
    } else {
      setLoggedIn(false);
    }
  }

  function handleOutAccount() {
    localStorage.removeItem("user");
    setLoggedIn(false);
  }

  function handleLoginSubmit(email, password) {
    auth.login(email, password)

      .then(() => {
        setLoggedIn(true);
        history.push('/');
      })

      .catch((err) => {
        setRegisterSuccess(false);
        autoNotifiedRegistration();
        console.log(err);
      })
  }

  function handleRegistrationSubmit(email, password) {
    auth.registration(email, password)

      .then((res) => {
        if (res) {
          setRegisterSuccess(true);
          // autoNotifiedRegistration();
          history.push('/sign-in');
        }
      })

      .catch((err) => {
        setRegisterSuccess(false);
        autoNotifiedRegistration();
        console.log(err);
      })
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CurrentCardContext.Provider value={cards}>
        <div className="page">
          <div className="container">

            <Switch>

              <ProtectedRoute exact
                path="/"
                loggedIn={loggedIn}
                component={Main}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onTrashClick={handleCardDelete}
                cards={cards}
                email={email}
                onSignOut={handleOutAccount}
              >

              </ProtectedRoute>

              <Route path="/sign-in">
                <Login
                  email={email}
                  loggedIn={loggedIn}
                  handleLoginSubmit={handleLoginSubmit}
                />
              </Route>

              <Route path="/sign-up">
                <Register
                  email={email}
                  loggedIn={loggedIn}
                  handleRegistrationSubmit={handleRegistrationSubmit}
                />

              </Route>

            </Switch>
            {loggedIn && <Footer />}

            <InfoTooltip
              loggedIn={loggedIn}
              isOpen={isRegistrationPopupOpen}
              onClose={closeAllPopups}
              registerSuccess={registerSuccess}
              popupTextAccept="Вы успешно зарегистрировались!"
              popupTextError="Что-то пошло не так! Попробуйте еще раз."
              name="registration" />

            <ImagePopup
              card={selectedCard}
              onClose={closeAllPopups}
            />

            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
            />

            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
            />

            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              onAddPlace={handleAddPlace}
            />

          </div>
        </div>
      </CurrentCardContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);

{/* <section className="popup popup_type_delete-card">
<button className="popup__exit" type="button">
</button>
<form className="popup__container" name="delete-card" noValidate>
  <h3 className="popup__title popup__title_type_delete">
    Вы уверены?
  </h3>
  <button className="popup__submit-btn" type="submit">
    Да
  </button>
</form>
</section> */}
