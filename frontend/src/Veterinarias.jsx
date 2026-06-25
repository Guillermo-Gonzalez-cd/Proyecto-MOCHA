import { useState } from "react";
import "./Veterinarias.css";
import Sidebar from "./Sidebar";

import {
  FaMapMarkerAlt, FaPhone, FaClock, FaStar,
  FaSearch, FaCheckCircle, FaTimesCircle,
} from "react-icons/fa";
import { MdPets } from "react-icons/md";

const ESPECIALIDADES = ["Todas", "General", "Cirugía", "Dermatología", "Cardiología", "Emergencias 24h"];

const VETERINARIAS = [
  {
    id: 1,
    nombre: "Clínica Veterinaria San Francisco",
    especialidad: "General",
    direccion: "Colonia Los Robles, Managua",
    telefono: "+505 2278-4512",
    horario: "Lun-Sab 8:00am - 6:00pm",
    calificacion: 4.8,
    abierto: true,
    asociada: true,
    descripcion: "Clínica especializada en medicina general y preventiva para perros y gatos.",
  },
  {
    id: 2,
    nombre: "Centro Médico Animal Vida",
    especialidad: "Cirugía",
    direccion: "Carretera Masaya Km 9, Managua",
    telefono: "+505 2279-3300",
    horario: "Lun-Vie 7:00am - 8:00pm",
    calificacion: 4.6,
    abierto: true,
    asociada: true,
    descripcion: "Especialistas en cirugía ortopédica y tejidos blandos con equipos de última generación.",
  },
  {
    id: 3,
    nombre: "VetDerm Nicaragua",
    especialidad: "Dermatología",
    direccion: "Plaza Las Américas, Managua",
    telefono: "+505 2268-9010",
    horario: "Mar-Sab 9:00am - 5:00pm",
    calificacion: 4.9,
    abierto: false,
    asociada: true,
    descripcion: "Única clínica especializada en dermatología veterinaria en Nicaragua.",
  },
  {
    id: 4,
    nombre: "AnimalCare 24H",
    especialidad: "Emergencias 24h",
    direccion: "Reparto San Juan, Managua",
    telefono: "+505 2270-1515",
    horario: "Abierto las 24 horas",
    calificacion: 4.5,
    abierto: true,
    asociada: false,
    descripcion: "Atención de emergencias y urgencias veterinarias las 24 horas del día.",
  },
  {
    id: 5,
    nombre: "Cardiovet Nicaragua",
    especialidad: "Cardiología",
    direccion: "Altamira D'Este, Managua",
    telefono: "+505 2277-4400",
    horario: "Lun-Vie 8:00am - 4:00pm",
    calificacion: 4.7,
    abierto: false,
    asociada: false,
    descripcion: "Especialistas en cardiología veterinaria con ecocardiogramas y holter.",
  },
  {
    id: 6,
    nombre: "MascotaSana Veterinaria",
    especialidad: "General",
    direccion: "Bo. Martha Quezada, Managua",
    telefono: "+505 2222-3344",
    horario: "Lun-Dom 8:00am - 6:00pm",
    calificacion: 4.3,
    abierto: true,
    asociada: true,
    descripcion: "Atención integral: consultas, vacunas, peluquería y tienda de mascotas.",
  },
];

function Estrellas({ n }) {
  return (
    <span className="vet-estrellas">
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar key={i} style={{ color: i <= Math.round(n) ? "#FFD700" : "#e0e0e0" }} />
      ))}
      <span className="vet-rating-num">{n}</span>
    </span>
  );
}

