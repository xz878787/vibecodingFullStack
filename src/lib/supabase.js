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
 * 用户注册（邮箱+密码）- 直接创建用户，无需验证
 * @param {string} email - 用户邮箱
 * @param {string} password - 用户密码
 * @returns {Object} - 用户信息
 */
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      shouldCreateUser: true  // 自动创建用户，无需邮箱验证
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
