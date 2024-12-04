// src/utils/bluetoothTest.ts
export const ELEVATOR_SERVICE_UUID = '00001234-0000-1000-8000-00805f9b34fb'; // 测试用 UUID
export const ELEVATOR_CHARACTERISTIC_UUID = '00001235-0000-1000-8000-00805f9b34fb';

export interface ElevatorData {
    floor: number;
    temperature: number;
    weight: number;
    doorStatus: 'open' | 'closed';
}

export class BluetoothTester {
    static async createMockDevice() {
        // 创建模拟数据
        const mockData: ElevatorData = {
            floor: 3,
            temperature: 25,
            weight: 800,
            doorStatus: 'closed'
        };

        return {
            mockData,
            sendMockData: async () => {
                // 模拟发送数据的方法
                return mockData;
            }
        };
    }
}
