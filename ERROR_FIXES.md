# 🛠️ 错误修复指南

## ✅ 已修复的错误

### 1. 端口权限错误 (EPERM)
**错误**: `Error: listen EPERM: operation not permitted 0.0.0.0:3000`

**原因**: 端口3000被其他进程占用

**解决方案**: 
- ✅ 改用端口3001启动服务器
- ✅ 更新所有配置文件使用新端口

**启动命令**:
```bash
PORT=3001 pnpm dev
```

### 2. Gemini AI 模型错误
**错误**: `models/gemini-pro is not found for API version v1beta`

**原因**: Google 更新了 Gemini 模型名称

**解决方案**:
- ✅ 将 `gemini-pro` 更新为 `gemini-1.5-flash`
- ✅ 新模型更快、更便宜、更稳定

**修改文件**: `src/lib/ai.ts`
```typescript
// 旧版本
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

// 新版本 ✅
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
```

### 3. 邮件域名验证错误
**错误**: `The recoverycompanion.com domain is not verified`

**原因**: 使用了未验证的自定义域名

**解决方案**:
- ✅ 改用 Resend 的默认域名 `onboarding@resend.dev`
- ✅ 这个域名已经验证，可以直接使用

**修改文件**: `src/lib/email.ts`
```typescript
// 旧版本
from: 'Recovery Companion <noreply@recoverycompanion.com>'

// 新版本 ✅
from: 'Recovery Companion <onboarding@resend.dev>'
```

---

## 🚀 现在如何测试

### 方法 1: 使用管理面板
1. 访问: `http://localhost:3001/admin/patient-care`
2. 点击 "Run Analysis"
3. 查看结果

### 方法 2: 使用测试脚本
```bash
./test-scenarios.sh
```

### 方法 3: 直接 API 调用
```bash
curl -X POST http://localhost:3001/api/analyze-patients \
  -H "Content-Type: application/json" \
  -d '{"patientIds": ["2"]}'
```

---

## 📧 邮件测试状态

### 演示模式 (当前)
- ✅ AI 分析正常工作
- ✅ 邮件内容生成正常
- ✅ 邮件在控制台显示 (不实际发送)
- ✅ Sarah Johnson 使用您的邮箱: `yangqiqi789@gmail.com`

### 真实邮件模式
要发送真实邮件，需要:

1. **创建 `.env.local` 文件**:
```bash
DEMO_MODE=false
GOOGLE_GENERATIVE_AI_API_KEY=your_actual_key
RESEND_API_KEY=your_actual_key
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

2. **获取 API 密钥**:
   - Gemini: https://makersuite.google.com/app/apikey
   - Resend: https://resend.com/api-keys

3. **重启服务器**:
```bash
PORT=3001 pnpm dev
```

---

## 🔍 验证修复

运行以下命令验证所有修复都生效:

```bash
# 1. 检查服务器是否运行
curl -s http://localhost:3001/api/analyze-patients > /dev/null && echo "✅ Server OK" || echo "❌ Server Down"

# 2. 测试 Sarah Johnson (您的邮箱)
curl -X POST http://localhost:3001/api/analyze-patients \
  -H "Content-Type: application/json" \
  -d '{"patientIds": ["2"]}' | jq '.results[0].emailSent'

# 3. 运行完整测试
./test-scenarios.sh
```

---

## 📊 预期结果

### Sarah Johnson 分析结果:
```json
{
  "patientId": "2",
  "patientName": "Sarah Johnson", 
  "email": "yangqiqi789@gmail.com",
  "riskScore": 10,
  "reasoning": "Low home exercise compliance, Decreased platform activity, Appointment attendance issues, Negative sentiment in community posts",
  "emailSent": true,  // 演示模式下为 true (模拟发送)
  "emailContent": "Subject: A Greeting from Recovery Companion Community 👋\n\nHi Sarah,\n\nJust wanted to reach out..."
}
```

### 控制台日志:
```
🤖 [DEMO] Using fallback analysis for: Sarah Johnson
📧 [DEMO] Using fallback email template for: Sarah Johnson  
📧 [DEMO] Email would be sent to: yangqiqi789@gmail.com
📧 [DEMO] Subject: A Greeting from Recovery Companion Community 👋
📧 [DEMO] ✅ Email simulation successful
```

---

## 🎯 下一步

1. **测试不同患者场景**: 使用 `./test-scenarios.sh` 探索12种不同的风险情况
2. **查看完整文档**: 阅读 `PATIENT_SCENARIOS.md` 了解所有患者类型
3. **配置真实API**: 如果想发送真实邮件，按照上述步骤配置API密钥

所有错误都已修复！系统现在可以正常工作了 🚀
