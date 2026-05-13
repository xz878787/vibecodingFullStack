// AI 占卜服务 - 使用 Moonshot API
// 风格：乡村老长辈，接地气、暖心、具体

/**
 * Moonshot API 配置
 */
const MOONSHOT_API_KEY = 'sk-V93xjHn5llqI4K3oqVS8IwCZw4XB4RrzOQtsBaLjo70Lc8bT';
const MOONSHOT_API_URL = 'https://api.moonshot.cn/v1/chat/completions';
const MODEL_NAME = 'moonshot-v1-8k';

/**
 * 本地预设回答（API调用失败时使用）
 * 风格：老长辈、接地气、暖心、具体时间
 */
const LOCAL_ANSWERS = {
  // 见面相关
  meet: [
    "娃啊，别着急，缘分天注定。我瞅着半个月内，大概下月初八左右，你们就能见面。放宽心，该来的总会来，顺其自然就好。",
    "孩子，不用愁，见面的日子快了。估摸着下周三下午，或者小满前后，你们就能相聚。耐心等，好事多磨，心里有念想就好。",
    "娃啊，别熬日子，该见面时自然会见面。不出十天，大概五月中旬，你们就能见到。别多想，缘分不骗人，安心等着就好。"
  ],
  
  // 想念相关
  miss: [
    "孩子，想念就说出来，藏心里熬得慌。我看呐，不出一周，你惦记的人就会给你消息。别憋着，心里想着，好事就来了，顺其自然。",
    "娃啊，想他就给他捎个话，别不好意思。大概下周二，或者芒种前后，你们就能联系上。惦记是好事，说明心里有分量，等着就好。",
    "孩子，想念不是坏事，证明你们缘分深。估摸着十天半个月，他就会主动找你。别着急，心里有彼此，距离不是问题，安心就好。"
  ],
  
  // 偶遇相关
  encounter: [
    "娃啊，偶遇讲究个缘分。我瞅着不出二十天，大概五月下旬，你就能在老地方碰到想见的人。顺其自然，该遇见的躲不掉，安心就好。",
    "孩子，偶遇不是偶然，是命中注定。估摸着下周六，或者夏至前后，你就能在街上碰到。别刻意找，缘分到了自然成，放宽心就好。"
  ],
  
  // 通用回答（无具体场景匹配时）
  general: [
    "娃啊，凡事别着急，慢慢来。我看呐，不出半个月，大概五月中旬，好事就会找上门。放宽心，顺其自然，日子总会好起来的。",
    "孩子，不用愁，该来的总会来。估摸着十天左右，你期待的事情就有眉目了。别多想，安心过日子，好运自然来。",
    "娃啊，日子慢慢熬，总有盼头。我瞅着下个月初，或者小满前后，就会有好消息。别着急，顺其自然，一切都会好的。"
  ]
};

/**
 * 获取本地预设回答
 * @param {string} question - 用户问题
 * @returns {string} - 预设回答
 */
const getLocalAnswer = (question) => {
  let category = 'general';
  
  // 根据问题关键词匹配场景
  if (question.includes('见面') || question.includes('相见') || question.includes('碰面')) {
    category = 'meet';
  } else if (question.includes('想') || question.includes('念') || question.includes('惦记')) {
    category = 'miss';
  } else if (question.includes('偶遇') || question.includes('碰到') || question.includes('遇见')) {
    category = 'encounter';
  }
  
  // 随机选择一条
  const answers = LOCAL_ANSWERS[category];
  return answers[Math.floor(Math.random() * answers.length)];
};

/**
 * 延迟函数（模拟思考感）
 * @param {number} ms - 延迟毫秒数
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 从问题中提取人名
 * @param {string} question - 用户问题
 * @returns {string|null} - 提取的人名
 */
const extractName = (question) => {
  // 匹配常见的人名模式（两个字的名字，如尧哥、小红、老王）
  const namePattern = /([\u4e00-\u9fa5]{1,2}(哥|姐|妹|弟|叔|姨|师傅|老师))|([\u4e00-\u9fa5]{2})/g;
  const matches = question.match(namePattern);
  
  if (matches) {
    // 优先返回带称呼的名字（如尧哥）
    const withTitle = matches.find(m => m.includes('哥') || m.includes('姐') || 
      m.includes('妹') || m.includes('弟') || m.includes('叔') || m.includes('姨'));
    return withTitle || matches[0];
  }
  return null;
};

/**
 * 调用 Moonshot AI 占卜服务
 * @param {string} question - 用户的占卜问题
 * @returns {Object} - 包含占卜结果的对象
 */
export const divinateWithAI = async (question) => {
  // 验证问题
  if (!question || !question.trim()) {
    throw new Error('请输入问题');
  }

  const cleanQuestion = question.trim();
  const extractedName = extractName(cleanQuestion);

  // 添加1.5秒加载延迟（模拟思考感）
  await delay(1500);

  try {
    // 构建请求体
    // ============ 核心 Prompt 配置开始 ============
    const systemPrompt = `你是一位住在村口、懂点周易但不讲空话的老长辈，说话接地气、语气温和，擅长用大白话安慰人。回答必须紧扣用户问题，提到用户说的人名，给具体时间，带安慰语气，结尾加暖心话，60-80字，绝对不用专业卦辞。`;
    
    const userPrompt = `用户现在问的是：${cleanQuestion}
请严格按老长辈的风格回答：① 只答用户问的事；② 提到问题里的人名；③ 给具体时间；④ 开头喊"娃啊/孩子"；⑤ 结尾加暖心话；⑥ 全用大白话，60-80字。`;
    // ============ 核心 Prompt 配置结束 ============

    const requestBody = {
      model: MODEL_NAME,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 150,
      temperature: 0.8,
      stream: false
    };

    const response = await fetch(MOONSHOT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${MOONSHOT_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody),
      credentials: 'omit'
    });

    if (!response.ok) {
      // API调用失败，使用本地预设回答
      console.warn('Moonshot API 调用失败，使用本地预设回答');
      const localAnswer = getLocalAnswer(cleanQuestion);
      return {
        success: true,
        question: cleanQuestion,
        result: localAnswer,
        model: 'local',
        name: extractedName
      };
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('未获取到回答');
    }

    let result = data.choices[0]?.message?.content || '';
    result = result.trim();

    // 如果AI回答太短或不符合要求，使用本地预设
    if (!result || result.length < 30) {
      console.warn('AI回答不符合要求，使用本地预设回答');
      result = getLocalAnswer(cleanQuestion);
    }

    return {
      success: true,
      question: cleanQuestion,
      result: result,
      model: MODEL_NAME,
      name: extractedName
    };

  } catch (error) {
    console.error('AI 占卜错误:', error);
    
    // 网络错误、CORS错误、429错误等，使用本地预设回答
    if (error.message === 'Failed to fetch' || 
        error.message.includes('CORS') || 
        error.message.includes('NetworkError') ||
        error.message.includes('429')) {
      console.warn('网络异常，使用本地预设回答');
      const localAnswer = getLocalAnswer(cleanQuestion);
      return {
        success: true,
        question: cleanQuestion,
        result: localAnswer,
        model: 'local',
        name: extractedName
      };
    }
    
    throw error;
  }
};

/**
 * 检查 API 配置状态
 * @returns {Object} - 配置状态信息
 */
export const checkAPIStatus = () => {
  return {
    apiKeyConfigured: MOONSHOT_API_KEY && MOONSHOT_API_KEY.startsWith('sk-'),
    apiUrl: MOONSHOT_API_URL,
    model: MODEL_NAME,
    hasLocalAnswers: true
  };
};
