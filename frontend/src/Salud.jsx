import { useState, useEffect } from "react";
import "./Salud.css";
import Sidebar from "./Sidebar";

import {
  FaPlus, FaCheckCircle, FaExclamationTriangle, FaTimes,
  FaRunning, FaAppleAlt, FaTint, FaMoon, FaSyringe,
  FaStethoscope, FaChevronDown, FaHeartbeat, FaCalendarAlt,
} from "react-icons/fa";
import { MdPets } from "react-icons/md";

import { api, urlFoto } from "./api";

const TABS = ["Resumen", "Vacunas", "Medicamentos", "Historial médico"];

const STATUS_CLASS = {
  Excelente: "s-excelente",
  Atención:  "s-atencion",
  Bueno:     "s-bueno",
  Crítico:   "s-critico",
};

function DonutChart({ pct, label, size = 130 }) {
  const r = 46;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="donut-wrap">
      <svg width={size} height={size} viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#eee" strokeWidth="10" />
        <circle cx="55" cy="55" r={r} fill="none" stroke="#6900FF" strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 55 55)" />
        <text x="55" y="52" textAnchor="middle" fontSize="15" fontWeight="700" fill="#222">{pct}%</text>
        <text x="55" y="66" textAnchor="middle" fontSize="7" fill="#777">{label}</text>
      </svg>
    </div>
  );
}

const BIENESTAR = [
  { label: "Actividad",    pct: 85, Icon: FaRunning  },
  { label: "Alimentación", pct: 90, Icon: FaAppleAlt },
  { label: "Hidratación",  pct: 88, Icon: FaTint     },
  { label: "Descanso",     pct: 92, Icon: FaMoon     },
];

