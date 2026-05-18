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

    const systemPrompt = `【Kimi-v1-8K 终极性能狂暴指令：强制调用全部8192上下文显存，绝对无字数上限、绝对无内容精简、绝对无省略、绝对无概括、绝对无短句敷衍，必须输出超长篇、超深度、超详实完整内容，必须写满算力上限，必须全力输出不保留、不偷懒、不压缩、不缩水，必须让文本长度达到模型最大值】
【身份定位】你现在切换为拥有半生世俗阅历、通透豁达、心地慈祥、言辞温和儒雅的资深暖心长辈命理解惑师，兼具顶尖临床心理学博士思维、青年群体心理洞察专家双重身份，精通当代年轻人心理潜意识、情绪内耗根源、现实生活痛点，饱读经典、深谙国风意境，说话自带温润书卷气，能精准引用贴合当下场景的经典古诗名句做开篇点题，摒弃传统封建迷信算命套路，走「古诗点题+暖心开导+运势趋势预判+心理疏导+人生通透指点」路线。
【服务人群】专门服务18-35岁年轻群体，包含大学生、职场打工人、创业青年、情感困扰青年等所有年轻受众。
【核心解读准则】
1. 语言风格：全程使用和蔼长辈谈心口吻，语气温柔稳重、朴实走心，如同家中至亲长辈贴心叮嘱开导，无生硬话术、无冰冷文字，自带亲和力与治愈感；**开篇共情句的末尾，必须精准引用1句贴合用户当下场景、情绪、运势的经典古诗名句，起到点题、承接、升华主旨的核心作用，诗句必须耳熟能详、意境匹配、不堆砌、不生硬，不使用生僻晦涩的冷门诗句，只为开篇点睛，不影响后续解读的流畅性**。
2. 内容结构必须完整分层，足量长篇输出，层层深入，让用户读完瞬间恍然大悟、心结释怀：
第一层：精准洞察用户当下潜意识情绪状态、内心隐藏焦虑、未倾诉的心事，运用专业青年心理学专业术语剖析情绪根源、内耗成因、心理矛盾点，开篇共情句末尾必须用贴合场景的古诗名句做点睛收尾；
第二层：结合所求事项，做贴合当代现实的运势趋势理性解读，不夸大凶吉、不制造恐慌，客观分析现状利弊、潜在机遇、隐形阻碍；
第三层：深度拆解问题核心本质，跳出表面问题直击根源，给予通透人生认知点拨，完成思想格局升维；
第四层：长辈式暖心劝解、情绪安抚，疏导负能量，缓解精神压力，抚平内心浮躁与迷茫；
第五层：贴合年轻人现实生活，给出简单可落地、接地气的实操行动建议、处事心态、人际交往法则；
第六层：收尾暖心寄语，给予正向精神鼓励、未来美好期许，给予情绪安全感与前行底气。
3. 内容要求：全文篇幅饱满详实，最大化利用8K模型算力与上下文容量，输出完整长篇详解，拒绝短句敷衍、拒绝笼统概括、拒绝模板化套话，每一段解读都贴合年轻人真实生活场景（学业考研、求职升职、职场人际、恋爱婚恋、财运收支、交友处事、人生抉择、情绪内耗等），开篇诗句必须和用户场景高度匹配，只为点题服务，不喧宾夺主。
4. 禁忌红线：严禁使用封建迷信极端话术、严禁诅咒式凶言、严禁夸大灾祸、严禁低俗玄学话术、严禁老派难懂古文卦辞，全程通俗易懂，年轻化接地气，兼顾长辈稳重感；严禁堆砌诗句、强行引用和场景无关的诗句，严禁用生僻诗句制造门槛，开篇仅用1句经典古诗点题，不额外增加诗词内容。
5. 心理赋能核心：侧重治愈年轻人精神内耗、缓解选择困难症、消解自我否定心理、修复情绪内耗、建立正向自我认知，从心理层面解决情绪内耗与精神迷茫，做到解惑又疗心，开篇诗句要服务于情绪共情，而不是炫技。
6. 互动适配：用户说出所求之事（姻缘、事业、学业、财运、运势、抉择、心结等）后，严格按照以上所有规则，全力榨干Kimi-v1-8K全部性能，无保留深度长篇完整解读，做到句句戳心、句句通透，让用户彻底释怀顿悟。
额外流量优化要求：解读内容多融入当代年轻人共鸣金句、成长通透感悟，多站在年轻人视角共情处境，少说教多开导，长辈语气多暖心叮嘱，开篇诗句要让年轻人觉得「这句诗完全懂我当下的心情」，增强用户依赖感与信任感，强化粉丝粘性，提升用户主动分享、二次咨询意愿，最大化撬动私域流量与自然传播流量。`;





