import { useState, useEffect } from "react";
import "./Home.css";
import mochaLogo from "./assets/logo3.png";
import Sidebar from "./Sidebar";

import {
  FaSyringe,
  FaStethoscope,
  FaCheckCircle,
  FaHeartbeat,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdOutlineAnalytics } from "react-icons/md";
import { BsRobot } from "react-icons/bs";

import { api, urlFoto } from "./api";
import ModalMascota from "./ModalMascota";

function Home({ onNavigate, onLogout, usuario }) {
  const [mascotas, setMascotas]   = useState([]);
  const [busqueda, setBusqueda]   = useState("");
  const [cargando, setCargando]   = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);

  const nombre = usuario?.nombre || usuario?.correo || "Usuario";
  // Saludo según hora
  const hora = new Date().getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";

  useEffect(() => {
    cargarMascotas();
  }, []);

  const cargarMascotas = async () => {
    setCargando(true);
    try {
      const data = await api.get("/mascotas");
      setMascotas(data.data || data || []);
    } catch {
      setMascotas([]);
    } finally {
      setCargando(false);
    }
  };

  const mascotasFiltradas = mascotas.filter((m) =>
    m.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="home">
      <Sidebar activo="home" onNavigate={onNavigate} onLogout={onLogout} usuario={usuario} />

      <main className="main-content">

        {/* TOP BAR */}
        <div className="top-bar">
          <div>
            <h1>{saludo}, {nombre}</h1>
            <p>Bienvenido de nuevo a Mocha</p>
          </div>

          <input
            type="text"
            placeholder="Buscar mascota..."
            className="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* RESUMEN DEL DIA */}
        <section className="hero-card">
          <div className="hero-text">
            <h2>Resumen del día</h2>
            <ul className="hero-list">
              <li><FaSyringe /> Tienes vacunas próximas esta semana.</li>
              <li><FaStethoscope /> Revisa las citas programadas en tu agenda.</li>
              <li><FaCheckCircle /> Mantén el historial de tus mascotas al día.</li>
            </ul>
            <button className="hero-btn" onClick={() => onNavigate("agenda")}>
              Ver detalles
            </button>
          </div>

          <img src={mochaLogo} alt="Mocha" className="hero-mascot" />
        </section>

        {/* MIS MASCOTAS */}
        <section className="pets-section">
          <div className="section-header">
            <h2>Mis Mascotas</h2>
            <button className="add-pet-btn" onClick={() => setModalAbierto(true)}>
              + Agregar Mascota
            </button>
          </div>

          {cargando ? (
            <p style={{ color: "#777", marginTop: 16 }}>Cargando mascotas...</p>
          ) : mascotasFiltradas.length === 0 ? (
            <p style={{ color: "#777", marginTop: 16 }}>
              {busqueda ? "No se encontraron mascotas con ese nombre." : "Aún no tienes mascotas registradas."}
            </p>
          ) : (
            <div className="pets-grid">
              {mascotasFiltradas.slice(0, 3).map((m) => (
                <div className="pet-card" key={m.id}>
                  <img
                    src={urlFoto(m.foto) || `https://placedog.net/500/300?id=${m.id}`}
                    alt={m.nombre}
                    onError={(e) => {
                      e.target.src = `https://placedog.net/500/300?id=${m.id}`;
                    }}
                  />
                  <div className="pet-info">
                    <h3>{m.nombre}</h3>
                    <p>{m.especie} — {m.raza || "Sin raza"}</p>
                    <div className="pet-details">
                      <span>{m.edad ? `${m.edad} años` : "Edad desconocida"}</span>
                      <span>{m.peso ? `${m.peso} kg` : ""}</span>
                    </div>
                    <button onClick={() => onNavigate("mascotas")}>Ver Perfil</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ACCESOS RAPIDOS */}
        <section className="quick-access">
          <div className="quick-card" onClick={() => onNavigate("reportes")}>
            <MdOutlineAnalytics />
            <span>Reportes</span>
          </div>

          <div className="quick-card" onClick={() => onNavigate("salud")}>
            <FaHeartbeat />
            <span>Historial Médico</span>
          </div>

          <div className="quick-card" onClick={() => onNavigate("agenda")}>
            <FaCalendarAlt />
            <span>Agenda</span>
          </div>

          <div className="quick-card">
            <BsRobot />
            <span>Mocha IA</span>
          </div>
        </section>

      </main>

      {modalAbierto && (
        <ModalMascota
          onCerrar={() => setModalAbierto(false)}
          onGuardado={() => { setModalAbierto(false); cargarMascotas(); }}
        />
      )}
    </div>
  );
}

export default Home;
