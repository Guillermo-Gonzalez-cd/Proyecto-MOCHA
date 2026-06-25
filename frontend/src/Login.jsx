import { useState } from "react";
import "./Login.css";
import perroImg from "./assets/perro.png";

import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebookF, FaXTwitter } from "react-icons/fa6";

import { api } from "./api";

function Login({ onLogin, onNavigate }) {
  const [correo, setCorreo]       = useState("");
  const [password, setPassword]   = useState("");
  const [error, setError]         = useState("");
  const [cargando, setCargando]   = useState(false);
  const [socialMsg, setSocialMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!correo || !password) {
      setError("Completa correo y contraseña.");
      return;
    }

    setCargando(true);
    try {
      const data = await api.post("/login", { correo, password });
      localStorage.setItem("token", data.token);
      onLogin();
    } catch (err) {
      if (err.status === 401) {
        setError("Correo o contraseña incorrectos.");
      } else if (!err.status) {
        setError("No se pudo conectar con el servidor. ¿Está corriendo el backend?");
      } else {
        setError(err.message || "Error al iniciar sesión.");
      }
    } finally {
      setCargando(false);
    }
  };

  const handleSocial = (red) => {
    setSocialMsg(`El inicio de sesión con ${red} estará disponible próximamente.`);
    setTimeout(() => setSocialMsg(""), 3000);
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* PANEL IZQUIERDO */}
        <div className="left-panel">
          <h1 className="logo">Mocha</h1>
          <img src={perroImg} alt="Mascota" />
        </div>

        {/* PANEL DERECHO */}
        <div className="right-panel">
          <h2>Inicia sesión</h2>

          <p className="register-text">
            ¿Aún no eres miembro?{" "}
            <span onClick={() => onNavigate("registro")}>Regístrate ahora</span>
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Correo o nombre de usuario"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="login-error">{error}</p>}

            <div className="remember">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Mantener iniciada la sesión</label>
            </div>

            <button type="submit" className="login-btn" disabled={cargando}>
              {cargando ? "Iniciando..." : "Iniciar sesión"}
            </button>
          </form>

          <a href="#" className="forgot">¿Olvidaste tu contraseña?</a>

          {socialMsg && <p className="social-pronto">{socialMsg}</p>}

          <p className="social-title">O inicia sesión con</p>

          <div className="socials">
            <button type="button" onClick={() => handleSocial("Google")}   title="Google">
              <FcGoogle />
            </button>
            <button type="button" onClick={() => handleSocial("Apple")}    title="Apple">
              <FaApple />
            </button>
            <button type="button" onClick={() => handleSocial("Facebook")} title="Facebook">
              <FaFacebookF />
            </button>
            <button type="button" onClick={() => handleSocial("X")}        title="X (Twitter)">
              <FaXTwitter />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
