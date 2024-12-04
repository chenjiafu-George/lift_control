export interface MockCharacteristicProperties {
    read: boolean;
    write: boolean;
    notify: boolean;
}

export interface MockBluetoothResponse {
    success: boolean;
    data?: ArrayBuffer;
    error?: string;
}

export interface MockDeviceConfig {
    name: string;
    id: string;
    services: string[];
}
