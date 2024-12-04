import React from 'react';
import './index.css'
import ElevatorControl from './components/ElevatorControl';

function App() {
    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
                    电梯控制系统
                </h1>
                <div className="min-h-screen bg-gray-100 p-4">
                    <ElevatorControl />
                </div>
            </div>
        </div>
    );
}

export default App;