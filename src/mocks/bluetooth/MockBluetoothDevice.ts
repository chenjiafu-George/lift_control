
export class MockBluetoothDevice {
    private currentFloor: number = 1;
    private targetFloor: number | null = null;
    private estimatedTime: number = 0;
    private notifyCallbacks: ((value: ArrayBuffer) => void)[] = [];
    private readonly FLOOR_MOVE_TIME = 2; // 每层楼移动时间（秒）

    getCurrentFloor(): number {
        return this.currentFloor;
    }


    async handleRequest(type: string, value: ArrayBuffer): Promise<void> {
        if (type === 'floor-control') {
            const targetFloor = new Uint8Array(value)[0];
            console.log('收到电梯请求，目标楼层:', targetFloor);

            if (targetFloor === this.currentFloor) return;

            this.targetFloor = targetFloor;
            await this.simulateElevatorMovement(targetFloor);
        }
    }

    private calculateEstimatedTime(targetFloor: number): number {
        return Math.abs(targetFloor - this.currentFloor) * this.FLOOR_MOVE_TIME;
    }

    private async simulateElevatorMovement(targetFloor: number) {
        const startFloor = this.currentFloor;
        const direction = targetFloor > startFloor ? 1 : -1;
        let remainingTime = this.calculateEstimatedTime(targetFloor);
        //const totalFloors = Math.abs(targetFloor - startFloor);
        //const timePerFloor = this.FLOOR_MOVE_TIME * 1000; // 转换为毫秒

        this.estimatedTime = remainingTime;
        this.notifyStateChange();

        // 计算总共需要的秒数
        const totalSeconds = remainingTime;

        // 每一秒倒计时
        for (let second = totalSeconds; second > 0; second--) {
            // 计算当前应该在哪一层
            const timeElapsed = totalSeconds - second;
            const floorsCompleted = Math.floor(timeElapsed / this.FLOOR_MOVE_TIME);
            this.currentFloor = startFloor + (direction * floorsCompleted);

            this.estimatedTime = second;
            this.notifyStateChange();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // 到达目标楼层
        this.currentFloor = targetFloor;
        this.targetFloor = null;
        this.estimatedTime = 0;
        this.notifyStateChange();

        // 添加震动提醒
        if ('vibrate' in navigator) {
            navigator.vibrate(200);
        }
    }

    private notifyStateChange() {
        // 发送状态更新：[当前楼层, 目标楼层, 预计剩余时间]
        const value = new Uint8Array([
            this.currentFloor,
            this.targetFloor || this.currentFloor,
            this.estimatedTime
        ]).buffer;
        this.notifyCallbacks.forEach(callback => callback(value));
    }

    addNotifyCallback(callback: (value: ArrayBuffer) => void) {
        this.notifyCallbacks.push(callback);
    }

    removeNotifyCallback(callback: (value: ArrayBuffer) => void) {
        this.notifyCallbacks = this.notifyCallbacks.filter(cb => cb !== callback);
    }
}
