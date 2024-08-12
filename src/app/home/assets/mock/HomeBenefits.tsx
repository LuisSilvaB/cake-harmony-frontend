import {
  FaClipboardList,
  FaCashRegister,
  FaChartLine,
  FaUserFriends,
} from "react-icons/fa";
import { HomeBenefitsType } from "@/app/home/types/home-benefits.types";

export const HomeBenefits: HomeBenefitsType[] = [
  {
    id: 1,
    title: "Gestión de Inventario",
    description:
      "Controla y gestiona el inventario de ingredientes y productos terminados en tiempo real.",
    icon: <FaClipboardList />,
  },
  {
    id: 2,
    title: "Ventas y Facturación",
    description:
      "Procesa ventas y genera facturas de manera rápida y optimizando el flujo de caja.",
    icon: <FaCashRegister />,
  },
  {
    id: 3,
    title: "Análisis de Ventas",
    description:
      "Obtén informes detallados sobre las ventas para tomar decisiones informadas.",
    icon: <FaChartLine />,
  },
  {
    id: 4,
    title: "Atención al Cliente",
    description:
      "Ofrece un servicio personalizado a tus clientes, gestionando pedidos especiales.",
    icon: <FaUserFriends />,
  },
];
