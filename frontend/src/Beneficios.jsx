import { useState } from "react";
import "./Beneficios.css";
import Sidebar from "./Sidebar";

import {
  FaGift, FaStar, FaCut, FaAppleAlt, FaShoppingBag,
  FaTag, FaCheckCircle, FaCopy,
} from "react-icons/fa";
import { MdPets, MdLocalHospital } from "react-icons/md";

const CATEGORIAS = ["Todos", "Veterinaria", "Alimentos", "Accesorios", "Estética", "Farmacia"];

const BENEFICIOS = [
  {
    id: 1,
    titulo: "20% de descuento en consultas",
    descripcion: "Válido en clínicas veterinarias asociadas a MOCHA. Presenta tu código al momento de la consulta.",
    categoria: "Veterinaria",
    descuento: "20%",
    codigo: "MOCHA-VET20",
    vence: "2025-12-31",
    Icon: MdLocalHospital,
    color: "ben-purple",
  },
  {
    id: 2,
    titulo: "15% en alimentos premium",
    descripcion: "Descuento en marcas seleccionadas de alimento balanceado para perros y gatos.",
    categoria: "Alimentos",
    descuento: "15%",
    codigo: "MOCHA-FOOD15",
    vence: "2025-09-30",
    Icon: FaAppleAlt,
    color: "ben-green",
  },
  {
    id: 3,
    titulo: "Baño y corte con descuento",
    descripcion: "25% de descuento en servicio de estética canina y felina en centros afiliados.",
    categoria: "Estética",
    descuento: "25%",
    codigo: "MOCHA-SPA25",
    vence: "2025-10-15",
    Icon: FaCut,
    color: "ben-pink",
  },
  {
    id: 4,
    titulo: "Accesorios a mitad de precio",
    descripcion: "Compra collares, correas y juguetes con 50% de descuento en tiendas asociadas.",
    categoria: "Accesorios",
    descuento: "50%",
    codigo: "MOCHA-ACC50",
    vence: "2025-08-31",
    Icon: FaShoppingBag,
    color: "ben-orange",
  },
  {
    id: 5,
    titulo: "10% en medicamentos",
    descripcion: "Descuento en farmacias veterinarias seleccionadas. Aplica en medicamentos con receta.",
    categoria: "Farmacia",
    descuento: "10%",
    codigo: "MOCHA-FARM10",
    vence: "2025-11-30",
    Icon: MdLocalHospital,
    color: "ben-blue",
  },
  {
    id: 6,
    titulo: "Vacunación gratuita",
    descripcion: "Primera vacuna de la temporada sin costo en clínicas participantes. Una por mascota.",
    categoria: "Veterinaria",
    descuento: "100%",
    codigo: "MOCHA-VAC100",
    vence: "2025-07-31",
    Icon: MdPets,
    color: "ben-purple",
  },
];

function BeneficioCard({ ben, onCopiar, copiado }) {
  const { titulo, descripcion, categoria, descuento, codigo, vence, Icon, color } = ben;
  const hoy = new Date().toISOString().split("T")[0];
  const expirado = vence < hoy;

  return (
    <div className={`ben-card ${expirado ? "ben-card-expirado" : ""}`}>
      <div className={`ben-icon-wrap ${color}`}>
        <Icon />
      </div>

      <div className="ben-body">
        <div className="ben-top-row">
          <span className="ben-categoria">{categoria}</span>
          {expirado
            ? <span className="ben-badge ben-badge-exp">Expirado</span>
            : <span className="ben-badge ben-badge-ok"><FaCheckCircle /> Activo</span>
          }
        </div>

        <h3>{titulo}</h3>
        <p>{descripcion}</p>

        <div className="ben-footer">
          <div className="ben-descuento-wrap">
            <FaTag />
            <span className="ben-descuento">{descuento} OFF</span>
          </div>

          <div className="ben-codigo-wrap">
            <span className="ben-codigo">{codigo}</span>
            <button
              className="ben-copy-btn"
              onClick={() => onCopiar(codigo)}
              disabled={expirado}
              title="Copiar código"
            >
              {copiado === codigo ? <FaCheckCircle /> : <FaCopy />}
            </button>
          </div>
        </div>

        <p className="ben-vence">Vence: {vence}</p>
      </div>
    </div>
  );
}

function Beneficios({ onNavigate, onLogout, usuario }) {
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [copiado, setCopiado] = useState(null);

  const copiarCodigo = (codigo) => {
    navigator.clipboard.writeText(codigo).catch(() => {});
    setCopiado(codigo);
    setTimeout(() => setCopiado(null), 2000);
  };

  const filtrados = categoriaActiva === "Todos"
    ? BENEFICIOS
    : BENEFICIOS.filter((b) => b.categoria === categoriaActiva);

  const activos   = BENEFICIOS.filter((b) => b.vence >= new Date().toISOString().split("T")[0]).length;
  const ahorroEst = "C$500";

  return (
    <div className="home">
      <Sidebar activo="beneficios" onNavigate={onNavigate} onLogout={onLogout} usuario={usuario} />

      <main className="main-content">

        {/* TOP BAR */}
        <div className="ben-topbar">
          <div className="ben-topbar-left">
            <FaGift className="ben-topbar-icon" />
            <div>
              <h1>Beneficios</h1>
              <p>Descuentos y promociones exclusivas para miembros MOCHA.</p>
            </div>
          </div>
        </div>

        {/* STATS */}
        <section className="ben-stats">
          <div className="ben-stat-card ben-stat-purple">
            <div>
              <strong>{BENEFICIOS.length}</strong>
              <p>Beneficios totales</p>
            </div>
            <FaGift />
          </div>
          <div className="ben-stat-card ben-stat-green">
            <div>
              <strong>{activos}</strong>
              <p>Disponibles ahora</p>
            </div>
            <FaCheckCircle />
          </div>
          <div className="ben-stat-card ben-stat-orange">
            <div>
              <strong>{ahorroEst}</strong>
              <p>Ahorro estimado</p>
            </div>
            <FaStar />
          </div>
        </section>

        {/* FILTROS */}
        <div className="ben-filtros">
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              className={`ben-filtro${categoriaActiva === c ? " ben-filtro-active" : ""}`}
              onClick={() => setCategoriaActiva(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* GRID */}
        <section className="ben-grid">
          {filtrados.map((ben) => (
            <BeneficioCard
              key={ben.id}
              ben={ben}
              onCopiar={copiarCodigo}
              copiado={copiado}
            />
          ))}
        </section>

        {/* BANNER INFERIOR */}
        <div className="ben-banner">
          <FaStar className="ben-banner-star" />
          <div>
            <h3>¿Quieres más beneficios?</h3>
            <p>Invita a un amigo a MOCHA y ambos recibirán un beneficio exclusivo adicional.</p>
          </div>
          <button className="ben-banner-btn">Invitar amigo</button>
        </div>

      </main>
    </div>
  );
}

export default Beneficios;