function Veterinarias({ onNavigate, onLogout, usuario }) {
  const [busqueda, setBusqueda]         = useState("");
  const [especialidad, setEspecialidad] = useState("Todas");
  const [soloAbierto, setSoloAbierto]   = useState(false);
  const [seleccionada, setSeleccionada] = useState(null);

  const filtradas = VETERINARIAS.filter((v) => {
    const matchBusqueda   = v.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            v.direccion.toLowerCase().includes(busqueda.toLowerCase());
    const matchEsp        = especialidad === "Todas" || v.especialidad === especialidad;
    const matchAbierto    = !soloAbierto || v.abierto;
    return matchBusqueda && matchEsp && matchAbierto;
  });

  return (
    <div className="home">
      <Sidebar activo="veterinarias" onNavigate={onNavigate} onLogout={onLogout} usuario={usuario} />

      <main className="main-content">

        {/* TOP BAR */}
        <div className="vet-topbar">
          <div className="vet-topbar-left">
            <MdPets className="vet-topbar-icon" />
            <div>
              <h1>Veterinarias</h1>
              <p>Encuentra clínicas y especialistas de confianza cerca de ti.</p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <section className="vet-stats">
          <div className="vet-stat-card vet-stat-purple">
            <div><strong>{VETERINARIAS.length}</strong><p>Clínicas registradas</p></div>
            <MdPets />
          </div>
          <div className="vet-stat-card vet-stat-green">
            <div><strong>{VETERINARIAS.filter(v => v.abierto).length}</strong><p>Abiertas ahora</p></div>
            <FaCheckCircle />
          </div>
          <div className="vet-stat-card vet-stat-orange">
            <div><strong>{VETERINARIAS.filter(v => v.asociada).length}</strong><p>Asociadas MOCHA</p></div>
            <FaStar />
          </div>
        </section>

        {/* BARRA DE BÚSQUEDA Y FILTROS */}
        <div className="vet-filtro-bar">
          <div className="vet-search-wrap">
            <FaSearch className="vet-search-icon" />
            <input
              type="text"
              placeholder="Buscar por nombre o dirección..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="vet-search"
            />
          </div>

          <div className="vet-chips">
            {ESPECIALIDADES.map((e) => (
              <button
                key={e}
                className={`vet-chip${especialidad === e ? " vet-chip-active" : ""}`}
                onClick={() => setEspecialidad(e)}
              >
                {e}
              </button>
            ))}
          </div>

          <label className="vet-toggle-label">
            <div
              className={`vet-toggle ${soloAbierto ? "vet-toggle-on" : ""}`}
              onClick={() => setSoloAbierto((v) => !v)}
            >
              <span className="vet-toggle-knob" />
            </div>
            Solo abiertas
          </label>
        </div>

        {/* LISTADO */}
        {filtradas.length === 0 ? (
          <p style={{ color: "#999", fontSize: 14, marginTop: 20 }}>
            No se encontraron veterinarias con esos criterios.
          </p>
        ) : (
          <div className="vet-grid">
            {filtradas.map((v) => (
              <div
                key={v.id}
                className={`vet-card${seleccionada?.id === v.id ? " vet-card-selected" : ""}`}
                onClick={() => setSeleccionada(seleccionada?.id === v.id ? null : v)}
              >
                {/* CABECERA */}
                <div className="vet-card-header">
                  <div className="vet-card-icon-wrap">
                    <MdPets />
                  </div>
                  <div className="vet-card-title">
                    <h3>{v.nombre}</h3>
                    <span className="vet-especialidad-tag">{v.especialidad}</span>
                  </div>
                  <div className="vet-card-badges">
                    {v.asociada && <span className="vet-badge-mocha">MOCHA</span>}
                    <span className={`vet-badge-estado ${v.abierto ? "vet-open" : "vet-closed"}`}>
                      {v.abierto ? <><FaCheckCircle /> Abierto</> : <><FaTimesCircle /> Cerrado</>}
                    </span>
                  </div>
                </div>

                {/* INFO */}
                <p className="vet-desc">{v.descripcion}</p>

                <div className="vet-info-row"><FaMapMarkerAlt /><span>{v.direccion}</span></div>
                <div className="vet-info-row"><FaPhone /><span>{v.telefono}</span></div>
                <div className="vet-info-row"><FaClock /><span>{v.horario}</span></div>

                <div className="vet-card-footer">
                  <Estrellas n={v.calificacion} />
                  <button
                    className="vet-btn-llamar"
                    onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${v.telefono}`; }}
                  >
                    Llamar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}

export default Veterinarias;
