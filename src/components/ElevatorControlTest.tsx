import React from 'react';
import { useElevatorBluetooth } from '../hook/useElevatorBluetooth';

export const ElevatorControlTest: React.FC = () => {
    const { isConnected, elevatorStatus, connectToDevice, sendFloorCommand } = useElevatorBluetooth();

    const renderStatus = () => {
        if (!isConnected) {
            return <div className="text-gray-500">未连接</div>;
        }

        const { currentFloor, targetFloor, estimatedTime, isMoving } = elevatorStatus;

        return (
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200">
                {/* 状态信息卡片 */}
                <div className="grid grid-cols-1 gap-4">
                    {/* 当前楼层 */}
                    <div className="text-center">
                        <div className="text-gray-600 mb-1">当前楼层</div>
                        <div className="text-4xl font-bold text-blue-600">{currentFloor}</div>
                    </div>

                    {/* 目标楼层和时间信息 */}
                    {isMoving && (
                        <div className="border-t pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <div className="text-gray-600 mb-1">目标楼层</div>
                                    <div className="text-2xl font-semibold text-green-600">
                                        {targetFloor}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-gray-600 mb-1">预计时间</div>
                                    <div className="text-2xl font-semibold text-orange-600">
                                        {estimatedTime}秒
                                    </div>
                                </div>
                            </div>

                            {/* 进度条 */}
                            <div className="mt-4">
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-1000"
                                        style={{
                                            width: `${Math.max(0, Math.min(100, (estimatedTime / 10) * 100))}%`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderFloorButtons = () => {
        return (
            <div className="grid grid-cols-3 gap-4 mt-6">
                {[1, 2, 3, 4, 5].map((floor) => (
                    <button
                        key={floor}
                        onClick={() => sendFloorCommand(floor)}
                        disabled={!isConnected || floor === elevatorStatus.currentFloor}
                        className={`
                            py-6 px-6 rounded-lg text-white font-medium text-xl
                            transition duration-200 ease-in-out
                            ${!isConnected || floor === elevatorStatus.currentFloor
                            ? 'bg-gray-400 cursor-not-allowed'
                            : floor === elevatorStatus.targetFloor
                                ? 'bg-blue-500 hover:bg-blue-600'
                                : 'bg-green-500 hover:bg-green-600'
                        }
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        {floor}楼
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                    电梯控制面板 (测试模式)
                </h2>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                        连接状态：
                        <span className={isConnected ? "text-green-600" : "text-red-600"}>
                            {isConnected ? "已连接" : "未连接"}
                        </span>
                    </span>
                    <button
                        onClick={connectToDevice}
                        disabled={isConnected}
                        className={`
                            py-2 px-4 rounded-lg text-sm font-medium
                            transition duration-200 ease-in-out
                            ${isConnected
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }
                        `}
                    >
                        {isConnected ? '已连接' : '重新连接'}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {renderStatus()}
                {renderFloorButtons()}
            </div>
        </div>
    );
};

export default ElevatorControlTest;
