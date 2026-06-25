// URL base del backend. En desarrollo Express corre en 3000 y Vite en 5174.
export const BASE_URL = "http://localhost:3000";

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

// Sube un archivo de imagen para una mascota especifica.
// No usamos request() porque ese fuerza JSON; aqui usamos FormData
// y dejamos que el navegador ponga el Content-Type (multipart) solo.
async function uploadFoto(mascotaId, archivo) {
  const token = getToken();

  const formData = new FormData();
  formData.append("foto", archivo);

  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/mascotas/${mascotaId}/foto`, {
    method: "POST",
    headers, // sin Content-Type: el navegador lo define junto con el boundary
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || "Error al subir la foto");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data; // { status, message, foto: "/uploads/mascotas/archivo.jpg" }
}

// Convierte una ruta relativa de foto (ej: "/uploads/mascotas/x.jpg")
// en una URL completa que el navegador pueda cargar.
// Si ya es una URL completa (http...) o esta vacia, la deja igual.
export function urlFoto(foto) {
  if (!foto) return null;
  if (foto.startsWith("http://") || foto.startsWith("https://")) return foto;
  return `${BASE_URL}${foto}`;
}

// Métodos exportados
export const api = {
  get:    (path)        => request("GET",    path),
  post:   (path, body)  => request("POST",   path, body),
  put:    (path, body)  => request("PUT",    path, body),
  delete: (path)        => request("DELETE", path),
  uploadFoto,
};
