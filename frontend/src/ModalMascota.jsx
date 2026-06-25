import { useState, useEffect, useRef } from "react";
import { api, urlFoto } from "./api";
import "./ModalMascota.css";

const CAMPOS_VACIOS = {
  nombre:  "",
  especie: "",
  raza:    "",
  edad:    "",
  peso:    "",
  sexo:    "",
  color:   "",
};

// tipos de imagen que aceptamos seleccionar (debe coincidir con lo que
// el backend permite en src/middlewares/upload.js)
const TIPOS_IMAGEN_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const TAMANO_MAXIMO_MB = 5;

function ModalMascota({ mascota, onCerrar, onGuardado }) {
  const editando = Boolean(mascota);
  const [form, setForm]       = useState(CAMPOS_VACIOS);
  const [error, setError]     = useState("");
  const [cargando, setCargando] = useState(false);

  // archivo de foto seleccionado (todavia no subido) y su vista previa
  const [archivoFoto, setArchivoFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);
  const inputFotoRef = useRef(null);

  useEffect(() => {
    if (mascota) {
      setForm({
        nombre:  mascota.nombre  || "",
        especie: mascota.especie || "",
        raza:    mascota.raza    || "",
        edad:    mascota.edad    || "",
        peso:    mascota.peso    || "",
        sexo:    mascota.sexo    || "",
        color:   mascota.color   || "",
      });
      // si la mascota ya tiene foto guardada, la mostramos como vista previa inicial
      setPreviewFoto(mascota.foto ? urlFoto(mascota.foto) : null);
    } else {
      setForm(CAMPOS_VACIOS);
      setPreviewFoto(null);
    }
    setArchivoFoto(null);
  }, [mascota]);

  const cambiar = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const elegirFoto = (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    if (!TIPOS_IMAGEN_PERMITIDOS.includes(archivo.type)) {
      setError("La foto debe ser una imagen (jpg, png, webp o gif).");
      e.target.value = "";
      return;
    }

    if (archivo.size > TAMANO_MAXIMO_MB * 1024 * 1024) {
      setError(`La imagen no debe pesar más de ${TAMANO_MAXIMO_MB} MB.`);
      e.target.value = "";
      return;
    }

    setError("");
    setArchivoFoto(archivo);
    setPreviewFoto(URL.createObjectURL(archivo));
  };

  const quitarFoto = () => {
    setArchivoFoto(null);
    setPreviewFoto(null);
    if (inputFotoRef.current) inputFotoRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.nombre || !form.especie) {
      setError("El nombre y la especie son obligatorios.");
      return;
    }

    const payload = {
      ...form,
      edad: form.edad ? Number(form.edad) : null,
      peso: form.peso ? Number(form.peso) : null,
    };

    setCargando(true);
    try {
      let mascotaId;

      if (editando) {
        await api.put(`/mascotas/${mascota.id}`, payload);
        mascotaId = mascota.id;
      } else {
        const creada = await api.post("/mascotas", payload);
        mascotaId = creada.id;
      }

      // si el usuario elegio una foto nueva, la subimos despues de
      // crear/actualizar los datos de la mascota (ya tenemos su id).
      // Si esto falla, los datos de la mascota ya se guardaron bien,
      // asi que no bloqueamos el cierre del modal por este error puntual.
      if (archivoFoto && mascotaId) {
        try {
          await api.uploadFoto(mascotaId, archivoFoto);
        } catch (errFoto) {
          onGuardado();
          alert(
            errFoto.data?.message ||
            "La mascota se guardó, pero la foto no se pudo subir. Puedes intentar subirla otra vez editando la mascota."
          );
          return;
        }
      }

      onGuardado();
    } catch (err) {
      setError(err.data?.message || "Error al guardar. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        <div className="modal-header">
          <h2>{editando ? "Editar mascota" : "Agregar mascota"}</h2>
          <button className="modal-close" onClick={onCerrar}>x</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">

          {/* SELECTOR DE FOTO */}
          <div className="modal-foto-row">
            <div className="modal-foto-preview">
              {previewFoto ? (
                <img src={previewFoto} alt="Vista previa" />
              ) : (
                <span className="modal-foto-placeholder">Sin foto</span>
              )}
            </div>

            <div className="modal-foto-acciones">
              <label className="modal-foto-btn">
                {previewFoto ? "Cambiar foto" : "Subir foto"}
                <input
                  ref={inputFotoRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={elegirFoto}
                  hidden
                />
              </label>
              {previewFoto && (
                <button type="button" className="modal-foto-quitar" onClick={quitarFoto}>
                  Quitar
                </button>
              )}
              <p className="modal-foto-hint">JPG, PNG, WEBP o GIF · máx. {TAMANO_MAXIMO_MB}MB</p>
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label>Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={cambiar}
                placeholder="Ej: Luca"
              />
            </div>

            <div className="modal-field">
              <label>Especie *</label>
              <select name="especie" value={form.especie} onChange={cambiar}>
                <option value="">Seleccionar</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Conejo">Conejo</option>
                <option value="Ave">Ave</option>
                <option value="Reptil">Reptil</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label>Raza</label>
              <input
                type="text"
                name="raza"
                value={form.raza}
                onChange={cambiar}
                placeholder="Ej: Golden Retriever"
              />
            </div>

            <div className="modal-field">
              <label>Sexo</label>
              <select name="sexo" value={form.sexo} onChange={cambiar}>
                <option value="">Seleccionar</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label>Edad (años)</label>
              <input
                type="number"
                name="edad"
                value={form.edad}
                onChange={cambiar}
                placeholder="Ej: 3"
                min="0"
                step="0.5"
              />
            </div>

            <div className="modal-field">
              <label>Peso (kg)</label>
              <input
                type="number"
                name="peso"
                value={form.peso}
                onChange={cambiar}
                placeholder="Ej: 8.5"
                min="0"
                step="0.1"
              />
            </div>
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label>Color</label>
              <input
                type="text"
                name="color"
                value={form.color}
                onChange={cambiar}
                placeholder="Ej: Café y blanco"
              />
            </div>
          </div>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="modal-btn-cancel" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="modal-btn-save" disabled={cargando}>
              {cargando ? "Guardando..." : editando ? "Guardar cambios" : "Agregar mascota"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default ModalMascota;
