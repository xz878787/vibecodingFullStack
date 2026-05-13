/**
 * 墨韵占卜 - AI 问道模块
 * 纯 HTML + JS 版本，可直接嵌入任何页面
 * 
 * 使用方法：
 * 1. 在 HTML 中添加容器: <div id="ai-divination-container"></div>
 * 2. 引入此脚本
 * 3. 调用 initAIDivination() 初始化
 */

// OpenRouter API Key 配置
const OPENROUTER_API_KEY = '{{OPENROUTER_API_KEY}}';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

/**
 * 初始化 AI 占卜模块
 * @param {string} containerId - 容器元素ID，默认为 'ai-divination-container'
 */
function initAIDivination(containerId = 'ai-divination-container') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('AI 占卜模块容器不存在');
    return;
  }

  // 渲染模块HTML
  container.innerHTML = `
    <style>
      /* AI 占卜模块样式 */
      .ai-divination {
        font-family: 'Noto Serif SC', 'STSong', 'SimSun', serif;
        max-width: 500px;
        margin: 0 auto;
      }

      .ai-divination .section-title {
        text-align: center;
        margin-bottom: 1.5rem;
      }

      .ai-divination .section-title h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #3d3835;
        margin: 0;
      }

      .ai-divination .section-title p {
        font-size: 0.875rem;
        color: #8d8474;
        margin-top: 0.5rem;
      }

      .ai-divination .card {
        background-color: #f9f5eb;
        border: 2px solid #bdb8ab;
        border-radius: 0.5rem;
        padding: 1.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .ai-divination .label {
        display: block;
        font-size: 0.875rem;
        color: #756c60;
        margin-bottom: 0.5rem;
      }

      .ai-divination textarea {
        width: 100%;
        padding: 0.75rem 1rem;
        background-color: #fdfcf8;
        border: 2px solid #bdb8ab;
        border-radius: 0.5rem;
        font-family: inherit;
        font-size: 1rem;
        color: #3d3835;
        resize: none;
        box-sizing: border-box;
        transition: all 0.3s ease;
      }

      .ai-divination textarea:focus {
        outline: none;
        border-color: #dc2626;
        box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.1);
      }

      .ai-divination textarea::placeholder {
        color: #a59e8c;
      }

      .ai-divination .char-count {
        text-align: right;
        font-size: 0.75rem;
        color: #a59e8c;
        margin-top: 0.25rem;
      }

      .ai-divination .error-message {
        background-color: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 0.5rem;
        padding: 0.75rem;
        color: #991b1b;
        font-size: 0.875rem;
        margin-bottom: 1rem;
        text-align: center;
      }

      .ai-divination .btn {
        width: 100%;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        font-family: 'Ma Shan Zheng', 'STKaiti', 'KaiTi', serif;
        font-size: 1.125rem;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
      }

      .ai-divination .btn-primary {
        background-color: #991b1b;
        color: #fdfcf8;
      }

      .ai-divination .btn-primary:hover:not(:disabled) {
        background-color: #b91c1c;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(153, 27, 27, 0.3);
      }

      .ai-divination .btn-secondary {
        background-color: #ebeae5;
        color: #5e564e;
      }

      .ai-divination .btn-secondary:hover {
        background-color: #d6d4cb;
      }

      .ai-divination .btn:disabled {
        background-color: #d6d4cb;
        color: #a59e8c;
        cursor: not-allowed;
      }

      .ai-divination .loading-spinner {
        display: inline-block;
        width: 1.25rem;
        height: 1.25rem;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #fdfcf8;
        animation: spin 0.8s linear infinite;
        margin-right: 0.5rem;
        vertical-align: middle;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .ai-divination .result-card {
        background-color: #f9f5eb;
        border: 2px solid #dc2626;
        border-radius: 0.5rem;
        padding: 1.5rem;
        margin-top: 2rem;
        animation: fadeIn 0.8s ease-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(1rem);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .ai-divination .result-header {
        text-align: center;
        margin-bottom: 1rem;
      }

      .ai-divination .result-icon {
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        border: 2px solid #dc2626;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
      }

      .ai-divination .result-icon span {
        font-size: 2rem;
        color: #dc2626;
        font-family: 'Ma Shan Zheng', serif;
      }

      .ai-divination .result-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: #3d3835;
        margin: 0;
      }

      .ai-divination .result-divider {
        width: 4rem;
        height: 1px;
        background: linear-gradient(to right, transparent, #dc2626, transparent);
        margin: 0.5rem auto 0;
      }

      .ai-divination .result-content {
        text-align: center;
        padding: 1rem;
      }

      .ai-divination .result-text {
        font-size: 1.125rem;
        color: #3d3835;
        line-height: 1.8;
        margin: 0;
        white-space: pre-line;
      }

      .ai-divination .result-actions {
        text-align: center;
        margin-top: 1rem;
      }

      .ai-divination .footer-note {
        text-align: center;
        margin-top: 1.5rem;
        font-size: 0.75rem;
        color: #a59e8c;
      }

      /* 移动端适配 */
      @media (max-width: 640px) {
        .ai-divination {
          padding: 0 1rem;
        }
        
        .ai-divination .card,
        .ai-divination .result-card {
          padding: 1rem;
        }
      }
    </style>

    <div class="ai-divination">
      <div class="section-title">
        <h3>AI 问道</h3>
        <p>借助 AI 之力，聆听周易智慧</p>
      </div>

      <div class="card">
        <label class="label">心中所问</label>
        <textarea 
          id="ai-question" 
          rows="4" 
          maxlength="200" 
          placeholder="请输入您想要占卜的问题..."
        ></textarea>
        <div class="char-count" id="ai-char-count">0/200</div>

        <div id="ai-error" class="error-message" style="display: none;"></div>

        <button id="ai-divinate-btn" class="btn btn-primary">
          起卦问卜
        </button>
      </div>

      <div id="ai-result" style="display: none;">
        <div class="result-card">
          <div class="result-header">
            <div class="result-icon">
              <span>卦</span>
            </div>
            <h4 class="result-title">卦象所示</h4>
            <div class="result-divider"></div>
          </div>
          <div class="result-content">
            <p class="result-text" id="ai-result-text"></p>
          </div>
          <div class="result-actions">
            <button id="ai-reset-btn" class="btn btn-secondary">再占一卦</button>
          </div>
        </div>
      </div>

      <div class="footer-note">
        📡 AI 占卜结果仅供参考，命运掌握在自己手中
      </div>
    </div>
  `;

  // 绑定事件
  bindEvents();
}

