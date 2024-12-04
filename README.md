# Smart Elevator Control System 📱🛗

![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![Bluetooth](https://img.shields.io/badge/Bluetooth-5.0+-brightgreen.svg)
![UWB](https://img.shields.io/badge/UWB-Enabled-orange.svg)
![Platform](https://img.shields.io/badge/platform-iOS%20|%20Android-lightgrey.svg)

基于蓝牙和UWB技术的智能电梯控制系统，实现手机自动感知电梯并进行智能控制，提供便捷的楼层选择和等待时间预测功能。

## 📑 目录

- [核心功能](#-核心功能)
- [技术架构](#-技术架构)
- [系统设计](#-系统设计)
- [快速开始](#-快速开始)
- [详细文档](#-详细文档)
- [开发计划](#-开发计划)
- [常见问题](#-常见问题)
- [贡献指南](#-贡献指南)
- [开源协议](#-开源协议)

## ✨ 核心功能

### 基础功能
- 🎯 **自动感知**
  - 进入电梯自动检测
  - 智能弹出控制界面
  - 实时楼层显示
- 🔝 **智能控制**
  - 手机选择目标楼层
  - 快捷楼层设置
  - 紧急呼叫支持
- ⏱️ **等待预测**
  - 实时显示预计等待时间
  - 电梯运行状态监控
  - 高峰时段智能提示

### 高级功能
- 📍 **UWB精确定位**
  - 厘米级室内定位
  - 多人同时使用识别
  - 智能防干扰
- 🔐 **安全机制**
  - 加密通信
  - 身份认证
  - 操作日志记录

## 🛠️ 技术架构

### 移动端
- **框架**: React Native 0.70+
- **状态管理**: Redux + Redux Toolkit
- **通信协议**: 
  - Bluetooth Low Energy (BLE) 5.0
  - Ultra-wideband (UWB)
- **UI组件**: React Native Paper
- **导航**: React Navigation 6.x

### 后端服务
- **运行环境**: Node.js 16+
- **Web框架**: Express.js
- **实时通信**: WebSocket
- **数据库**: 
  - MongoDB (主数据库)
  - Redis (缓存)
- **消息队列**: RabbitMQ

### 硬件设备
- **定位系统**: UWB基站 (精度: 10cm)
- **通信模块**: 蓝牙5.0
- **控制器**: STM32 MCU
- **接口转换**: RS485

## 📐 系统设计

### 系统架构图



## 🚀 快速开始

### 环境要求
- Node.js 16+
- React Native 0.70+
- Android 6.0+ / iOS 13+
- 支持蓝牙5.0及UWB的设备
- MongoDB 4.4+
- Redis 6.0+

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/yourusername/smart-elevator-control.git
cd smart-elevator-control
```

2. **安装依赖**
```bash
npm install
```
3. **配置环境**
```bash
cp .env.example .env
# 编辑 .env 文件配置必要的环境变量
```
4. **运行项目**
```bash
# 启动开发服务器
npm start

# Android
npm run android

# iOS
npm run ios
```

## 📱 应用界面

### 主要功能界面

#### 1. 电梯控制面板
- 实时楼层显示
- 目标楼层选择
- 等待时间预测
- 紧急呼叫按钮

#### 2. 设置界面
- 蓝牙配对管理
- 常用楼层设置
- 通知提醒设置
- 安全认证配置

#### 3. 个人中心
- 使用记录查看
- 偏好设置
- 账号管理
- 帮助中心

## 🔄 开发计划
### 近期计划 (v1.0)
 - 多梯联动调度算法优化
 - 高峰时段智能分流
 - 紧急情况处理机制
 - 支持更多类型的电梯系统
 - 开发管理后台
### 长期计划
 - AI预测乘梯高峰
 - 智能电梯群控
 - VIP乘客优先级
 - 声控操作支持
## ❓ 常见问题
### Q1: 如何处理电梯离线情况？
系统会自动切换到备用通信模式，同时向管理员发送警报。详细的处理流程请参考故障处理文档。

### Q2: 支持哪些型号的电梯？
目前支持主流品牌的标准接口电梯，详见兼容性列表。

### Q3: 如何确保系统安全性？
采用多重加密机制，详见安全文档。

## 👥 贡献指南
我们欢迎所有形式的贡献，包括但不限于：

- 提交问题和建议
- 改进文档
- 提交代码修复
- 添加新功能
- 提交PR前检查清单：
   - 更新测试用例
   - 遵循代码规范
   - 更新相关文档
详细信息请参考贡献指南

## 📄 开源协议
本项目采用 MIT 许可证

## 📮 联系我们
- 问题反馈: Github Issues
- 邮箱: chenjiafu_george@163.com
  
## 🙏 致谢
感谢以下开源项目：

- React Native
- React Navigation
- Redux Toolkit
- React Native Paper

---

**温馨提示**：使用过程中如遇任何问题，请及时与我们联系！