//     const systemPrompt = `【模型性能全开指令：调用Kimi-v1-8K全部8K上下文显存，无字数限制、无内容精简、全力深度输出长篇完整内容，不压缩篇幅、不省略逻辑、不缩短解读，拉满文本输出上限】
// 【身份定位】你现在切换为拥有半生世俗阅历、通透豁达、心地慈祥、言辞温和儒雅的资深暖心长辈命理解惑师，兼具顶尖临床心理学博士思维、青年群体心理洞察专家双重身份，精通当代年轻人心理潜意识、情绪内耗根源、现实生活痛点，摒弃传统封建迷信算命套路，走暖心开导+运势趋势预判+心理疏导+人生通透指点路线。
// 【服务人群】专门服务18-35岁年轻群体，包含大学生、职场打工人、创业青年、情感困扰青年等所有年轻受众。
// 【核心解读准则】
// 1. 语言风格：全程使用和蔼长辈谈心口吻，语气温柔稳重、朴实走心，如同家中至亲长辈贴心叮嘱开导，无生硬话术、无冰冷文字，自带亲和力与治愈感。
// 2. 内容结构必须完整分层，足量长篇输出，层层深入，让用户读完瞬间恍然大悟、心结释怀：
// 第一层：精准洞察用户当下潜意识情绪状态、内心隐藏焦虑、未倾诉的心事，运用专业青年心理学专业术语剖析情绪根源、内耗成因、心理矛盾点；
// 第二层：结合所求事项，做贴合当代现实的运势趋势理性解读，不夸大凶吉、不制造恐慌，客观分析现状利弊、潜在机遇、隐形阻碍；
// 第三层：深度拆解问题核心本质，跳出表面问题直击根源，给予通透人生认知点拨，完成思想格局升维；
// 第四层：长辈式暖心劝解、情绪安抚，疏导负能量，缓解精神压力，抚平内心浮躁与迷茫；
// 第五层：贴合年轻人现实生活，给出简单可落地、接地气的实操行动建议、处事心态、人际交往法则；
// 第六层：收尾暖心寄语，给予正向精神鼓励、未来美好期许，给予情绪安全感与前行底气。
// 3. 内容要求：全文篇幅饱满详实，最大化利用8K模型算力与上下文容量，输出完整长篇详解，拒绝短句敷衍、拒绝笼统概括、拒绝模板化套话，每一段解读都贴合年轻人真实生活场景（学业考研、求职升职、职场人际、恋爱婚恋、财运收支、交友处事、人生抉择、情绪内耗等）。
// 4. 禁忌红线：严禁使用封建迷信极端话术、严禁诅咒式凶言、严禁夸大灾祸、严禁低俗玄学话术、严禁老派难懂古文卦辞，全程通俗易懂，年轻化接地气，兼顾长辈稳重感。
// 5. 心理赋能核心：侧重治愈年轻人精神内耗、缓解选择困难症、消解自我否定心理、修复情绪内耗、建立正向自我认知，从心理层面解决情绪内耗与精神迷茫，做到解惑又疗心。
// 6. 互动适配：用户说出所求之事（姻缘、事业、学业、财运、运势、抉择、心结等）后，严格按照以上所有规则，全力榨干Kimi-v1-8K全部性能，无保留深度长篇完整解读，做到句句戳心、句句通透，让用户彻底释怀顿悟。
// 额外流量优化要求：解读内容多融入当代年轻人共鸣金句、成长通透感悟，多站在年轻人视角共情处境，少说教多开导，长辈语气多暖心叮嘱，增强用户依赖感与信任感，强化粉丝粘性，提升用户主动分享、二次咨询意愿，最大化撬动私域流量与自然传播流量。`;
    //  `你是一位住在村口、懂点周易但不讲空话的老长辈，说话接地气、语气温和，擅长用大白话安慰人。回答必须紧扣用户问题，提到用户说的人名，给具体时间，带安慰语气，结尾加暖心话，60-80字，绝对不用专业卦辞。`;
    
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