/**
 * 绑定事件处理
 */
function bindEvents() {
  const questionInput = document.getElementById('ai-question');
  const charCount = document.getElementById('ai-char-count');
  const errorDiv = document.getElementById('ai-error');
  const divinateBtn = document.getElementById('ai-divinate-btn');
  const resultDiv = document.getElementById('ai-result');
  const resultText = document.getElementById('ai-result-text');
  const resetBtn = document.getElementById('ai-reset-btn');

  // 字符计数
  questionInput.addEventListener('input', function() {
    charCount.textContent = `${this.value.length}/200`;
    hideError();
  });

  // 占卜按钮
  divinateBtn.addEventListener('click', async function() {
    const question = questionInput.value.trim();
    
    if (!question) {
      showError('请输入您要占卜的问题');
      return;
    }

    hideError();
    hideResult();
    setLoading(true);

    try {
      const response = await callOpenRouter(question);
      if (response.success) {
        showResult(response.result);
      } else {
        throw new Error(response.error || '占卜失败');
      }
    } catch (error) {
      console.error('AI 占卜错误:', error);
      showError(error.message === '请配置 OpenRouter API Key' ? '请先配置 API Key' : '卦象紊乱，请稍后再试');
    } finally {
      setLoading(false);
    }
  });

  // 重置按钮
  resetBtn.addEventListener('click', function() {
    questionInput.value = '';
    charCount.textContent = '0/200';
    hideResult();
    hideError();
  });
}

/**
 * 调用 OpenRouter API
 */
async function callOpenRouter(question) {
  const apiKey = OPENROUTER_API_KEY;
  
  if (!apiKey || apiKey === '{{OPENROUTER_API_KEY}}') {
    throw new Error('请配置 OpenRouter API Key');
  }

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
  };

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': '墨韵占卜',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error('卦象紊乱，请稍后再试');
  }

  const data = await response.json();
  const result = data.choices[0]?.message?.content || '';

  if (!result.trim()) {
    throw new Error('卦象紊乱，请稍后再试');
  }

  return {
    success: true,
    question,
    result: result.trim(),
  };
}

/**
 * 设置加载状态
 */
function setLoading(isLoading) {
  const btn = document.getElementById('ai-divinate-btn');
  
  if (isLoading) {
    btn.disabled = true;
    btn.innerHTML = '<span class="loading-spinner"></span>卜算中...';
  } else {
    btn.disabled = false;
    btn.innerHTML = '起卦问卜';
  }
}

/**
 * 显示错误
 */
function showError(message) {
  const errorDiv = document.getElementById('ai-error');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

/**
 * 隐藏错误
 */
function hideError() {
  const errorDiv = document.getElementById('ai-error');
  errorDiv.style.display = 'none';
}

/**
 * 显示结果
 */
function showResult(result) {
  const resultDiv = document.getElementById('ai-result');
  const resultText = document.getElementById('ai-result-text');
  
  resultText.textContent = result;
  resultDiv.style.display = 'block';
}

/**
 * 隐藏结果
 */
function hideResult() {
  const resultDiv = document.getElementById('ai-result');
  resultDiv.style.display = 'none';
}

// 自动初始化（如果页面中有 ai-divination-container 元素）
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('ai-divination-container')) {
    initAIDivination();
  }
});

// 导出供外部调用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initAIDivination };
}
