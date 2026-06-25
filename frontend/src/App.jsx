import React, { useState, useEffect } from "react";
import logoMocha from "./assets/logo1.png";
import "./App.css";
import Login from "./Login";
import Registro from "./Registro";
import Home from "./Home";
import MisMascotas from "./MisMascotas";
import Agenda from "./Agenda";
import Salud from "./Salud";
import Admin from "./Admin";
import { getUsuarioActual, cerrarSesion } from "./api";
import Beneficios   from "./Beneficios";
import Veterinarias from "./Veterinarias";
import Reportes     from "./Reportes";
import Ajustes      from "./Ajustes";

function App() {
  const [pantallaActual, setPantallaActual] = useState("inicio");
  const [usuario, setUsuario] = useState(null);

  // Al arrancar, revisar si ya hay un token válido guardado
  useEffect(() => {
    const u = getUsuarioActual();
    if (u) {
      setUsuario(u);
      setPantallaActual("home");
    }
  }, []);

  const handleLogin = () => {
    const u = getUsuarioActual();
    setUsuario(u);
    setPantallaActual("home");
  };

  const handleLogout = () => {
    cerrarSesion();
    setUsuario(null);
    setPantallaActual("inicio");
  };

  const navegar = (pantalla) => setPantallaActual(pantalla);

  // Props comunes para todas las vistas internas
  const navProps = { onNavigate: navegar, onLogout: handleLogout, usuario };

  if (pantallaActual === "home")          return <Home         {...navProps} />;
  if (pantallaActual === "mascotas")      return <MisMascotas  {...navProps} />;
  if (pantallaActual === "agenda")        return <Agenda       {...navProps} />;
  if (pantallaActual === "salud")         return <Salud        {...navProps} />;
  if (pantallaActual === "admin")         return <Admin        {...navProps} />;
  if (pantallaActual === "beneficios")    return <Beneficios   {...navProps} />;
  if (pantallaActual === "veterinarias")  return <Veterinarias {...navProps} />;
  if (pantallaActual === "reportes")      return <Reportes     {...navProps} />;
  if (pantallaActual === "ajustes")       return <Ajustes      {...navProps} />;

  if (pantallaActual === "login") {
    return <Login onLogin={handleLogin} onNavigate={navegar} />;
  }

  if (pantallaActual === "registro") {
    return <Registro onRegistro={handleLogin} onNavigate={navegar} />;
  }

  return (
    <div className="pantalla-inicio">
      <div className="logo-contenedor">
        <img src={logoMocha} alt="Mocha Logo" className="logo" />
      </div>

      <div className="contenido-inferior">
        <p className="subtitulo">
          Confían en <span className="texto-amarillo">ti</span>,
          nosotros te <span className="texto-amarillo">ayudamos</span>
        </p>

        <button
          className="boton-empezar"
          onClick={() => setPantallaActual("login")}
        >
          Empezar
        </button>
      </div>
    </div>
  );
}

export default App;