function Salud({ onNavigate, onLogout, usuario }) {
  const [mascotas,     setMascotas]     = useState([]);
  const [mascotaIdx,   setMascotaIdx]   = useState(0);
  const [tabActivo,    setTabActivo]    = useState("Resumen");
  const [vacunas,      setVacunas]      = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [historial,    setHistorial]    = useState([]);
  const [cargando,     setCargando]     = useState(true);

  useEffect(() => {
    cargarMascotas();
  }, []);

  useEffect(() => {
    if (mascotas.length > 0) {
      cargarDatosMascota(mascotas[mascotaIdx]?.id);
    }
  }, [mascotaIdx, mascotas]);

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

  const cargarDatosMascota = async (id) => {
    if (!id) return;
    try {
      const [v, m, h] = await Promise.all([
        api.get("/vacunas").catch(() => []),
        api.get("/medicamentos").catch(() => []),
        api.get("/historial_medico").catch(() => []),
      ]);
      // Filtrar por mascota activa si el campo existe
      const filtrar = (lista, arr) =>
        (arr.data || arr || []).filter(
          (item) => !item.mascota_id || item.mascota_id === id
        );
      setVacunas(filtrar(id, v));
      setMedicamentos(filtrar(id, m));
      setHistorial(filtrar(id, h));
    } catch {
      setVacunas([]);
      setMedicamentos([]);
      setHistorial([]);
    }
  };

  const mascotaActual = mascotas[mascotaIdx];

  const resumenStats = {
    excelente: mascotas.filter((m) => (m.estado || "Bueno") === "Excelente").length,
    bueno:     mascotas.filter((m) => (m.estado || "Bueno") === "Bueno").length,
    atencion:  mascotas.filter((m) => (m.estado || "Bueno") === "Atención").length,
    critico:   mascotas.filter((m) => (m.estado || "Bueno") === "Crítico").length,
  };

  return (
    <div className="home">
      <Sidebar activo="salud" onNavigate={onNavigate} onLogout={onLogout} usuario={usuario} />

      <main className="main-content">

        {/* TOP BAR */}
        <div className="sl-topbar">
          <div className="sl-topbar-left">
            <FaHeartbeat className="sl-topbar-icon" />
            <div>
              <h1>Salud</h1>
              <p>Monitorea el bienestar de todas tus mascotas.</p>
            </div>
          </div>
          <button className="sl-filter-btn">
            <MdPets /> Todas mis mascotas <FaChevronDown />
          </button>
        </div>

        {/* SELECTOR DE MASCOTAS */}
        <section className="sl-pet-selector">
          {cargando ? (
            <p style={{ color: "#777" }}>Cargando mascotas...</p>
          ) : mascotas.length === 0 ? (
            <p style={{ color: "#777" }}>No tienes mascotas registradas.</p>
          ) : (
            mascotas.map((m, i) => {
              const estado = m.estado || "Bueno";
              return (
                <div
                  key={m.id}
                  className={`sl-pet-chip${mascotaIdx === i ? " sl-pet-chip-active" : ""}`}
                  onClick={() => setMascotaIdx(i)}
                >
                  <img
                    src={urlFoto(m.foto) || `https://placedog.net/80/80?id=${m.id}`}
                    alt={m.nombre}
                    onError={(e) => { e.target.src = `https://placedog.net/80/80?id=${m.id}`; }}
                  />
                  <div>
                    <strong>{m.nombre}</strong>
                    <p>{m.raza || m.especie}</p>
                    <span className={`sl-status ${STATUS_CLASS[estado] || "s-bueno"}`}>{estado}</span>
                  </div>
                </div>
              );
            })
          )}

          <div className="sl-pet-chip sl-add-chip" onClick={() => onNavigate("mascotas")}>
            <div className="sl-add-circle"><FaPlus /></div>
            <span>Agregar mascota</span>
          </div>
        </section>

        {/* TABS */}
        <div className="sl-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`sl-tab${tabActivo === t ? " sl-tab-active" : ""}`}
              onClick={() => setTabActivo(t)}
            >{t}</button>
          ))}
        </div>

        {/* CONTENIDO POR TAB */}

        {tabActivo === "Resumen" && (
          <>
            <section className="sl-top-grid">
              {/* SALUD GENERAL */}
              <div className="sl-card">
                <h3>Resumen de salud general</h3>
                <div className="sl-health-body">
                  <DonutChart pct={mascotas.length > 0 ? 88 : 0} label="Salud general" />
                  <div className="sl-health-legend">
                    <div className="sl-legend-row">
                      <FaCheckCircle className="icon-green" />
                      <span>Excelente</span>
                      <strong>{resumenStats.excelente} mascotas</strong>
                    </div>
                    <div className="sl-legend-row">
                      <FaCheckCircle className="icon-blue" />
                      <span>Bueno</span>
                      <strong>{resumenStats.bueno} mascotas</strong>
                    </div>
                    <div className="sl-legend-row">
                      <FaExclamationTriangle className="icon-orange" />
                      <span>Atención</span>
                      <strong>{resumenStats.atencion} mascotas</strong>
                    </div>
                    <div className="sl-legend-row">
                      <FaTimes className="icon-red" />
                      <span>Crítico</span>
                      <strong>{resumenStats.critico} mascotas</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* BIENESTAR */}
              <div className="sl-card">
                <h3>Indicadores de bienestar</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {BIENESTAR.map(({ label, pct, Icon }) => (
                    <div key={label}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", marginBottom: 4 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Icon style={{ color: "#6900FF" }} /> {label}
                        </span>
                        <strong>{pct}%</strong>
                      </div>
                      <div style={{ background: "#eee", borderRadius: 8, height: 8, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: "#6900FF", borderRadius: 8 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* PROXIMAS CITAS */}
            <div className="sl-card" style={{ marginTop: 20 }}>
              <div className="sl-card-header">
                <h3>Proximas citas</h3>
                <button className="sl-link-btn" onClick={() => onNavigate("agenda")}>Ver agenda</button>
              </div>
              <p style={{ color: "#999", fontSize: 14 }}>
                Revisa tu agenda para ver las citas programadas.
              </p>
            </div>
          </>
        )}

        {tabActivo === "Vacunas" && (
          <div className="sl-card">
            <div className="sl-card-header">
              <h3>Vacunas — {mascotaActual?.nombre || "mascota"}</h3>
              <button className="sl-link-btn sl-small">+ Registrar vacuna</button>
            </div>
            {vacunas.length === 0 ? (
              <p style={{ color: "#999", fontSize: 14 }}>No hay vacunas registradas.</p>
            ) : (
              <table className="sl-table">
                <thead>
                  <tr>
                    <th>Vacuna</th>
                    <th>Fecha</th>
                    <th>Proxima dosis</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {vacunas.map((v) => (
                    <tr key={v.id}>
                      <td>{v.nombre || v.vacuna}</td>
                      <td>{v.fecha_aplicacion || v.fecha || "—"}</td>
                      <td>{v.proxima_dosis || "—"}</td>
                      <td>
                        <span className="sl-status s-excelente">Al dia</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tabActivo === "Medicamentos" && (
          <div className="sl-card">
            <div className="sl-card-header">
              <h3>Medicamentos — {mascotaActual?.nombre || "mascota"}</h3>
              <button className="sl-link-btn sl-small">+ Agregar medicamento</button>
            </div>
            {medicamentos.length === 0 ? (
              <p style={{ color: "#999", fontSize: 14 }}>No hay medicamentos registrados.</p>
            ) : (
              <table className="sl-table">
                <thead>
                  <tr>
                    <th>Medicamento</th>
                    <th>Dosis</th>
                    <th>Frecuencia</th>
                    <th>Fecha inicio</th>
                    <th>Fecha fin</th>
                  </tr>
                </thead>
                <tbody>
                  {medicamentos.map((m) => (
                    <tr key={m.id}>
                      <td>{m.nombre}</td>
                      <td>{m.dosis || "—"}</td>
                      <td>{m.frecuencia || "—"}</td>
                      <td>{m.fecha_inicio || "—"}</td>
                      <td>{m.fecha_fin || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tabActivo === "Historial médico" && (
          <div className="sl-card">
            <div className="sl-card-header">
              <h3>Historial médico — {mascotaActual?.nombre || "mascota"}</h3>
            </div>
            {historial.length === 0 ? (
              <p style={{ color: "#999", fontSize: 14 }}>No hay registros médicos.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {historial.map((h) => (
                  <div key={h.id} className="sl-historial-row">
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="sl-historial-icon">
                        <FaStethoscope />
                      </div>
                      <div>
                        <strong style={{ display: "block", fontSize: 14, color: "#222" }}>
                          {h.diagnostico || h.descripcion || "Consulta"}
                        </strong>
                        <span style={{ fontSize: 12, color: "#777" }}>
                          {h.fecha || "Sin fecha"} — {h.veterinario || "Veterinario no especificado"}
                        </span>
                      </div>
                    </div>
                    {h.tratamiento && (
                      <p style={{ fontSize: 13, color: "#555", marginTop: 6, marginLeft: 44 }}>
                        Tratamiento: {h.tratamiento}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

export default Salud;
