import { createClient } from '@supabase/supabase-js';

// 从环境变量获取配置（需要在 .env 文件中设置）
// VITE_SUPABASE_URL=你的Supabase项目URL
// VITE_SUPABASE_ANON_KEY=你的Supabase anon public key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase 配置缺失，请检查 .env 文件');
}

export const supabase = createClient(
  supabaseUrl || 'https://your-project.supabase.co',  // 替换为你的项目URL
  supabaseAnonKey || 'your-anon-key'                  // 替换为你的anon key
);

/**
 * 发送注册验证码到邮箱
 * @param {string} email - 用户邮箱
 * @returns {Object} - 返回验证ID用于后续验证
 */
export const sendRegisterOTP = async (email) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      shouldCreateUser: false  // 不自动创建用户，先验证邮箱
    }
  });
  
  if (error) throw error;
  return data;
};

/**
 * 验证注册验证码
 * @param {string} email - 用户邮箱
 * @param {string} otpCode - 6位验证码
 * @returns {Object} - 验证结果，包含session信息
 */
export const verifyRegisterOTP = async (email, otpCode) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otpCode,
    type: 'email'
  });
  
  if (error) throw error;
  return data;
};

/**
 * 创建用户（验证验证码后使用）
 * @param {string} email - 用户邮箱
 * @param {string} password - 用户密码
 * @returns {Object} - 用户信息
 */
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`
    }
  });
  
  if (error) throw error;
  return data;
};

/**
 * 用户登录（邮箱+密码）
 * @param {string} email - 用户邮箱
 * @param {string} password - 用户密码
 * @returns {Object} - 用户会话信息
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

/**
 * 用户登出
 * @returns {void}
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * 获取当前登录用户
 * @returns {Object|null} - 当前用户信息
 */
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

/**
 * 监听认证状态变化
 * @param {Function} callback - 状态变化回调函数
 * @returns {Object} - 订阅对象，用于取消订阅
 */
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};

/**
 * 发送密码重置邮件
 * @param {string} email - 用户邮箱
 * @returns {Object} - 发送结果
 */
export const sendPasswordResetEmail = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/`
  });
  
  if (error) throw error;
  return data;
};
