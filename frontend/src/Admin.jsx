import { useState, useEffect } from "react";
import "./Admin.css";
import Sidebar from "./Sidebar";

import {
  FaUserShield, FaPlus, FaCalendarAlt, FaClock, FaCheckCircle,
} from "react-icons/fa";

import { api } from "./api";

function Admin({ onNavigate, onLogout, usuario }) {
  const [bloques, setBloques]       = useState([]);
  const [citas,   setCitas]         = useState([]);
  const [cargando, setCargando]     = useState(true);
  const [form, setForm]             = useState({ fecha: "", hora_inicio: "", hora_fin: "" });
  const [errorForm, setErrorForm]   = useState("");
  const [guardando, setGuardando]   = useState(false);
  const [exito, setExito]           = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [b, c] = await Promise.all([
        api.get("/admin/timeblocks").catch(() => []),
        api.get("/admin/citas").catch(() => []),
      ]);
      setBloques(b.data || b || []);
      setCitas(c.data || c || []);
    } catch {
      setBloques([]);
      setCitas([]);
    } finally {
      setCargando(false);
    }
  };

  const cambiar = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const crearBloque = async (e) => {
    e.preventDefault();
    setErrorForm("");
    setExito("");

    if (!form.fecha || !form.hora_inicio || !form.hora_fin) {
      setErrorForm("Todos los campos son obligatorios.");
      return;
    }

    if (form.hora_fin <= form.hora_inicio) {
      setErrorForm("La hora de fin debe ser posterior a la hora de inicio.");
      return;
    }

    setGuardando(true);
    try {
      await api.post("/admin/timeblocks", form);
      setForm({ fecha: "", hora_inicio: "", hora_fin: "" });
      setExito("Bloque de tiempo creado correctamente.");
      setTimeout(() => setExito(""), 3000);
      await cargarDatos();
    } catch (err) {
      setErrorForm(err.data?.message || "Error al crear el bloque.");
    } finally {
      setGuardando(false);
    }
  };

  const bloquesDisponibles = bloques.filter((b) => b.disponible);
  const bloquesOcupados    = bloques.filter((b) => !b.disponible);

  return (
    <div className="home">
      <Sidebar activo="admin" onNavigate={onNavigate} onLogout={onLogout} usuario={usuario} />

      <main className="main-content">

        {/* TOP BAR */}
        <div className="adm-topbar">
          <div className="adm-topbar-left">
            <FaUserShield className="adm-topbar-icon" />
            <div>
              <h1>Panel de administración</h1>
              <p>Gestiona horarios y monitorea todas las citas del sistema.</p>
            </div>
          </div>
        </div>

        {/* ESTADÍSTICAS */}
        <section className="adm-stats">
          <div className="adm-stat-card adm-stat-purple">
            <div>
              <strong>{bloques.length}</strong>
              <p>Bloques totales</p>
            </div>
            <FaClock />
          </div>
          <div className="adm-stat-card adm-stat-green">
            <div>
              <strong>{bloquesDisponibles.length}</strong>
              <p>Disponibles</p>
            </div>
            <FaCheckCircle />
          </div>
          <div className="adm-stat-card adm-stat-orange">
            <div>
              <strong>{bloquesOcupados.length}</strong>
              <p>Ocupados</p>
            </div>
            <FaClock />
          </div>
          <div className="adm-stat-card adm-stat-blue">
            <div>
              <strong>{citas.length}</strong>
              <p>Citas totales</p>
            </div>
            <FaCalendarAlt />
          </div>
        </section>

        <div className="adm-grid">

          {/* CREAR BLOQUE DE TIEMPO */}
          <div className="adm-card">
            <h3>Crear bloque de tiempo</h3>
            <form onSubmit={crearBloque} className="adm-form">
              <div className="adm-field">
                <label>Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  value={form.fecha}
                  onChange={cambiar}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="adm-row">
                <div className="adm-field">
                  <label>Hora inicio</label>
                  <input
                    type="time"
                    name="hora_inicio"
                    value={form.hora_inicio}
                    onChange={cambiar}
                  />
                </div>
                <div className="adm-field">
                  <label>Hora fin</label>
                  <input
                    type="time"
                    name="hora_fin"
                    value={form.hora_fin}
                    onChange={cambiar}
                  />
                </div>
              </div>

              {errorForm && <p className="adm-error">{errorForm}</p>}
              {exito     && <p className="adm-exito">{exito}</p>}

              <button type="submit" className="adm-btn-crear" disabled={guardando}>
                <FaPlus /> {guardando ? "Creando..." : "Crear bloque"}
              </button>
            </form>
          </div>

          {/* BLOQUES DE TIEMPO */}
          <div className="adm-card">
            <h3>Bloques de tiempo</h3>
            {cargando ? (
              <p className="adm-empty">Cargando...</p>
            ) : bloques.length === 0 ? (
              <p className="adm-empty">No hay bloques creados.</p>
            ) : (
              <div className="adm-bloques-list">
                {bloques
                  .sort((a, b) => (a.fecha > b.fecha ? 1 : -1))
                  .map((b) => (
                    <div className="adm-bloque-row" key={b.id}>
                      <div className="adm-bloque-info">
                        <strong>{b.fecha}</strong>
                        <span>{b.hora_inicio} — {b.hora_fin}</span>
                      </div>
                      <span className={`adm-badge ${b.disponible ? "adm-badge-green" : "adm-badge-orange"}`}>
                        {b.disponible ? "Disponible" : "Ocupado"}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>

        </div>

        {/* TODAS LAS CITAS */}
        <div className="adm-card adm-citas-card">
          <h3>Todas las citas del sistema</h3>
          {cargando ? (
            <p className="adm-empty">Cargando...</p>
          ) : citas.length === 0 ? (
            <p className="adm-empty">No hay citas registradas en el sistema.</p>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Mascota</th>
                  <th>Fecha</th>
                  <th>Horario</th>
                  <th>Motivo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {citas.map((c) => (
                  <tr key={c.id}>
                    <td>#{c.id}</td>
                    <td>{c.mascota || `Mascota #${c.mascota_id}`}</td>
                    <td>{c.fecha || "—"}</td>
                    <td>{c.hora_inicio ? `${c.hora_inicio} — ${c.hora_fin}` : "—"}</td>
                    <td>{c.motivo || "Sin motivo"}</td>
                    <td>
                      <span className={`adm-badge ${
                        c.estado === "confirmada" ? "adm-badge-green"  :
                        c.estado === "cancelada"  ? "adm-badge-red"    :
                        "adm-badge-orange"
                      }`}>
                        {c.estado}
                      </span>
                    </td>
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

export default Admin;
