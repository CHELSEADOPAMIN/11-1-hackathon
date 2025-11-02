# 🤖 AI 患者关怀系统

## 系统概述

这是一个基于 Gemini AI 的智能患者关怀系统，能够自动分析患者的康复进度和参与度，识别有脱落风险的患者，并发送个性化的关怀邮件。

## 🌟 核心功能

### 1. AI 风险分析师 (The Analyst)
- 分析患者的多维度数据
- 使用 Gemini AI 进行智能风险评估
- 生成 1-10 分的脱落风险评分

### 2. AI 关怀伙伴 (The Companion)
- 为高风险患者生成个性化关怀邮件
- 温暖、真诚的语调
- 鼓励患者回到社区

### 3. 自动化工作流
- 定时任务自动执行分析
- 邮件自动发送
- 管理员监控面板

## 📊 分析维度

系统分析以下关键指标：

### 参与度指标
- **家庭作业完成率**: 最近一周的康复运动完成百分比
- **平台活跃度**: 登录频率、社区互动情况
- **预约行为**: 取消预约、缺席记录

### 进展指标
- **疼痛趋势**: 改善/停滞/恶化
- **目标达成率**: 康复目标完成情况

### 情感指标
- **社区发帖情感分析**: AI 分析帖子中的情绪倾向
- **语气变化**: 从积极到消极的转变

## 🚀 快速开始

### 1. 环境配置

创建 `.env.local` 文件：

```bash
# AI Configuration
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

# Email Configuration (可选，用于真实邮件发送)
RESEND_API_KEY=your_resend_api_key_here

# Cron Job Security (生产环境必需)
CRON_SECRET=your_secure_random_string

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. 获取 API 密钥

#### Gemini AI API Key
1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 创建新的 API 密钥
3. 复制密钥到 `.env.local`

#### Resend API Key (可选)
1. 访问 [Resend](https://resend.com)
2. 注册账户并获取 API 密钥
3. 复制密钥到 `.env.local`

### 3. 启动应用

```bash
pnpm dev
```

## 🎯 使用方法

### 管理员面板

访问管理员面板：
```
http://localhost:3000/admin/patient-care
```

#### 功能说明：
- **Run Analysis**: 立即分析所有患者
- **Simulate Cron**: 模拟定时任务执行
- **查看详细结果**: 点击患者行查看完整分析

### API 端点

#### 1. 患者分析 API
```bash
POST /api/analyze-patients
Content-Type: application/json

{
  "patientIds": ["1", "2"] // 可选，不提供则分析所有患者
}
```

#### 2. 定时任务端点
```bash
GET /api/cron/patient-care
Authorization: Bearer YOUR_CRON_SECRET
```

#### 3. 手动触发
```bash
POST /api/cron/patient-care
Content-Type: application/json

{
  "secret": "test-manual-trigger"
}
```

## 📧 邮件系统

### 演示模式
如果没有配置 `RESEND_API_KEY`，系统将运行在演示模式：
- 邮件内容会在控制台输出
- 不会发送真实邮件
- 适合开发和测试

### 生产模式
配置 `RESEND_API_KEY` 后：
- 发送真实邮件到患者邮箱
- 使用专业的邮件模板
- 包含品牌化设计

## ⏰ 定时任务

### Vercel Cron Jobs
系统配置为每天凌晨 2 点自动运行：

```json
{
  "crons": [
    {
      "path": "/api/cron/patient-care",
      "schedule": "0 2 * * *"
    }
  ]
}
```

### 时间表说明
- `0 2 * * *`: 每天凌晨 2:00 UTC
- 可根据需要调整频率（每天、每三天等）

## 🔧 自定义配置

### 风险阈值
在 `/src/app/api/analyze-patients/route.ts` 中修改：

```typescript
// 当前阈值：7分及以上发送邮件
if (riskAnalysis.riskScore >= 7) {
  // 发送关怀邮件
}
```

### AI 提示词
在 `/src/lib/ai.ts` 中自定义 AI 分析提示：

```typescript
const prompt = `
# 在这里修改 AI 分析提示词
# 可以调整分析标准、输出格式等
`
```

### 邮件模板
在 `/src/lib/email.ts` 中自定义邮件样式：

```typescript
// 修改 HTML 邮件模板
// 调整颜色、布局、品牌元素
```

## 📈 监控和日志

### 控制台日志
系统提供详细的日志输出：

```
🔍 Analyzing patient: Sarah Johnson
📊 Sarah Johnson: Risk Score 8/10
🚨 High risk detected for Sarah Johnson
✅ Care email sent to Sarah Johnson
```

### 管理面板统计
- 分析患者总数
- 高风险患者数量
- 发送邮件数量
- 执行时间

## 🛡️ 安全考虑

### API 安全
- Cron 端点使用 Bearer Token 认证
- 手动触发需要密钥验证
- 生产环境请使用强密码

### 数据隐私
- 患者数据仅用于分析
- 不存储敏感信息
- 遵循医疗数据保护规范

## 🚀 部署到 Vercel

### 1. 环境变量设置
在 Vercel Dashboard 中设置：
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `RESEND_API_KEY` (可选)
- `CRON_SECRET`
- `NEXT_PUBLIC_APP_URL`

### 2. 自动部署
```bash
git push origin main
```

### 3. 验证 Cron Jobs
部署后在 Vercel Dashboard 的 "Functions" 标签中查看 Cron Jobs 状态。

## 🔍 故障排除

### 常见问题

#### 1. AI 分析失败
- 检查 `GOOGLE_GENERATIVE_AI_API_KEY` 是否正确
- 确认 API 密钥有足够的配额
- 查看控制台错误日志

#### 2. 邮件发送失败
- 验证 `RESEND_API_KEY` 配置
- 检查邮件地址格式
- 确认 Resend 账户状态

#### 3. Cron Job 不执行
- 确认 `vercel.json` 配置正确
- 检查 `CRON_SECRET` 环境变量
- 在 Vercel Dashboard 查看函数日志

## 📝 示例数据

系统包含 4 个模拟患者：

1. **Alex Chen** (低风险) - 积极参与，进展良好
2. **Sarah Johnson** (高风险) - 参与度下降，情绪消极
3. **Mike Wilson** (极高风险) - 严重脱落风险
4. **Emma Davis** (中等风险) - 稳定进展

## 🎯 未来扩展

### 可能的增强功能
- 多语言支持
- 更复杂的风险模型
- 患者反馈收集
- 治疗师通知系统
- 数据可视化图表

### 集成建议
- 与现有 EMR 系统集成
- 添加 SMS 通知
- 集成视频通话提醒
- 移动应用推送通知

---

## 💡 技术架构

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Vercel Cron   │───▶│  AI Analysis │───▶│  Email Service  │
│   (定时触发)     │    │  (Gemini AI) │    │   (Resend)      │
└─────────────────┘    └──────────────┘    └─────────────────┘
         │                       │                    │
         ▼                       ▼                    ▼
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│  Patient Data   │    │ Risk Scoring │    │   Care Emails   │
│  (Mock/Real DB) │    │   (1-10)     │    │  (Personalized) │
└─────────────────┘    └──────────────┘    └─────────────────┘
```

这个系统为您的康复伙伴平台提供了一个完整的、基于 AI 的患者关怀解决方案！🎉
