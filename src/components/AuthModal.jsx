import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';

// 注册步骤常量
const REGISTER_STEPS = {
  EMAIL: 'email',        // 第一步：输入邮箱
  OTP: 'otp',            // 第二步：输入验证码
  PASSWORD: 'password'   // 第三步：设置密码
};

// 登录步骤常量
const LOGIN_STEPS = {
  EMAIL: 'email',        // 第一步：输入邮箱
  OTP: 'otp'             // 第二步：输入验证码
};

const AuthModal = ({ isOpen, onClose }) => {
  // 状态管理
  const [isLogin, setIsLogin] = useState(true);           // 登录/注册切换
  const [registerStep, setRegisterStep] = useState(REGISTER_STEPS.EMAIL); // 注册步骤
  const [loginStep, setLoginStep] = useState(LOGIN_STEPS.EMAIL); // 登录步骤
  const [email, setEmail] = useState('');                 // 用户邮箱
  const [otpCode, setOtpCode] = useState('');             // 验证码
  const [password, setPassword] = useState('');           // 密码
  const [confirmPassword, setConfirmPassword] = useState(''); // 确认密码
  const [error, setError] = useState('');                 // 错误信息
  const [message, setMessage] = useState('');             // 提示信息
  const [loading, setLoading] = useState(false);          // 加载状态
  const [otpButtonDisabled, setOtpButtonDisabled] = useState(false); // 验证码按钮禁用
  const [otpCountdown, setOtpCountdown] = useState(0);    // 验证码倒计时

  const { signUp, sendRegisterOTP, verifyRegisterOTP, sendPasswordResetEmail, sendLoginOTP, verifyLoginOTP } = useAuth();

  // 使用 useEffect 在弹窗关闭时重置状态（避免在渲染期间调用 setState）
  useEffect(() => {
    if (!isOpen) {
      // 重置所有状态
      setRegisterStep(REGISTER_STEPS.EMAIL);
      setLoginStep(LOGIN_STEPS.EMAIL);
      setEmail('');
      setOtpCode('');
      setPassword('');
      setConfirmPassword('');
      setError('');
      setMessage('');
      setLoading(false);
      setOtpButtonDisabled(false);
      setOtpCountdown(0);
    }
  }, [isOpen]);

  // 关闭弹窗时直接返回 null（不在渲染期间调用 setState）
  if (!isOpen) {
    return null;
  }

  // 邮箱验证正则
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 发送注册验证码
  const handleSendOTP = async () => {
    if (!email.trim() || !isValidEmail(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await sendRegisterOTP(email);
      setMessage('📧 验证码已发送至您的邮箱，请查收（5分钟内有效）');
      setRegisterStep(REGISTER_STEPS.OTP);
      setOtpButtonDisabled(true);
      
      // 60秒倒计时
      let count = 60;
      setOtpCountdown(count);
      const timer = setInterval(() => {
        count--;
        setOtpCountdown(count);
        if (count <= 0) {
          clearInterval(timer);
          setOtpButtonDisabled(false);
          setOtpCountdown(0);
        }
      }, 1000);
    } catch (err) {
      setError('发送验证码失败，请重试');
      console.error('发送验证码错误:', err);
    } finally {
      setLoading(false);
    }
  };

  // 验证验证码
  const handleVerifyOTP = async () => {
    if (!otpCode.trim() || otpCode.length !== 6) {
      setError('请输入6位验证码');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await verifyRegisterOTP(email, otpCode);
      setMessage('✅ 验证码验证成功，请设置密码');
      setRegisterStep(REGISTER_STEPS.PASSWORD);
      setOtpCode('');
    } catch (err) {
      setError('验证码错误，请重新输入');
      console.error('验证验证码错误:', err);
    } finally {
      setLoading(false);
    }
  };

  // 完成注册
  const handleRegister = async () => {
    if (password.length < 6) {
      setError('密码长度至少6位');
      return;
    }
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await signUp(email, password);
      alert('🎉 注册成功！可直接用邮箱密码登录');
      onClose();
    } catch (err) {
      setError('注册失败，请重试');
      console.error('注册错误:', err);
    } finally {
      setLoading(false);
    }
  };

  // 发送登录验证码
  const handleSendLoginOTP = async () => {
    if (!email.trim() || !isValidEmail(email)) {
      setError('请输入有效的邮箱地址');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await sendLoginOTP(email);
      setMessage('📧 验证码已发送至您的邮箱，请查收（5分钟内有效）');
      setLoginStep(LOGIN_STEPS.OTP);
      setOtpButtonDisabled(true);
      
      // 60秒倒计时
      let count = 60;
      setOtpCountdown(count);
      const timer = setInterval(() => {
        count--;
        setOtpCountdown(count);
        if (count <= 0) {
          clearInterval(timer);
          setOtpButtonDisabled(false);
          setOtpCountdown(0);
        }
      }, 1000);
    } catch (err) {
      setError('发送验证码失败，请重试');
      console.error('发送验证码错误:', err);
    } finally {
      setLoading(false);
    }
  };

  // 验证登录验证码
  const handleVerifyLoginOTP = async () => {
    if (!otpCode.trim() || otpCode.length !== 6) {
      setError('请输入6位验证码');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await verifyLoginOTP(email, otpCode);
      onClose();
    } catch (err) {
      setError('验证码错误，请重新输入');
      console.error('验证验证码错误:', err);
    } finally {
      setLoading(false);
    }
  };

  // 发送重置密码邮件
  const handleForgotPassword = async () => {
    if (!email.trim() || !isValidEmail(email)) {
      setError('请输入您的注册邮箱');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(email);
      setMessage('📧 重置密码链接已发送至您的邮箱');
    } catch (err) {
      setError('发送失败，请重试');
      console.error('发送重置密码邮件错误:', err);
    } finally {
      setLoading(false);
    }
  };

  // 渲染注册表单（分步骤）
  const renderRegisterForm = () => {
    switch (registerStep) {
      case REGISTER_STEPS.EMAIL:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-ink-600 font-song text-xs sm:text-sm mb-1">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-paper-50 border-2 border-ink-300 rounded-lg
                         font-song text-ink-800 placeholder-ink-400 text-sm sm:text-base
                         focus:outline-none focus:border-vermilion-400 focus:ring-2 focus:ring-vermilion-100
                         transition-all duration-300"
                placeholder="请输入邮箱地址"
              />
              <p className="text-ink-400 font-song text-xs mt-1">
                📌 注册需验证邮箱，验证码发送至你的邮箱（5分钟内有效）
              </p>
            </div>

            <button
              type="button"
              onClick={handleSendOTP}
              disabled={loading}
              className={`w-full py-2.5 sm:py-3 font-kai text-base sm:text-lg rounded-lg transition-all duration-300
                         ${loading 
                           ? 'bg-ink-200 text-ink-400 cursor-not-allowed' 
                           : 'bg-ink-900 text-paper-50 hover:bg-ink-800'
                         }`}
            >
              {loading ? '发送中...' : '获取注册验证码'}
            </button>
          </div>
        );

      case REGISTER_STEPS.OTP:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-ink-600 font-song text-xs sm:text-sm mb-1">邮箱</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-paper-50 border-2 border-ink-200 rounded-lg
                         font-song text-ink-600 placeholder-ink-400 cursor-not-allowed text-sm sm:text-base
                         bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-ink-600 font-song text-xs sm:text-sm mb-1">验证码</label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-paper-50 border-2 border-ink-300 rounded-lg
                         font-song text-ink-800 placeholder-ink-400 text-center text-lg sm:text-xl tracking-widest
                         focus:outline-none focus:border-vermilion-400 focus:ring-2 focus:ring-vermilion-100
                         transition-all duration-300"
                placeholder="请输入6位验证码"
              />
              <p className="text-ink-400 font-song text-xs mt-1">
                🔔 验证码已发送至您的邮箱
              </p>
            </div>

            <div className="flex space-x-2 sm:space-x-3">
              <button
                type="button"
                onClick={() => setRegisterStep(REGISTER_STEPS.EMAIL)}
                className="flex-1 py-2.5 sm:py-3 font-kai text-base sm:text-lg rounded-lg bg-paper-50 border-2 border-ink-300
                         text-ink-700 hover:bg-ink-50 transition-all duration-300"
              >
                上一步
              </button>
              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={loading}
                className={`flex-1 py-2.5 sm:py-3 font-kai text-base sm:text-lg rounded-lg transition-all duration-300
                         ${loading 
                           ? 'bg-ink-200 text-ink-400 cursor-not-allowed' 
                           : 'bg-ink-900 text-paper-50 hover:bg-ink-800'
                         }`}
              >
                {loading ? '验证中...' : '下一步'}
              </button>
            </div>
          </div>
        );

      case REGISTER_STEPS.PASSWORD:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-ink-600 font-song text-xs sm:text-sm mb-1">邮箱</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-paper-50 border-2 border-ink-200 rounded-lg
                         font-song text-ink-600 placeholder-ink-400 cursor-not-allowed text-sm sm:text-base
                         bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-ink-600 font-song text-xs sm:text-sm mb-1">设置密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-paper-50 border-2 border-ink-300 rounded-lg
                         font-song text-ink-800 placeholder-ink-400 text-sm sm:text-base
                         focus:outline-none focus:border-vermilion-400 focus:ring-2 focus:ring-vermilion-100
                         transition-all duration-300"
                placeholder="请设置密码（至少6位）"
              />
            </div>

            <div>
              <label className="block text-ink-600 font-song text-xs sm:text-sm mb-1">确认密码</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-paper-50 border-2 border-ink-300 rounded-lg
                         font-song text-ink-800 placeholder-ink-400 text-sm sm:text-base
                         focus:outline-none focus:border-vermilion-400 focus:ring-2 focus:ring-vermilion-100
                         transition-all duration-300"
                placeholder="请再次输入密码"
              />
            </div>

            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className={`w-full py-2.5 sm:py-3 font-kai text-base sm:text-lg rounded-lg transition-all duration-300
                         ${loading 
                           ? 'bg-ink-200 text-ink-400 cursor-not-allowed' 
                           : 'bg-vermilion-600 text-paper-50 hover:bg-vermilion-500'
                         }`}
            >
              {loading ? '注册中...' : '完成注册'}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  // 渲染登录表单（分步骤）
  const renderLoginForm = () => {
    switch (loginStep) {
      case LOGIN_STEPS.EMAIL:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-ink-600 font-song text-xs sm:text-sm mb-1">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-paper-50 border-2 border-ink-300 rounded-lg
                         font-song text-ink-800 placeholder-ink-400 text-sm sm:text-base
                         focus:outline-none focus:border-vermilion-400 focus:ring-2 focus:ring-vermilion-100
                         transition-all duration-300"
                placeholder="请输入邮箱"
              />
              <p className="text-ink-400 font-song text-xs mt-1">
                📌 登录将发送验证码到您的邮箱（5分钟内有效）
              </p>
            </div>

            <button
              type="button"
              onClick={handleSendLoginOTP}
              disabled={loading}
              className={`w-full py-2.5 sm:py-3 font-kai text-base sm:text-lg rounded-lg transition-all duration-300
                         ${loading 
                           ? 'bg-ink-200 text-ink-400 cursor-not-allowed' 
                           : 'bg-ink-900 text-paper-50 hover:bg-ink-800'
                         }`}
            >
              {loading ? '发送中...' : '获取登录验证码'}
            </button>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-vermilion-500 font-song text-xs sm:text-sm hover:text-vermilion-600 transition-colors"
              >
                忘记密码？
              </button>
            </div>
          </div>
        );

      case LOGIN_STEPS.OTP:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-ink-600 font-song text-xs sm:text-sm mb-1">邮箱</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-paper-50 border-2 border-ink-200 rounded-lg
                         font-song text-ink-600 placeholder-ink-400 cursor-not-allowed text-sm sm:text-base
                         bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-ink-600 font-song text-xs sm:text-sm mb-1">验证码</label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-paper-50 border-2 border-ink-300 rounded-lg
                         font-song text-ink-800 placeholder-ink-400 text-center text-lg sm:text-xl tracking-widest
                         focus:outline-none focus:border-vermilion-400 focus:ring-2 focus:ring-vermilion-100
                         transition-all duration-300"
                placeholder="请输入6位验证码"
              />
              <p className="text-ink-400 font-song text-xs mt-1">
                🔔 验证码已发送至您的邮箱
              </p>
            </div>

            <div className="flex space-x-2 sm:space-x-3">
              <button
                type="button"
                onClick={() => {
                  setLoginStep(LOGIN_STEPS.EMAIL);
                  setOtpCode('');
                  setMessage('');
                }}
                className="flex-1 py-2.5 sm:py-3 font-kai text-base sm:text-lg rounded-lg bg-paper-50 border-2 border-ink-300
                         text-ink-700 hover:bg-ink-50 transition-all duration-300"
              >
                上一步
              </button>
              <button
                type="button"
                onClick={handleVerifyLoginOTP}
                disabled={loading}
                className={`flex-1 py-2.5 sm:py-3 font-kai text-base sm:text-lg rounded-lg transition-all duration-300
                         ${loading 
                           ? 'bg-ink-200 text-ink-400 cursor-not-allowed' 
                           : 'bg-ink-900 text-paper-50 hover:bg-ink-800'
                         }`}
              >
                {loading ? '登录中...' : '登录'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md mx-2 sm:mx-4 paper-bg rounded-lg border-2 border-ink-300 shadow-2xl p-4 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 text-ink-400 hover:text-ink-600 transition-colors"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 标题 */}
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-kai text-ink-900 mb-2">
            {isLogin ? '登录账号' : '注册新账号'}
          </h2>
          <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-vermilion-400 to-transparent mx-auto" />
        </div>

        {/* 错误信息 */}
        {error && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-50 border border-red-300 rounded-lg text-red-600 text-xs sm:text-sm font-song">
            {error}
          </div>
        )}

        {/* 提示信息 */}
        {message && !error && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-green-50 border border-green-300 rounded-lg text-green-600 text-xs sm:text-sm font-song">
            {message}
          </div>
        )}

        {/* 表单内容 */}
        {isLogin ? renderLoginForm() : renderRegisterForm()}

        {/* 切换登录/注册链接 */}
        <div className="mt-4 sm:mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setRegisterStep(REGISTER_STEPS.EMAIL);
              setLoginStep(LOGIN_STEPS.EMAIL);
              setError('');
              setMessage('');
              setOtpCode('');
              setPassword('');
              setConfirmPassword('');
            }}
            className="text-ink-500 font-song text-xs sm:text-sm hover:text-vermilion-500 transition-colors"
          >
            {isLogin ? '没有账号？立即注册' : '已有账号？立即登录'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
