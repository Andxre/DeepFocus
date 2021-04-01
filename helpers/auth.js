export function checkAuth() {
  if (JSON.parse(localStorage.getItem("currentUser"))) {
    return true;
  }
  return false;
}

export async function login(username, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  };

  await fetch("/auth/login", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

export function logout() {
  localStorage.removeItem("currentUser");
}

export function register(username, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  };

  return fetch("/register", requestOptions).then((response) => {
    return response.data;
  });
}

export function authHeader() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user && user.access_token) {
    return "Bearer " + user.access_token;
  } else {
    return {};
  }
}
