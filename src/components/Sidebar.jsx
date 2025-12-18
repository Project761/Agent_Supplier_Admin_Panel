import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiChevronDown, FiTruck, FiUserCheck, FiCircle } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";

const items = [
  {
    label: "Supplier",
    icon: FiTruck,
    children: [
      { label: "Add Supplier", to: "/supplier", icon: FiPlus },
    ],
  },
  {
    label: "Agent",
    icon: FiUserCheck,
    children: [{ label: "Add Agent", to: "/agent" }],
  },
];

export default function Sidebar({ isOpen }) {
  const { pathname } = useLocation();
  const [openKey, setOpenKey] = useState("Supplier");

  useEffect(() => {
    if (pathname.startsWith("/supplier")) setOpenKey("Supplier");
    if (pathname.startsWith("/agent")) setOpenKey("Agent");
  }, [pathname]);

  const toggle = (label) => setOpenKey((p) => (p === label ? null : label));

  const childCls = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <aside
      className={`h-full bg-white border-r border-slate-200 flex flex-col ${isOpen ? "w-64" : "w-20"
        } transition-all duration-300`}
    >
      <div className="flex items-center justify-center h-16 border-b border-slate-200">
        <h1 className={`font-semibold ${isOpen ? "text-xl" : "text-lg"}`}>
          {isOpen ? "HR Portal" : "HR"}
        </h1>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isExpanded = openKey === item.label;

          return (
            <div key={item.label} className="space-y-1">
              {/* Parent */}
              <button
                type="button"
                onClick={() => toggle(item.label)}
                className={`w-full flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-colors ${isExpanded
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-100"
                  }`}
                title={!isOpen ? item.label : undefined}
              >
                <Icon className="text-lg flex-shrink-0" />
                {isOpen && (
                  <>
                    <span className="truncate flex-1 text-left">{item.label}</span>
                    <FiChevronDown
                      className={`text-lg transition-transform ${isExpanded ? "rotate-180" : ""
                        }`}
                    />
                  </>
                )}
              </button>

              {/* Children */}
              {isOpen && isExpanded && (
                <div className="ml-11 space-y-1">
                  {item.children.map((c) => (
                    <NavLink key={c.label} to={c.to} className={childCls}>
                      <FiCircle className="text-[6px]" />
                      <span className="truncate">{c.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
// export default Sidebar;