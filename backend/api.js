// URL base del backend. En desarrollo Express corre en 3000 y Vite en 5174.
const BASE_URL = "http://localhost:3000";

// Recupera el token guardado en localStorage
function getToken() {
  return localStorage.getItem("token");
}

// Decodifica el payload del JWT sin librerías externas
export function getUsuarioActual() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload; // { id, correo, rol, nombre (si viene), iat, exp }
  } catch {
    return null;
  }
}

// Cierra sesión eliminando el token
export function cerrarSesion() {
  localStorage.removeItem("token");
}

// Función base para todas las peticiones
async function request(method, path, body) {
  const token = getToken();

  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const config = { method, headers };
  if (body !== undefined) config.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, config);

  // Para respuestas 204 (sin contenido) no intentamos parsear JSON
  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || "Error en la petición");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Métodos exportados
export const api = {
  get:    (path)        => request("GET",    path),
  post:   (path, body)  => request("POST",   path, body),
  put:    (path, body)  => request("PUT",    path, body),
  delete: (path)        => request("DELETE", path),
};
