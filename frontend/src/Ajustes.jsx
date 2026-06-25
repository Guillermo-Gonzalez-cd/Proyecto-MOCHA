import { useState, useEffect } from "react";
import "./Ajustes.css";
import Sidebar from "./Sidebar";

import {
  FaCog, FaUser, FaLock, FaBell,
  FaCheckCircle, FaExclamationCircle, FaEye, FaEyeSlash,
} from "react-icons/fa";

import { api, cerrarSesion } from "./api";

const TABS = ["Perfil", "Seguridad", "Notificaciones"];

function Ajustes({ onNavigate, onLogout, usuario }) {
  const [tabActivo, setTabActivo] = useState("Perfil");

  /* ─── Perfil ─── */
  const [perfil, setPerfil]   = useState({ nombre: "", correo: "", telefono: "" });
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);
  const [mensajePerfil, setMensajePerfil]     = useState(null); // { tipo: "ok"|"error", texto }

  /* ─── Seguridad ─── */
  const [passForm, setPassForm]     = useState({ actual: "", nueva: "", confirmar: "" });
  const [verPass, setVerPass]       = useState({ actual: false, nueva: false, confirmar: false });
  const [guardandoPass, setGuardandoPass] = useState(false);
  const [mensajePass, setMensajePass]     = useState(null);

  /* ─── Notificaciones ─── */
  const [notif, setNotif] = useState({
    vacunas: true,
    citas: true,
    medicamentos: true,
    recordatorios: false,
  });
  const [guardandoNotif, setGuardandoNotif] = useState(false);
  const [mensajeNotif, setMensajeNotif]     = useState(null);

  useEffect(() => {
    if (usuario) {
      setPerfil({
        nombre:   usuario.nombre  || "",
        correo:   usuario.correo  || "",
        telefono: usuario.telefono || "",
      });
    }
  }, [usuario]);

  /* ── Guardar perfil ── */
  const guardarPerfil = async (e) => {
    e.preventDefault();
    setMensajePerfil(null);
    if (!perfil.nombre || !perfil.correo) {
      setMensajePerfil({ tipo: "error", texto: "Nombre y correo son obligatorios." });
      return;
    }
    setGuardandoPerfil(true);
    try {
      if (usuario?.id) {
        await api.put(`/users/${usuario.id}`, {
          nombre:   perfil.nombre,
          correo:   perfil.correo,
          telefono: perfil.telefono || null,
        });
      }
      setMensajePerfil({ tipo: "ok", texto: "Perfil actualizado correctamente." });
    } catch (err) {
      setMensajePerfil({ tipo: "error", texto: err.data?.message || "Error al guardar el perfil." });
    } finally {
      setGuardandoPerfil(false);
    }
  };

  /* ── Cambiar contraseña ── */
  const cambiarPassword = async (e) => {
    e.preventDefault();
    setMensajePass(null);
    if (!passForm.actual || !passForm.nueva || !passForm.confirmar) {
      setMensajePass({ tipo: "error", texto: "Todos los campos son obligatorios." });
      return;
    }
    if (passForm.nueva !== passForm.confirmar) {
      setMensajePass({ tipo: "error", texto: "La nueva contraseña no coincide." });
      return;
    }
    if (passForm.nueva.length < 6) {
      setMensajePass({ tipo: "error", texto: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }
    setGuardandoPass(true);
    try {
      if (usuario?.id) {
        await api.put(`/users/${usuario.id}`, { password: passForm.nueva });
      }
      setPassForm({ actual: "", nueva: "", confirmar: "" });
      setMensajePass({ tipo: "ok", texto: "Contraseña actualizada. Por seguridad vuelve a iniciar sesión." });
      setTimeout(() => { cerrarSesion(); onLogout(); }, 3000);
    } catch (err) {
      setMensajePass({ tipo: "error", texto: err.data?.message || "Error al cambiar la contraseña." });
    } finally {
      setGuardandoPass(false);
    }
  };

  /* ── Guardar notificaciones (local) ── */
  const guardarNotificaciones = () => {
    setGuardandoNotif(true);
    setTimeout(() => {
      setMensajeNotif({ tipo: "ok", texto: "Preferencias de notificación guardadas." });
      setGuardandoNotif(false);
      setTimeout(() => setMensajeNotif(null), 3000);
    }, 600);
  };

  const toggleNotif = (key) => setNotif((p) => ({ ...p, [key]: !p[key] }));

  const Alerta = ({ msg }) =>
    !msg ? null : (
      <div className={`aj-alerta ${msg.tipo === "ok" ? "aj-alerta-ok" : "aj-alerta-error"}`}>
        {msg.tipo === "ok" ? <FaCheckCircle /> : <FaExclamationCircle />}
        {msg.texto}
      </div>
    );

  const Toggle = ({ activo, onChange }) => (
    <div className={`aj-toggle ${activo ? "aj-toggle-on" : ""}`} onClick={onChange}>
      <span className="aj-toggle-knob" />
    </div>
  );

  return (
    <div className="home">
      <Sidebar activo="ajustes" onNavigate={onNavigate} onLogout={onLogout} usuario={usuario} />

      <main className="main-content">

        {/* TOP BAR */}
        <div className="aj-topbar">
          <div className="aj-topbar-left">
            <FaCog className="aj-topbar-icon" />
            <div>
              <h1>Ajustes</h1>
              <p>Administra tu cuenta y tus preferencias.</p>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="aj-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`aj-tab${tabActivo === t ? " aj-tab-active" : ""}`}
              onClick={() => setTabActivo(t)}
            >
              {t === "Perfil"         && <FaUser />}
              {t === "Seguridad"      && <FaLock />}
              {t === "Notificaciones" && <FaBell />}
              {t}
            </button>
          ))}
        </div>

        {/* ── TAB PERFIL ── */}
        {tabActivo === "Perfil" && (
          <div className="aj-card">
            <h3>Información personal</h3>
            <Alerta msg={mensajePerfil} />

            <form onSubmit={guardarPerfil} className="aj-form">
              <div className="aj-field">
                <label>Nombre completo *</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={perfil.nombre}
                  onChange={(e) => setPerfil((p) => ({ ...p, nombre: e.target.value }))}
                />
              </div>
              <div className="aj-field">
                <label>Correo electrónico *</label>
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  value={perfil.correo}
                  onChange={(e) => setPerfil((p) => ({ ...p, correo: e.target.value }))}
                />
              </div>
              <div className="aj-field">
                <label>Teléfono</label>
                <input
                  type="tel"
                  placeholder="+505 0000-0000"
                  value={perfil.telefono}
                  onChange={(e) => setPerfil((p) => ({ ...p, telefono: e.target.value }))}
                />
              </div>

              <div className="aj-field aj-field-info">
                <label>Rol</label>
                <span className="aj-rol-badge">
                  {usuario?.rol === "admin" ? "Administrador" : "Usuario"}
                </span>
              </div>

              <button type="submit" className="aj-btn-guardar" disabled={guardandoPerfil}>
                {guardandoPerfil ? "Guardando..." : "Guardar cambios"}
              </button>
            </form>
          </div>
        )}

        {/* ── TAB SEGURIDAD ── */}
        {tabActivo === "Seguridad" && (
          <div className="aj-card">
            <h3>Cambiar contraseña</h3>
            <Alerta msg={mensajePass} />

            <form onSubmit={cambiarPassword} className="aj-form">
              {[
                { key: "actual",    label: "Contraseña actual *",    placeholder: "••••••••" },
                { key: "nueva",     label: "Nueva contraseña *",      placeholder: "Mínimo 6 caracteres" },
                { key: "confirmar", label: "Confirmar nueva contraseña *", placeholder: "Repite la nueva contraseña" },
              ].map(({ key, label, placeholder }) => (
                <div className="aj-field" key={key}>
                  <label>{label}</label>
                  <div className="aj-pass-wrap">
                    <input
                      type={verPass[key] ? "text" : "password"}
                      placeholder={placeholder}
                      value={passForm[key]}
                      onChange={(e) => setPassForm((p) => ({ ...p, [key]: e.target.value }))}
                    />
                    <button
                      type="button"
                      className="aj-eye-btn"
                      onClick={() => setVerPass((p) => ({ ...p, [key]: !p[key] }))}
                    >
                      {verPass[key] ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              ))}

              <button type="submit" className="aj-btn-guardar" disabled={guardandoPass}>
                {guardandoPass ? "Actualizando..." : "Cambiar contraseña"}
              </button>
            </form>

            {/* ZONA PELIGRO */}
            <div className="aj-zona-peligro">
              <h4>Zona de peligro</h4>
              <p>Cerrar sesión eliminará tu token de acceso del dispositivo actual.</p>
              <button className="aj-btn-danger" onClick={() => { cerrarSesion(); onLogout(); }}>
                Cerrar sesión
              </button>
            </div>
          </div>
        )}

        {/* ── TAB NOTIFICACIONES ── */}
        {tabActivo === "Notificaciones" && (
          <div className="aj-card">
            <h3>Preferencias de notificación</h3>
            <Alerta msg={mensajeNotif} />

            <div className="aj-notif-list">
              {[
                { key: "vacunas",       label: "Recordatorios de vacunas",    desc: "Aviso días antes de que venza una vacuna." },
                { key: "citas",         label: "Próximas citas",              desc: "Notificación el día anterior a una cita." },
                { key: "medicamentos",  label: "Alertas de medicamentos",     desc: "Aviso cuando un medicamento esté por terminar." },
                { key: "recordatorios", label: "Recordatorios generales",     desc: "Recordatorios personalizados que hayas creado." },
              ].map(({ key, label, desc }) => (
                <div key={key} className="aj-notif-row">
                  <div className="aj-notif-info">
                    <strong>{label}</strong>
                    <p>{desc}</p>
                  </div>
                  <Toggle activo={notif[key]} onChange={() => toggleNotif(key)} />
                </div>
              ))}
            </div>

            <button
              className="aj-btn-guardar"
              onClick={guardarNotificaciones}
              disabled={guardandoNotif}
            >
              {guardandoNotif ? "Guardando..." : "Guardar preferencias"}
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

export default Ajustes;
