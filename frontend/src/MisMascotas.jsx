import { useState, useEffect, useRef } from "react";
import "./MisMascotas.css";
import Sidebar from "./Sidebar";
import ModalMascota from "./ModalMascota";

import {
  FaPaw,
  FaSearch,
  FaPlus,
  FaEllipsisH,
  FaHeartbeat,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdPets } from "react-icons/md";
import { BsRobot } from "react-icons/bs";

import { api, urlFoto } from "./api";

const FILTERS = ["Todas", "Perros", "Gatos", "Conejos", "Aves", "Otros"];

const STATUS_CLASS = {
  Excelente: "status-excelente",
  Atención:  "status-atencion",
  Bueno:     "status-bueno",
};

// Devuelve un estado de salud visual basado en campos de la mascota
function calcularEstado(mascota) {
  return mascota.estado || "Bueno";
}

function MisMascotas({ onNavigate, onLogout, usuario }) {
  const [mascotas, setMascotas]         = useState([]);
  const [cargando, setCargando]         = useState(true);
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [search, setSearch]             = useState("");
  const [menuAbierto, setMenuAbierto]   = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mascotaEditar, setMascotaEditar] = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    cargarMascotas();
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const cerrar = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAbierto(null);
      }
    };
    document.addEventListener("mousedown", cerrar);
    return () => document.removeEventListener("mousedown", cerrar);
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

  const abrirAgregar = () => {
    setMascotaEditar(null);
    setModalAbierto(true);
  };

  const abrirEditar = (mascota) => {
    setMascotaEditar(mascota);
    setMenuAbierto(null);
    setModalAbierto(true);
  };

  const pedirEliminar = (mascota) => {
    setConfirmarEliminar(mascota);
    setMenuAbierto(null);
  };

  const eliminarMascota = async () => {
    if (!confirmarEliminar) return;
    try {
      await api.delete(`/mascotas/${confirmarEliminar.id}`);
      setConfirmarEliminar(null);
      cargarMascotas();
    } catch {
      setConfirmarEliminar(null);
    }
  };

  const filtradas = mascotas.filter((m) => {
    const especie = m.especie?.toLowerCase() || "";
    const matchFilter =
      activeFilter === "Todas" ||
      (activeFilter === "Perros"  && especie === "perro")  ||
      (activeFilter === "Gatos"   && especie === "gato")   ||
      (activeFilter === "Conejos" && especie === "conejo") ||
      (activeFilter === "Aves"    && especie === "ave")    ||
      (activeFilter === "Otros"   && !["perro","gato","conejo","ave"].includes(especie));
    const matchSearch = m.nombre?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total:      mascotas.length,
    excelente:  mascotas.filter((m) => calcularEstado(m) === "Excelente").length,
    atencion:   mascotas.filter((m) => calcularEstado(m) === "Atención").length,
    recordatorios: 0,
  };

  return (
    <div className="home">
      <Sidebar activo="mascotas" onNavigate={onNavigate} onLogout={onLogout} usuario={usuario} />

      <main className="main-content">

        {/* TOP BAR */}
        <div className="mp-top-bar">
          <div className="mp-title">
            <FaPaw className="mp-title-icon" />
            <div>
              <h1>Mis Mascotas</h1>
              <p>Administra y cuida a cada miembro de tu familia</p>
            </div>
          </div>

          <button className="add-pet-btn" onClick={abrirAgregar}>
            <FaPlus /> Agregar mascota
          </button>
        </div>

        {/* STAT CARDS */}
        <section className="stats-grid">
          <div className="stat-card stat-purple">
            <div>
              <strong>{stats.total}</strong>
              <p>Mascotas registradas</p>
            </div>
            <MdPets className="stat-icon" />
          </div>

          <div className="stat-card stat-green">
            <div>
              <strong>{stats.excelente}</strong>
              <p>Excelente salud</p>
            </div>
            <FaHeartbeat className="stat-icon" />
          </div>

          <div className="stat-card stat-orange">
            <div>
              <strong>{stats.atencion}</strong>
              <p>Atención requerida</p>
            </div>
            <FaHeartbeat className="stat-icon" />
          </div>

          <div className="stat-card stat-red">
            <div>
              <strong>{stats.recordatorios}</strong>
              <p>Recordatorios hoy</p>
            </div>
            <FaCalendarAlt className="stat-icon" />
          </div>
        </section>

        {/* BUSCADOR Y FILTROS */}
        <section className="search-filter-bar">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Buscar mascota..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-pills">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`filter-pill${activeFilter === f ? " active" : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </section>

        {/* GRID DE MASCOTAS */}
        <section className="pets-grid mp-pets-grid">
          {cargando ? (
            <p style={{ color: "#777" }}>Cargando mascotas...</p>
          ) : filtradas.length === 0 ? (
            <p style={{ color: "#777" }}>
              {search ? "No se encontraron resultados." : "No tienes mascotas registradas aún."}
            </p>
          ) : (
            filtradas.map((mascota) => {
              const estado = calcularEstado(mascota);
              const estadoClass = STATUS_CLASS[estado] || "status-bueno";

              return (
                <div className="pet-card mp-pet-card" key={mascota.id}>
                  <div className="mp-pet-image-wrap">
                    <img
                      src={urlFoto(mascota.foto) || `https://placedog.net/500/300?id=${mascota.id}`}
                      alt={mascota.nombre}
                      onError={(e) => { e.target.src = `https://placedog.net/500/300?id=${mascota.id}`; }}
                    />
                    <span className={`mp-status-dot ${estadoClass}`} />
                  </div>

                  <div className="pet-info">
                    <h3>{mascota.nombre}</h3>
                    <p>{mascota.raza || mascota.especie}</p>

                    <div className="mp-pet-meta">
                      {mascota.edad   && <span>{mascota.edad} años</span>}
                      {mascota.peso   && <span>{mascota.peso} kg</span>}
                      {mascota.sexo   && <span>{mascota.sexo}</span>}
                    </div>

                    <span className={`mp-status-badge ${estadoClass}`}>{estado}</span>

                    <div className="mp-pet-actions" ref={menuAbierto === mascota.id ? menuRef : null}>
                      <button onClick={() => onNavigate("salud")}>Historial</button>
                      <button onClick={() => onNavigate("agenda")}>Agenda</button>

                      <div className="mp-menu-wrap">
                        <button
                          className="mp-more-btn"
                          onClick={() =>
                            setMenuAbierto(menuAbierto === mascota.id ? null : mascota.id)
                          }
                        >
                          <FaEllipsisH />
                        </button>

                        {menuAbierto === mascota.id && (
                          <div className="mp-dropdown">
                            <button onClick={() => abrirEditar(mascota)}>Editar</button>
                            <button
                              className="mp-dropdown-danger"
                              onClick={() => pedirEliminar(mascota)}
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Tarjeta de agregar */}
          <div className="mp-add-card" onClick={abrirAgregar}>
            <div className="mp-add-icon"><FaPlus /></div>
            <h3>Agregar nueva mascota</h3>
            <p>Registra un nuevo miembro a tu familia</p>
          </div>
        </section>

        {/* PANEL MOCHA IA */}
        <section className="mp-bottom-grid">
          <div className="mp-ia-card">
            <BsRobot className="mp-ia-icon" />
            <div className="mp-ia-text">
              <h3>
                Mocha IA <span className="mp-premium-tag">PREMIUM</span>
              </h3>
              <p>El análisis inteligente de tus mascotas estará disponible próximamente.</p>
              <button className="mp-ia-btn" disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>
                Próximamente
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* MODAL CREAR / EDITAR */}
      {modalAbierto && (
        <ModalMascota
          mascota={mascotaEditar}
          onCerrar={() => setModalAbierto(false)}
          onGuardado={() => { setModalAbierto(false); cargarMascotas(); }}
        />
      )}

      {/* CONFIRMACION ELIMINAR */}
      {confirmarEliminar && (
        <div className="modal-overlay" onClick={() => setConfirmarEliminar(null)}>
          <div className="modal-box confirmar-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Eliminar mascota</h2>
              <button className="modal-close" onClick={() => setConfirmarEliminar(null)}>x</button>
            </div>
            <div style={{ padding: "24px 28px" }}>
              <p style={{ color: "#555", marginBottom: 24 }}>
                Esta acción eliminará a <strong>{confirmarEliminar.nombre}</strong> permanentemente.
                No se puede deshacer.
              </p>
              <div className="modal-actions">
                <button className="modal-btn-cancel" onClick={() => setConfirmarEliminar(null)}>
                  Cancelar
                </button>
                <button
                  className="modal-btn-save"
                  style={{ background: "#e5484d" }}
                  onClick={eliminarMascota}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MisMascotas;
