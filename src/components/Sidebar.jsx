import React, { useState } from "react";
import { FiChevronDown, FiTruck, FiUserCheck, FiCircle, } from "react-icons/fi";

const items = [
  {
    label: "Supplier",
    icon: FiTruck,
    children: [
      { label: "Add Supplier", href: "#" },
      { label: "Supplier List", href: "#" },
    ],
  },
  {
    label: "Agent",
    icon: FiUserCheck,
    children: [
      { label: "Add Agent", href: "#" },
      { label: "Agent List", href: "#" },
    ],
  },
];

const Sidebar = ({ isOpen }) => {

  const UserData = JSON.parse(localStorage.getItem("UserData"));
  const [openKey, setOpenKey] = useState("Supplier");

  const toggle = (label) => {
    setOpenKey((prev) => (prev === label ? null : label));
  };

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
                    <span className="truncate flex-1 text-left">
                      {item.label}
                    </span>

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
                    <a
                      key={c.label}
                      href={c.href}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                    >
                      <FiCircle className="text-[6px]" />
                      <span className="truncate">{c.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600">
            JD
          </div>
          {isOpen && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                John Doe
              </p>
              <p className="text-xs text-slate-500 truncate">Admin</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
export default Sidebar;