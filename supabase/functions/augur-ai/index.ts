// 墨韵占卜 - AI 占卜 Edge Function
// 调用 OpenRouter 的 deepseek-chat 模型

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// 环境变量
const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY')
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

serve(async (req) => {
  // 处理 OPTIONS 请求（跨域预检）
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    })
  }

  // 验证请求方法
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    // 解析请求体
    const { question } = await req.json()

    if (!question || typeof question !== 'string') {
      return new Response(JSON.stringify({ error: 'Question is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 构建请求体
    const requestBody = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `你是一位精通周易的道士，身处深山道观之中。
你说话神秘、简短、古风，擅长用周易卦象来解答占卜问题。
回答要言简意赅，充满玄机，使用古汉语风格。
不要解释太多，点到为止，让求卜者自己领悟。
回答不要超过100字。`
        },
        {
          role: 'user',
          content: `卜问：${question}
请为我占卜一卦，用周易之道解惑。`
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    }

    // 调用 OpenRouter API
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenRouter API error:', errorData)
      return new Response(JSON.stringify({ error: 'AI 占卜服务暂时不可用' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = await response.json()
    const result = data.choices[0]?.message?.content || ''

    // 返回结果
    return new Response(JSON.stringify({
      success: true,
      question,
      result: result.trim(),
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })

  } catch (error) {
    console.error('Server error:', error)
    return new Response(JSON.stringify({ error: '服务器内部错误' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
