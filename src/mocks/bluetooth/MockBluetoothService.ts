import { MockBluetoothDevice } from './MockBluetoothDevice';
import { MOCK_DEVICE_NAME, MOCK_DEVICE_ID } from './constants';

export class MockBluetoothService {
    private device: MockBluetoothDevice;

    constructor() {
        this.device = new MockBluetoothDevice();
    }

    async simulateDevice() {
        const mockDevice = {
            name: MOCK_DEVICE_NAME,
            id: MOCK_DEVICE_ID,
            gatt: {
                connected: true,
                connect: async () => {
                    console.log('模拟设备已连接');
                    return mockDevice.gatt;
                },
                disconnect: () => {
                    console.log('模拟设备已断开');
                },
                getPrimaryService: async (serviceId: string) => {
                    console.log('获取服务:', serviceId);
                    return this.createMockService(serviceId);
                }
            }
        };

        return mockDevice;
    }

    private createMockService( _ : string) {
        return {
            getCharacteristic: async ( _ : string) => {
                return {
                    readValue: async () => {
                        return new Uint8Array([this.device.getCurrentFloor()]).buffer;
                    },
                    writeValue: async (value: ArrayBuffer) => {
                        await this.device.handleRequest('floor-control', value);
                    },
                    startNotifications: async () => {
                        console.log('开始通知');
                        return this;
                    },
                    addEventListener: (type: string, callback: (event: any) => void) => {
                        if (type === 'characteristicvaluechanged') {
                            this.device.addNotifyCallback((value: ArrayBuffer) => {
                                callback({ target: { value } });
                            });
                        }
                    },
                    removeEventListener: (type: string, callback: (event: any) => void) => {
                        if (type === 'characteristicvaluechanged') {
                            this.device.removeNotifyCallback(callback);
                        }
                    }
                };
            }
        };
    }
}
