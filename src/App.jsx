
// import React, { useState } from 'react';
// import Sidebar from './components/Sidebar';
// import Topbar from './components/Topbar';
// import EmployeeTypeCard from './components/EmployeeTypeCard';

// function App() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
//         <Sidebar isOpen={sidebarOpen} />
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Topbar */}
//         <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />

//         {/* Main Content Area */}
//         <main className="flex-1 overflow-y-auto  bg-gray-50">



//         </main>
//       </div>
//     </div>
//   );
// }

// export default App;


import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './Dashboard';
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
