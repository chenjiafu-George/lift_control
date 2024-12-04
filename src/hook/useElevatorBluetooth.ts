import { useState, useRef, useEffect } from 'react';
import { MockBluetoothService } from '../mocks/bluetooth/MockBluetoothService';
import { ELEVATOR_SERVICE } from '../mocks/bluetooth/constants';

interface ElevatorStatus {
    currentFloor: number;
    targetFloor: number | null;
    estimatedTime: number; // 预计到达时间（秒）
    isMoving: boolean;
}

export const useElevatorBluetooth = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [elevatorStatus, setElevatorStatus] = useState<ElevatorStatus>({
        currentFloor: 1,
        targetFloor: null,
        estimatedTime: 0,
        isMoving: false
    });
    const deviceRef = useRef<any>(null);
    const characteristicRef = useRef<any>(null);

    const handleStatusUpdate = (event: any) => {
        const value = new Uint8Array(event.target.value);
        // 假设数据格式: [当前楼层, 目标楼层, 预计剩余时间]
        setElevatorStatus({
            currentFloor: value[0],
            targetFloor: value[1] || null,
            estimatedTime: value[2] || 0,
            isMoving: value[1] !== value[0]
        });
    };

    const connectToDevice = async () => {
        try {
            const mockService = new MockBluetoothService();
            const device = await mockService.simulateDevice();
            deviceRef.current = device;

            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(ELEVATOR_SERVICE.FLOOR_CONTROL.SERVICE_UUID);
            const characteristic = await service.getCharacteristic(
                ELEVATOR_SERVICE.FLOOR_CONTROL.CHARACTERISTIC_UUID
            );

            characteristicRef.current = characteristic;
            await characteristic.startNotifications();
            characteristic.addEventListener('characteristicvaluechanged', handleStatusUpdate);

            const initialValue = await characteristic.readValue();
            setElevatorStatus({
                currentFloor: new Uint8Array(initialValue)[0],
                targetFloor: null,
                estimatedTime: 0,
                isMoving: false
            });

            setIsConnected(true);
        } catch (error) {
            console.error('连接失败:', error);
            setIsConnected(false);
        }
    };

    const sendFloorCommand = async (floor: number) => {
        if (!characteristicRef.current || !isConnected) return;

        try {
            const value = new Uint8Array([floor]);
            await characteristicRef.current.writeValue(value);
        } catch (error) {
            console.error('发送楼层命令失败:', error);
        }
    };

    useEffect(() => {
        return () => {
            if (characteristicRef.current) {
                characteristicRef.current.removeEventListener(
                    'characteristicvaluechanged',
                    handleStatusUpdate
                );
            }
            if (deviceRef.current?.gatt.connected) {
                deviceRef.current.gatt.disconnect();
            }
        };
    }, []);

    return {
        isConnected,
        elevatorStatus,
        connectToDevice,
        sendFloorCommand
    };
};
