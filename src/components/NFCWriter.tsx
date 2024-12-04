import { useState } from 'react'
import { Save } from 'lucide-react'

interface ElevatorData {
    floor: number
    direction: 'up' | 'down' | 'idle'
    doors: 'open' | 'closed'
    targetFloor: number | null
    lastMaintenance: string
    capacity: number
    temperature: number
    elevatorId: string
    status: 'operational' | 'maintenance' | 'error'
}

const NFCWriter = () => {
    const [isWriting, setIsWriting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    // 默认测试数据
    const [elevatorData, setElevatorData] = useState<ElevatorData>({
        floor: 1,
        direction: 'idle',
        doors: 'closed',
        targetFloor: null,
        lastMaintenance: new Date().toISOString().split('T')[0],
        capacity: 1000,
        temperature: 25,
        elevatorId: 'ELE-001',
        status: 'operational'
    })

    const writeToNFC = async () => {
        if (!('NDEFReader' in window)) {
            setError('此设备不支持 NFC 功能')
            return
        }

        try {
            setIsWriting(true)
            setError(null)
            setSuccess(false)

            // @ts-ignore
            const ndef = new window.NDEFReader()
            await ndef.write({
                records: [{
                    recordType: "text",
                    data: JSON.stringify(elevatorData)
                }]
            })

            setSuccess(true)
            setIsWriting(false)
        } catch (err) {
            setError(`写入失败: ${err instanceof Error ? err.message : '未知错误'}`)
            setIsWriting(false)
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">NFC 标签写入工具</h3>
                <Save className={`w-6 h-6 ${isWriting ? 'text-green-500' : 'text-gray-400'}`} />
            </div>

            <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault()
                writeToNFC()
            }}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">楼层</label>
                        <input
                            type="number"
                            value={elevatorData.floor}
                            onChange={(e) => setElevatorData(prev => ({
                                ...prev,
                                floor: parseInt(e.target.value)
                            }))}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">运行方向</label>
                        <select
                            value={elevatorData.direction}
                            onChange={(e) => setElevatorData(prev => ({
                                ...prev,
                                direction: e.target.value as 'up' | 'down' | 'idle'
                            }))}
                            className="w-full p-2 border rounded"
                        >
                            <option value="idle">待机</option>
                            <option value="up">上行</option>
                            <option value="down">下行</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">门状态</label>
                        <select
                            value={elevatorData.doors}
                            onChange={(e) => setElevatorData(prev => ({
                                ...prev,
                                doors: e.target.value as 'open' | 'closed'
                            }))}
                            className="w-full p-2 border rounded"
                        >
                            <option value="open">开启</option>
                            <option value="closed">关闭</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">温度 (°C)</label>
                        <input
                            type="number"
                            value={elevatorData.temperature}
                            onChange={(e) => setElevatorData(prev => ({
                                ...prev,
                                temperature: parseInt(e.target.value)
                            }))}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isWriting}
                    className={`w-full py-2 px-4 rounded-md ${
                        isWriting
                            ? 'bg-gray-400'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                >
                    {isWriting ? '正在写入...' : '写入 NFC 标签'}
                </button>

                {error && (
                    <div className="text-sm text-red-500 mt-2">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="text-sm text-green-500 mt-2">
                        NFC 标签写入成功！
                    </div>
                )}
            </form>
        </div>
    )
}

export default NFCWriter
