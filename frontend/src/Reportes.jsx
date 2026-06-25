import { useState, useEffect } from "react";
import "./Reportes.css";
import Sidebar from "./Sidebar";

import {
  FaChartBar, FaPaw, FaSyringe, FaCalendarAlt,
  FaHeartbeat, FaPills, FaDownload,
} from "react-icons/fa";
import { MdOutlineAnalytics } from "react-icons/md";

import { api } from "./api";

/* ─── Barra horizontal simple (sin librería) ───── */
function BarChart({ data, colorKey = "#6900FF" }) {
  const max = Math.max(...data.map((d) => d.valor), 1);
  return (
    <div className="rp-barchart">
      {data.map((d, i) => (
        <div key={i} className="rp-bar-row">
          <span className="rp-bar-label">{d.label}</span>
          <div className="rp-bar-track">
            <div
              className="rp-bar-fill"
              style={{ width: `${(d.valor / max) * 100}%`, background: colorKey }}
            />
          </div>
          <span className="rp-bar-value">{d.valor}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Donuts SVG (reutilizados del estilo Salud) ─ */
function Donut({ pct, label, color = "#6900FF" }) {
  const r = 46, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="rp-donut-wrap">
      <svg width="120" height="120" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#eee" strokeWidth="10" />
        <circle cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 55 55)" />
        <text x="55" y="52" textAnchor="middle" fontSize="15" fontWeight="700" fill="#222">{pct}%</text>
        <text x="55" y="66" textAnchor="middle" fontSize="7" fill="#777">{label}</text>
      </svg>
    </div>
  );
}

function Reportes({ onNavigate, onLogout, usuario }) {
  const [mascotas,     setMascotas]     = useState([]);
  const [vacunas,      setVacunas]      = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [historial,    setHistorial]    = useState([]);
  const [citas,        setCitas]        = useState([]);
  const [recordatorios,setRecordatorios]= useState([]);
  const [cargando,     setCargando]     = useState(true);

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [m, v, med, h, rec] = await Promise.all([
        api.get("/mascotas").catch(() => []),
        api.get("/vacunas").catch(() => []),
        api.get("/medicamentos").catch(() => []),
        api.get("/historial_medico").catch(() => []),
        api.get("/recordatorios").catch(() => []),
      ]);

      const toArr = (r) => r?.data || r || [];
      const mascotasArr = toArr(m);
      setMascotas(mascotasArr);
      setVacunas(toArr(v));
      setMedicamentos(toArr(med));
      setHistorial(toArr(h));
      setRecordatorios(toArr(rec));

      // Cargar citas por mascota
      if (mascotasArr.length > 0) {
        const citasAll = await Promise.all(
          mascotasArr.map((mas) =>
            api.get(`/citas/mascota/${mas.id}`).catch(() => ({ data: [] }))
          )
        );
        setCitas(citasAll.flatMap((r) => r?.data || r || []));
      }
    } catch {
      // silencioso
    } finally {
      setCargando(false);
    }
  };

  /* ─── Derivar métricas ─────────────────────── */

  // Distribución por especie
  const porEspecie = mascotas.reduce((acc, m) => {
    const esp = m.especie || "Otro";
    acc[esp] = (acc[esp] || 0) + 1;
    return acc;
  }, {});
  const especieData = Object.entries(porEspecie).map(([label, valor]) => ({ label, valor }));

  // Distribución de citas por estado
  const porEstado = citas.reduce((acc, c) => {
    acc[c.estado] = (acc[c.estado] || 0) + 1;
    return acc;
  }, {});

  // Vacunas por mes (últimas 6)
  const vacunasPorMes = vacunas.reduce((acc, v) => {
    if (!v.fecha) return acc;
    const mes = v.fecha.slice(0, 7);
    acc[mes] = (acc[mes] || 0) + 1;
    return acc;
  }, {});
  const vacunasMesData = Object.entries(vacunasPorMes)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([label, valor]) => ({ label: label.slice(5), valor })); // solo MM

  // Porcentaje vacunas al día: mascotas con ≥1 vacuna
  const mascotasConVacuna = new Set(vacunas.map((v) => v.mascota_id)).size;
  const pctVacunas = mascotas.length > 0
    ? Math.round((mascotasConVacuna / mascotas.length) * 100)
    : 0;

  // Porcentaje citas completadas
  const citasCompletadas = citas.filter((c) => c.estado === "confirmada").length;
  const pctCitas = citas.length > 0 ? Math.round((citasCompletadas / citas.length) * 100) : 0;

  // Porcentaje historial registrado
  const mascotasConHistorial = new Set(historial.map((h) => h.mascota_id)).size;
  const pctHistorial = mascotas.length > 0
    ? Math.round((mascotasConHistorial / mascotas.length) * 100)
    : 0;

  // Recordatorios pendientes
  const recPendientes = recordatorios.filter((r) => !r.notificado).length;

  if (cargando) {
    return (
      <div className="home">
        <Sidebar activo="reportes" onNavigate={onNavigate} onLogout={onLogout} usuario={usuario} />
        <main className="main-content">
          <p style={{ color: "#777", marginTop: 40, textAlign: "center" }}>Cargando reportes...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="home">
      <Sidebar activo="reportes" onNavigate={onNavigate} onLogout={onLogout} usuario={usuario} />

      <main className="main-content">

        {/* TOP BAR */}
        <div className="rp-topbar">
          <div className="rp-topbar-left">
            <MdOutlineAnalytics className="rp-topbar-icon" />
            <div>
              <h1>Reportes</h1>
              <p>Estadísticas y métricas de todas tus mascotas.</p>
            </div>
          </div>
          <button className="rp-export-btn" onClick={() => window.print()}>
            <FaDownload /> Exportar
          </button>
        </div>

        {/* STATS SUPERIORES */}
        <section className="rp-stats">
          <div className="rp-stat-card rp-stat-purple">
            <div><strong>{mascotas.length}</strong><p>Mascotas</p></div>
            <FaPaw />
          </div>
          <div className="rp-stat-card rp-stat-blue">
            <div><strong>{citas.length}</strong><p>Citas totales</p></div>
            <FaCalendarAlt />
          </div>
          <div className="rp-stat-card rp-stat-green">
            <div><strong>{vacunas.length}</strong><p>Vacunas registradas</p></div>
            <FaSyringe />
          </div>
          <div className="rp-stat-card rp-stat-orange">
            <div><strong>{medicamentos.length}</strong><p>Medicamentos</p></div>
            <FaPills />
          </div>
          <div className="rp-stat-card rp-stat-red">
            <div><strong>{recPendientes}</strong><p>Recordatorios pendientes</p></div>
            <FaHeartbeat />
          </div>
        </section>

        {/* FILA MEDIA: donuts */}
        <section className="rp-grid-2">

          <div className="rp-card">
            <h3><FaHeartbeat style={{ color: "#6900FF" }} /> Indicadores de salud</h3>
            <div className="rp-donuts-row">
              <div className="rp-donut-item">
                <Donut pct={pctVacunas} label="Vacunas" color="#6900FF" />
                <p>Vacunas al día</p>
              </div>
              <div className="rp-donut-item">
                <Donut pct={pctCitas} label="Citas" color="#19a463" />
                <p>Citas confirmadas</p>
              </div>
              <div className="rp-donut-item">
                <Donut pct={pctHistorial} label="Historial" color="#2563eb" />
                <p>Historial registrado</p>
              </div>
            </div>
          </div>

          <div className="rp-card">
            <h3><FaPaw style={{ color: "#6900FF" }} /> Mascotas por especie</h3>
            {especieData.length === 0 ? (
              <p className="rp-empty">Sin mascotas registradas.</p>
            ) : (
              <BarChart data={especieData} colorKey="#6900FF" />
            )}
          </div>

        </section>

        {/* FILA INFERIOR */}
        <section className="rp-grid-2">

          <div className="rp-card">
            <h3><FaSyringe style={{ color: "#6900FF" }} /> Vacunas por mes</h3>
            {vacunasMesData.length === 0 ? (
              <p className="rp-empty">No hay vacunas registradas con fecha.</p>
            ) : (
              <BarChart data={vacunasMesData} colorKey="#8a2bff" />
            )}
          </div>

          <div className="rp-card">
            <h3><FaCalendarAlt style={{ color: "#6900FF" }} /> Citas por estado</h3>
            {citas.length === 0 ? (
              <p className="rp-empty">No hay citas registradas.</p>
            ) : (
              <div className="rp-estado-list">
                {[
                  { label: "Pendiente",  key: "pendiente",  color: "#e08a00", bg: "#fff3e0" },
                  { label: "Confirmada", key: "confirmada", color: "#19a463", bg: "#e6f9ee" },
                  { label: "Cancelada",  key: "cancelada",  color: "#e5484d", bg: "#fde9ea" },
                ].map(({ label, key, color, bg }) => (
                  <div key={key} className="rp-estado-row" style={{ background: bg }}>
                    <span className="rp-estado-label" style={{ color }}>{label}</span>
                    <strong style={{ color }}>{porEstado[key] || 0}</strong>
                  </div>
                ))}
                <p className="rp-estado-total">Total: {citas.length} citas</p>
              </div>
            )}
          </div>

        </section>

        {/* HISTORIAL RECIENTE */}
        <div className="rp-card" style={{ marginBottom: 10 }}>
          <div className="rp-card-header">
            <h3><FaChartBar style={{ color: "#6900FF" }} /> Últimas entradas del historial médico</h3>
            <button className="rp-link-btn" onClick={() => onNavigate("salud")}>Ver salud</button>
          </div>
          {historial.length === 0 ? (
            <p className="rp-empty">No hay registros en el historial médico.</p>
          ) : (
            <table className="rp-table">
              <thead>
                <tr>
                  <th>Diagnóstico</th>
                  <th>Tratamiento</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {historial.slice(-6).reverse().map((h) => (
                  <tr key={h.id}>
                    <td>{h.diagnostico || "—"}</td>
                    <td>{h.tratamiento || "—"}</td>
                    <td>{h.fecha || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </main>
    </div>
  );
}

export default Reportes;
