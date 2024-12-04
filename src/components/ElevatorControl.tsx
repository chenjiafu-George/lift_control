import React, { useState } from 'react';
import {
    Bluetooth,
    AlertCircle,
    Loader,
    ThermometerIcon,
    UsersIcon,
    DoorClosed,
    ArrowUpCircle,
    ArrowDownCircle,
} from 'lucide-react';
import { BluetoothTester, ELEVATOR_SERVICE_UUID } from '../utils/bluetoothTest';

const ElevatorControl: React.FC = () => {
    const [status, setStatus] = useState({
        floor: 1,
        direction: 'idle',
        doors: 'closed',
        targetFloor: null,
        capacity: 1000,
        temperature: 23,
        elevatorId: 'ELE-001',
        status: 'operational',
        isConnected: false,
        isMoving: false,
    });

    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>('蓝牙连接失败，请重试');
    const [characteristic, setCharacteristic] = useState<BluetoothRemoteGATTCharacteristic | null>(null);

    const handleBluetoothConnect = async () => {
        try {
            setIsScanning(true);

            if (!navigator.bluetooth) {
                throw new Error('浏览器不支持蓝牙功能');
            }

            console.log('开始请求蓝牙设备...');

            const device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: [ELEVATOR_SERVICE_UUID],
            });

            console.log('设备已选择:', device.name);

            // 连接到设备
            const server = await device.gatt?.connect();
            if (!server) {
                throw new Error('无法连接到 GATT 服务器');
            }

            // 获取服务
            const service = await server.getPrimaryService(ELEVATOR_SERVICE_UUID);
            console.log('已获取服务');

            // 获取特征值
            const char = await service.getCharacteristic('特征值UUID'); // 替换为实际特征值 UUID
            console.log('已获取特征值:', char);

            setCharacteristic(char);
            setStatus((prev) => ({ ...prev, isConnected: true }));
            setError(null);

            // 启用通知（如果设备支持）
            await char.startNotifications();
            char.addEventListener('characteristicvaluechanged', (event) => {
                const value = new TextDecoder().decode(event.target.value);
                console.log('接收到电梯状态更新:', value);

                // 假设接收到的是楼层数据
                setStatus((prevStatus) => ({
                    ...prevStatus,
                    floor: parseInt(value) || prevStatus.floor,
                }));
            });
        } catch (err) {
            console.error('蓝牙连接错误:', err);
            setError(err instanceof Error ? err.message : '连接失败');
        } finally {
            setIsScanning(false);
        }
    };

    const sendFloorCommand = async (targetFloor: number) => {
        if (!characteristic) {
            setError('未连接到蓝牙设备');
            return;
        }

        try {
            const encoder = new TextEncoder();
            await characteristic.writeValue(encoder.encode(`FLOOR:${targetFloor}`));
            console.log(`已发送目标楼层指令: ${targetFloor}`);
        } catch (err) {
            console.error('发送楼层指令失败:', err);
            setError('发送楼层指令失败');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
            {/* 标题栏 */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Bluetooth className={`w-6 h-6 ${status.isConnected ? 'text-green-400' : 'text-gray-300'}`} />
                        <h1 className="text-xl font-semibold">{status.elevatorId}</h1>
                    </div>
                    <button
                        onClick={handleBluetoothConnect}
                        disabled={isScanning || status.isConnected}
                        className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg
              hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 flex items-center space-x-2"
                    >
                        {isScanning ? (
                            <>
                                <Loader className="w-4 h-4 animate-spin" />
                                <span>扫描中...</span>
                            </>
                        ) : '连接电梯'}
                    </button>
                </div>
            </div>

            <div className="p-5 space-y-6">
                {/* 状态信息 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 px-3 py-1.5 border rounded-full text-sm">
                        <DoorClosed className="w-4 h-4 text-blue-500" />
                        <span>门已关闭</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <ThermometerIcon className="w-5 h-5 text-red-500" />
                            <span className="text-gray-700 font-medium">{status.temperature}°C</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <UsersIcon className="w-5 h-5 text-green-500" />
                            <span className="text-gray-700 font-medium">{status.capacity}kg</span>
                        </div>
                    </div>
                </div>

                {/* 当前楼层显示 */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
                    <div className="text-6xl font-bold text-blue-600 mb-2">
                        {status.floor}
                    </div>
                    <div className="text-blue-600/70 font-medium">当前楼层</div>
                    <div className="flex justify-center space-x-4 mt-3">
                        <ArrowUpCircle className="w-6 h-6 text-blue-500" />
                        <ArrowDownCircle className="w-6 h-6 text-blue-500" />
                    </div>
                </div>

                {/* 楼层按钮 */}
                <div className="grid grid-cols-3 gap-3">
                    {[...Array(9)].map((_, i) => (
                        <button
                            key={i + 1}
                            className={`h-14 rounded-xl text-lg font-medium transition-all duration-200
                ${status.floor === i + 1
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-200'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            } ${!status.isConnected && 'opacity-50 cursor-not-allowed'}`}
                            disabled={!status.isConnected}
                            onClick={() => sendFloorCommand(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                {/* 错误提示 */}
                {error && (
                    <div className="flex items-center space-x-2 p-4 bg-red-50 border
            border-red-100 text-red-600 rounded-xl text-sm">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ElevatorControl;
