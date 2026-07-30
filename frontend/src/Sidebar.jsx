import {
  FaHome,
  FaPaw,
  FaCalendarAlt,
  FaHeartbeat,
  FaGift,
  FaCog,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";
import { MdPets, MdOutlineAnalytics } from "react-icons/md";
import { BsRobot } from "react-icons/bs";

const ITEMS = [
  { id: "home",     label: "Inicio",       Icon: FaHome           },
  { id: "mascotas", label: "Mis Mascotas", Icon: FaPaw            },
  { id: "agenda",   label: "Agenda",       Icon: FaCalendarAlt    },
  { id: "salud",    label: "Salud",        Icon: FaHeartbeat      },
  { id: "mocha-ia", label: "Mocha IA",     Icon: BsRobot          },
  { id: "beneficios",  label: "Beneficios",   Icon: FaGift        },
  //{ id: "veterinarias",label: "Veterinarias", Icon: MdPets        },
  { id: "reportes", label: "Reportes",     Icon: MdOutlineAnalytics },
  { id: "ajustes",  label: "Ajustes",      Icon: FaCog            },
];

function Sidebar({ activo, onNavigate, onLogout, usuario }) {
  const esAdmin = usuario?.rol === "admin";

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>MOCHA</h2>
      </div>

      <nav className="menu">
        {ITEMS.map(({ id, label, Icon }) => (
          <div
            key={id}
            className={`menu-item${activo === id ? " active" : ""}`}
            onClick={() => {
              // Mocha IA se deja para implementar más adelante
              if (id !== "mocha-ia") onNavigate(id);
            }}
          >
            <Icon />
            <span>{label}</span>
          </div>
        ))}

        <div className="menu-item menu-item-logout" onClick={onLogout}>
          <FaSignOutAlt />
          <span>Cerrar sesión</span>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
