import axios from 'axios';

function setDefaults(token) {
  axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
};

function setAuth(obj = {}) {
  localStorage.setItem('authentication', JSON.stringify(obj));
  setDefaults(obj.token);
};

function getAuth() {
  const auth = JSON.parse(localStorage.getItem('authentication'));
  if (auth) {
    setDefaults(auth.token);
    return auth;
  }
  return null;
};

function logout() {
  localStorage.removeItem('authentication');
};

async function createUser(user) {
  return axios({
    method: 'post',
    url: '/user/new',
    data: user,
  }).then(function (res) {
    console.log(res);
    setAuth({ token: res.data.token });
    return res.data.token;
  })
    .catch(function (err) {
      console.log(err);
    });

};

async function login(user) {
  console.log(user);
  return axios({
    method: 'post',
    url: '/user/login',
    data: user,
  }).then(function (res) {
    console.log(res);
    setAuth({ token: res.data.token });
    return res.data.token;
  })
    .catch(function (err) {
      console.log(err);
    });
};
export const API = {
  setDefaults,
  setAuth,
  getAuth,
  logout,
  createUser,
  login,
};
