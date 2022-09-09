class Auth {
  constructor(options) {
    this._baseUrl = options.baseUrl;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(`Ошибка: ${res.status}`);
  }

  registration(email, password) {
    return fetch(`${this._baseUrl}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    })
      .then(this._checkResponse)

      .then((res) => {
        return res;
      })
  }

  login(email, password) {
    return fetch(`${this._baseUrl}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    })
    .then(this._checkResponse)

    .then(((res) => {
      localStorage.setItem("user", res);
    }))
  }

  checkToken(userId) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${userId}`
      },
      credentials: 'include'
    })

    .then(this._checkResponse)
  }
}

export const auth = new Auth({
  baseUrl: `http://localhost:3001`
})
