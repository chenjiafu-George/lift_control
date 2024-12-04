import { useState, useEffect, useCallback } from 'react'
import { Smartphone } from 'lucide-react'

interface NFCReaderProps {
    onNFCRead: (data: any) => void
    maxRetries?: number
    retryDelay?: number
}

const NFCReader = ({
                       onNFCRead,
                       maxRetries = 3,
                       retryDelay = 1000
                   }: NFCReaderProps) => {
    const [isNFCSupported, setIsNFCSupported] = useState(false)
    const [isReading, setIsReading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [retryCount, setRetryCount] = useState(0)
    const [lastReadTime, setLastReadTime] = useState<number | null>(null)

    // 检查 NFC 支持
    useEffect(() => {
        if ('NDEFReader' in window) {
            setIsNFCSupported(true)
        }
    }, [])

    // 重试机制
    const retry = useCallback(async () => {
        if (retryCount < maxRetries) {
            setError(`读取失败，${retryDelay/1000}秒后重试... (${retryCount + 1}/${maxRetries})`)
            setTimeout(() => {
                setRetryCount(prev => prev + 1)
                startNFCReader()
            }, retryDelay)
        } else {
            setError('达到最大重试次数，请重新开始')
            setIsReading(false)
            setRetryCount(0)
        }
    }, [retryCount, maxRetries, retryDelay])

    // 数据验证
    const validateData = (data: any) => {
        const requiredFields = ['floor', 'direction', 'doors', 'elevatorId']
        const missingFields = requiredFields.filter(field => !(field in data))

        if (missingFields.length > 0) {
            throw new Error(`数据无效：缺少必要字段 ${missingFields.join(', ')}`)
        }

        // 验证数据范围
        if (data.floor < 1 || data.floor > 100) {
            throw new Error('楼层数据超出有效范围')
        }

        if (!['up', 'down', 'idle'].includes(data.direction)) {
            throw new Error('无效的运行方向')
        }

        return true
    }

    const startNFCReader = async () => {
        if (!isNFCSupported) {
            setError('此设备不支持 NFC 功能')
            return
        }

        try {
            setIsReading(true)
            setError(null)

            // @ts-ignore (因为 TypeScript 可能不认识 NDEFReader)
            const ndef = new window.NDEFReader()

            await ndef.scan()

            ndef.addEventListener("reading", ({ message, serialNumber }) => {
                try {
                    // 防止重复读取（1秒内）
                    const currentTime = Date.now()
                    if (lastReadTime && currentTime - lastReadTime < 1000) {
                        return
                    }
                    setLastReadTime(currentTime)

                    // 解析数据
                    const records = message.records
                    const elevatorData = records.reduce((data: any, record: any) => {
                        if (record.recordType === "text") {
                            const textDecoder = new TextDecoder()
                            const text = textDecoder.decode(record.data)
                            try {
                                const parsed = JSON.parse(text)
                                // 验证数据
                                if (validateData(parsed)) {
                                    return { ...data, ...parsed }
                                }
                            } catch (e) {
                                throw new Error('数据格式无效')
                            }
                        }
                        return data
                    }, {})
                    // 重置重试计数
                    setRetryCount(0)
                    setError(null)

                    // 回调数据
                    onNFCRead({
                        serialNumber,
                        timestamp: new Date().toISOString(),
                        ...elevatorData
                    })

                } catch (error) {
                    console.error('NFC 数据处理错误:', error)
                    setError(`数据处理错误: ${error instanceof Error ? error.message : '未知错误'}`)
                    retry()
                }
            })

        } catch (error) {
            console.error('NFC 读取错误:', error)
            setError(`NFC 读取失败: ${error instanceof Error ? error.message : '未知错误'}`)
            retry()
        }
    }

    const stopNFCReader = () => {
        setIsReading(false)
        setRetryCount(0)
        setError(null)
    }

    return (
        <div className="p-4 border rounded-lg bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">NFC 读取器</h3>
                <Smartphone className={`w-6 h-6 ${isReading ? 'text-green-500' : 'text-gray-400'}`} />
            </div>

            <div className="space-y-4">
                {!isNFCSupported ? (
                    <div className="text-red-500">此设备不支持 NFC 功能</div>
                ) : (
                    <>
                        <button
                            onClick={isReading ? stopNFCReader : startNFCReader}
                            className={`w-full py-2 px-4 rounded-md ${
                                isReading
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                        >
                            {isReading ? '停止读取' : '开始读取 NFC'}
                        </button>

                        {isReading && !error && (
                            <div className="text-sm text-green-500">
                                正在等待 NFC 标签...请将设备靠近电梯的 NFC 标签
                            </div>
                        )}
                    </>
                )}

                {error && (
                    <div className="text-sm text-red-500">
                        {error}
                    </div>
                )}
            </div>
        </div>
    )
}

export default NFCReader
