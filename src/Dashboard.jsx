import React, { useState } from 'react'
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

const Dashboard = () => {

    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-gray-50">
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
                <Sidebar isOpen={sidebarOpen} />
            </div>

            <div className="flex-1 flex flex-col">
                <Topbar
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                    isSidebarOpen={sidebarOpen}
                />
            </div>
        </div>
    )
}

export default Dashboard