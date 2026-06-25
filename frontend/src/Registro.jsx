import { useState } from "react";
import "./Registro.css";
import perroImg from "./assets/perro.png";
import { api } from "./api";

function Registro({ onRegistro, onNavigate }) {
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    password: "",
    confirmar: "",
  });
  const [error, setError]     = useState("");
  const [cargando, setCargando] = useState(false);

  const cambiar = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.nombre || !form.correo || !form.password) {
      setError("Nombre, correo y contraseña son obligatorios.");
      return;
    }

    if (form.password !== form.confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);
    try {
      await api.post("/register", {
        nombre:   form.nombre,
        correo:   form.correo,
        password: form.password,
        telefono: form.telefono || undefined,
      });

      // Después del registro iniciamos sesión automáticamente
      const loginData = await api.post("/login", {
        correo:   form.correo,
        password: form.password,
      });
      localStorage.setItem("token", loginData.token);
      onRegistro();
    } catch (err) {
      if (err.data?.message) {
        setError(err.data.message);
      } else if (!err.status) {
        setError("No se pudo conectar con el servidor.");
      } else {
        setError("Error al registrarse. Intenta de nuevo.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card registro-card">

        {/* PANEL IZQUIERDO */}
        <div className="left-panel">
          <h1 className="logo">Mocha</h1>
          <img src={perroImg} alt="Mascota" />
        </div>

        {/* PANEL DERECHO */}
        <div className="right-panel">
          <h2>Crear cuenta</h2>

          <p className="register-text">
            ¿Ya tienes cuenta?{" "}
            <span onClick={() => onNavigate("login")}>Inicia sesión</span>
          </p>

          <form onSubmit={handleSubmit} className="registro-form">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              value={form.nombre}
              onChange={cambiar}
            />

            <input
              type="email"
              name="correo"
              placeholder="Correo electrónico"
              value={form.correo}
              onChange={cambiar}
            />

            <input
              type="text"
              name="telefono"
              placeholder="Teléfono (opcional)"
              value={form.telefono}
              onChange={cambiar}
            />

            <div className="registro-row">
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={cambiar}
              />

              <input
                type="password"
                name="confirmar"
                placeholder="Confirmar contraseña"
                value={form.confirmar}
                onChange={cambiar}
              />
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-btn" disabled={cargando}>
              {cargando ? "Registrando..." : "Crear cuenta"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Registro;
