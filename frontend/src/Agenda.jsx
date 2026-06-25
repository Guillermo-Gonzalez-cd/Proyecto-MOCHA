import { useState, useEffect } from "react";
import "./Agenda.css";
import Sidebar from "./Sidebar";

import {
  FaCalendarAlt, FaPlus, FaChevronLeft, FaChevronRight,
  FaSyringe, FaStethoscope, FaPills, FaEdit, FaTrash,
  FaBell, FaCheckCircle,
} from "react-icons/fa";
import { BsRobot } from "react-icons/bs";

import { api } from "./api";

const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const ICONO_TIPO = {
  vacuna:      FaSyringe,
  consulta:    FaStethoscope,
  medicamento: FaPills,
  default:     FaCalendarAlt,
};

const TAG_ESTADO = {
  pendiente:  { label: "Pendiente",  clase: "tag-purple" },
  confirmada: { label: "Confirmada", clase: "tag-blue"   },
  cancelada:  { label: "Cancelada",  clase: "tag-orange" },
};

function generarDias(anio, mes) {
  const primerDia = new Date(anio, mes, 1).getDay();
  const totalDias = new Date(anio, mes + 1, 0).getDate();
  const dias = [];
  for (let i = 0; i < primerDia; i++) dias.push({ numero: null });
  for (let i = 1; i <= totalDias; i++) dias.push({ numero: i });
  return dias;
}

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function Agenda({ onNavigate, onLogout, usuario }) {
  const hoy = new Date();
  const [anio, setAnio]               = useState(hoy.getFullYear());
  const [mes, setMes]                 = useState(hoy.getMonth());
  const [diaSeleccionado, setDia]     = useState(hoy.getDate());
  const [mascotas, setMascotas]       = useState([]);
  const [citas, setCitas]             = useState([]);
  const [bloques, setBloques]         = useState([]);
  const [cargando, setCargando]       = useState(true);
  const [modalAbierto, setModal]      = useState(false);
  const [form, setForm]               = useState({ mascota_id: "", bloque_tiempo_id: "", motivo: "" });
  const [errorForm, setErrorForm]     = useState("");
  const [guardando, setGuardando]     = useState(false);
  const [eliminarId, setEliminarId]   = useState(null);

  useEffect(() => {
    cargarMascotas();
    cargarBloques();
  }, []);

  useEffect(() => {
    if (mascotas.length > 0) cargarTodasLasCitas();
  }, [mascotas]);

  const cargarMascotas = async () => {
    try {
      const data = await api.get("/mascotas");
      setMascotas(data.data || data || []);
    } catch { setMascotas([]); }
  };

  const cargarBloques = async () => {
    try {
      const data = await api.get("/admin/timeblocks");
      setBloques((data.data || data || []).filter((b) => b.disponible));
    } catch { setBloques([]); }
  };

  const cargarTodasLasCitas = async () => {
    setCargando(true);
    try {
      const promesas = mascotas.map((m) =>
        api.get(`/citas/mascota/${m.id}`).catch(() => ({ data: [] }))
      );
      const resultados = await Promise.all(promesas);
      const todas = resultados.flatMap((r) => r.data || r || []);
      setCitas(todas);
    } catch { setCitas([]); }
    finally { setCargando(false); }
  };

  const mesAnterior = () => {
    if (mes === 0) { setMes(11); setAnio(a => a - 1); }
    else setMes(m => m - 1);
  };

  const mesSiguiente = () => {
    if (mes === 11) { setMes(0); setAnio(a => a + 1); }
    else setMes(m => m + 1);
  };

  // Citas del día seleccionado
  const fechaSeleccionada = `${anio}-${String(mes + 1).padStart(2,"0")}-${String(diaSeleccionado).padStart(2,"0")}`;
  const citasHoy = citas.filter((c) => c.fecha === fechaSeleccionada);

  // Días con citas (para puntos en el calendario)
  const diasConCitas = new Set(
    citas
      .filter((c) => {
        const d = c.fecha?.split("-");
        return d && Number(d[0]) === anio && Number(d[1]) - 1 === mes;
      })
      .map((c) => Number(c.fecha?.split("-")[2]))
  );

  // Citas futuras (próximas)
  const citasFuturas = citas
    .filter((c) => c.fecha && c.fecha >= new Date().toISOString().split("T")[0])
    .sort((a, b) => (a.fecha > b.fecha ? 1 : -1))
    .slice(0, 5);

  const crearCita = async (e) => {
    e.preventDefault();
    setErrorForm("");
    if (!form.mascota_id || !form.bloque_tiempo_id) {
      setErrorForm("Selecciona una mascota y un horario.");
      return;
    }
    setGuardando(true);
    try {
      await api.post("/citas", {
        mascota_id:      Number(form.mascota_id),
        bloque_tiempo_id: Number(form.bloque_tiempo_id),
        motivo:          form.motivo || null,
      });
      setModal(false);
      setForm({ mascota_id: "", bloque_tiempo_id: "", motivo: "" });
      await cargarBloques();
      await cargarTodasLasCitas();
    } catch (err) {
      setErrorForm(err.data?.message || "No se pudo crear la cita.");
    } finally {
      setGuardando(false);
    }
  };

  const eliminarCita = async () => {
    if (!eliminarId) return;
    try {
      await api.delete(`/citas/${eliminarId}`);
      setEliminarId(null);
      await cargarBloques();
      await cargarTodasLasCitas();
    } catch { setEliminarId(null); }
  };

  const dias = generarDias(anio, mes);

  return (
    <div className="home">
      <Sidebar activo="agenda" onNavigate={onNavigate} onLogout={onLogout} usuario={usuario} />

      <main className="main-content">

        {/* TOP BAR */}
        <div className="ag-topbar">
          <div className="ag-topbar-left">
            <FaCalendarAlt className="ag-topbar-left-icon" />
            <div>
              <h1>Agenda</h1>
              <p>Organiza y no olvides ningún compromiso importante.</p>
            </div>
          </div>
          <button className="ag-new-btn" onClick={() => setModal(true)}>
            <FaPlus /> Nueva cita
          </button>
        </div>

        {/* FILA SUPERIOR */}
        <section className="ag-top-grid">

          {/* PROXIMAS CITAS */}
          <div className="ag-card">
            <h3>Próximas citas</h3>
            {cargando ? (
              <p style={{ color: "#999", fontSize: 14 }}>Cargando...</p>
            ) : citasFuturas.length === 0 ? (
              <p style={{ color: "#999", fontSize: 14 }}>No hay citas próximas.</p>
            ) : (
              <div className="ag-event-list">
                {citasFuturas.map((cita) => {
                  const mascota = mascotas.find((m) => m.id === cita.mascota_id);
                  const Icono = ICONO_TIPO.default;
                  const { label, clase } = TAG_ESTADO[cita.estado] || TAG_ESTADO.pendiente;
                  return (
                    <div className="ag-event-row" key={cita.id}>
                      <span className={`ag-event-icon ${clase}`}><Icono /></span>
                      <div className="ag-event-info">
                        <strong>{cita.motivo || "Cita veterinaria"}</strong>
                        <p>{mascota?.nombre || "Mascota"}</p>
                        <span className="ag-event-time">
                          {cita.fecha} · {cita.hora_inicio}
                        </span>
                      </div>
                      <span className={`ag-pill ${clase}`}>{label}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <button className="ag-link-btn">Ver todas las citas</button>
          </div>

          {/* CALENDARIO */}
          <div className="ag-card">
            <div className="ag-cal-header">
              <FaChevronLeft className="ag-cal-arrow" onClick={mesAnterior} />
              <h3>{MESES[mes]} {anio}</h3>
              <FaChevronRight className="ag-cal-arrow" onClick={mesSiguiente} />
            </div>
            <div className="ag-cal-weekdays">
              {DIAS_SEMANA.map((d) => <span key={d}>{d}</span>)}
            </div>
            <div className="ag-cal-grid">
              {dias.map((d, i) => (
                <div
                  key={i}
                  className={`ag-cal-day ${!d.numero ? "ag-cal-day-muted" : ""} ${d.numero === diaSeleccionado ? "ag-cal-day-active" : ""}`}
                  onClick={() => d.numero && setDia(d.numero)}
                >
                  {d.numero || ""}
                  {d.numero && diasConCitas.has(d.numero) && (
                    <span className="ag-cal-dot tag-purple" />
                  )}
                </div>
              ))}
            </div>
            <div className="ag-cal-legend">
              <span><i className="ag-dot tag-purple" /> Cita</span>
              <span><i className="ag-dot tag-pink" /> Vacuna</span>
              <span><i className="ag-dot tag-orange" /> Medicamento</span>
            </div>
          </div>

          {/* RESUMEN DEL DIA */}
          <div className="ag-card ag-summary-card">
            <h3>Resumen del día</h3>
            <p className="ag-summary-date">
              {diaSeleccionado} de {MESES[mes]}, {anio}
            </p>
            <div className="ag-summary-stat ag-stat-purple">
              <div><strong>{citasHoy.length}</strong><p>Citas hoy</p></div>
              <FaCalendarAlt />
            </div>
          </div>

        </section>

        {/* CITAS DEL DIA SELECCIONADO */}
        <section className="ag-bottom-grid">
          <div className="ag-card">
            <h3 className="ag-section-title">
              Citas — {diaSeleccionado} de {MESES[mes]}
              <span className="ag-count-badge">{citasHoy.length}</span>
            </h3>

            {citasHoy.length === 0 ? (
              <p style={{ color: "#999", fontSize: 14, marginTop: 8 }}>
                No hay citas para este día.
              </p>
            ) : (
              <div className="ag-today-list">
                {citasHoy.map((cita) => {
                  const mascota = mascotas.find((m) => m.id === cita.mascota_id);
                  const { label, clase } = TAG_ESTADO[cita.estado] || TAG_ESTADO.pendiente;
                  return (
                    <div className="ag-today-row" key={cita.id}>
                      <span className="ag-today-time">{cita.hora_inicio}</span>
                      <span className="ag-today-icon"><FaCalendarAlt /></span>
                      <div className="ag-today-info">
                        <strong>{cita.motivo || "Cita veterinaria"}</strong>
                        <p>{mascota?.nombre || "Mascota"}</p>
                      </div>
                      <span className={`ag-pill ${clase}`}>{label}</span>
                      <div className="ag-today-actions">
                        <FaTrash
                          style={{ cursor: "pointer", color: "#e5484d" }}
                          onClick={() => setEliminarId(cita.id)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* PANEL LATERAL */}
          <div className="ag-side-col">
            <div className="ag-card">
              <div className="ag-reminders-header">
                <h3>Recordatorios</h3>
              </div>
              {citas.filter((c) => c.estado === "pendiente").slice(0, 3).length === 0 ? (
                <p style={{ color: "#999", fontSize: 14 }}>Sin recordatorios pendientes.</p>
              ) : (
                <div className="ag-reminders-list">
                  {citas.filter((c) => c.estado === "pendiente").slice(0, 3).map((c) => {
                    const mascota = mascotas.find((m) => m.id === c.mascota_id);
                    return (
                      <div className="ag-reminder-row" key={c.id}>
                        <span className="ag-reminder-icon"><FaBell /></span>
                        <div className="ag-today-info">
                          <strong>{c.motivo || "Cita pendiente"}</strong>
                          <p>{mascota?.nombre || "Mascota"} · {c.fecha}</p>
                        </div>
                        <span className="ag-active-tag"><FaCheckCircle /> Activo</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="ag-tip-card">
              <BsRobot className="ag-tip-icon" />
              <h3>Consejo del día</h3>
              <p>El ejercicio diario fortalece el corazón y mejora el bienestar de tus mascotas.</p>
            </div>
          </div>
        </section>

      </main>

      {/* MODAL NUEVA CITA */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Agendar nueva cita</h2>
              <button className="modal-close" onClick={() => setModal(false)}>x</button>
            </div>
            <form onSubmit={crearCita} className="modal-form">
              <div className="modal-field">
                <label>Mascota *</label>
                <select
                  value={form.mascota_id}
                  onChange={(e) => setForm((p) => ({ ...p, mascota_id: e.target.value }))}
                >
                  <option value="">Seleccionar mascota</option>
                  {mascotas.map((m) => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="modal-field" style={{ marginTop: 12 }}>
                <label>Horario disponible *</label>
                <select
                  value={form.bloque_tiempo_id}
                  onChange={(e) => setForm((p) => ({ ...p, bloque_tiempo_id: e.target.value }))}
                >
                  <option value="">Seleccionar horario</option>
                  {bloques.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.fecha} — {b.hora_inicio} a {b.hora_fin}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-field" style={{ marginTop: 12 }}>
                <label>Motivo (opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: Vacuna anual, consulta de rutina..."
                  value={form.motivo}
                  onChange={(e) => setForm((p) => ({ ...p, motivo: e.target.value }))}
                />
              </div>

              {errorForm && <p className="modal-error">{errorForm}</p>}

              <div className="modal-actions" style={{ marginTop: 20 }}>
                <button type="button" className="modal-btn-cancel" onClick={() => setModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="modal-btn-save" disabled={guardando}>
                  {guardando ? "Guardando..." : "Agendar cita"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMACION ELIMINAR CITA */}
      {eliminarId && (
        <div className="modal-overlay" onClick={() => setEliminarId(null)}>
          <div className="modal-box confirmar-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Cancelar cita</h2>
              <button className="modal-close" onClick={() => setEliminarId(null)}>x</button>
            </div>
            <div style={{ padding: "24px 28px" }}>
              <p style={{ color: "#555", marginBottom: 24 }}>
                Esta acción eliminará la cita permanentemente y liberará el horario.
              </p>
              <div className="modal-actions">
                <button className="modal-btn-cancel" onClick={() => setEliminarId(null)}>Cancelar</button>
                <button
                  className="modal-btn-save"
                  style={{ background: "#e5484d" }}
                  onClick={eliminarCita}
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

export default Agenda;
