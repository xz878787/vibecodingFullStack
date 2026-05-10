import { supabase } from '../lib/supabase';

export const saveDivinationRecord = async (record) => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('获取用户会话失败:', authError);
      throw new Error('获取用户会话失败');
    }

    if (!user) {
      throw new Error('用户未登录，请先登录');
    }

    console.log('当前登录用户:', user.id);
    console.log('要保存的数据:', { question: record.question, result: record.result });

    const { data, error } = await supabase
      .from('divination_records')
      .insert([
        {
          question: record.question,
          result: record.result
        }
      ])
      .select();

    if (error) {
      console.error('保存记录失败:', error);
      throw new Error(`保存失败: ${error.message || '未知错误'}`);
    }

    console.log('保存成功:', data[0]);
    return data[0];
  } catch (err) {
    console.error('saveDivinationRecord 异常:', err);
    throw err;
  }
};

export const getDivinationRecords = async () => {
  try {
    const { data, error } = await supabase
      .from('divination_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取记录失败:', error);
      throw new Error(`获取记录失败: ${error.message}`);
    }

    return data;
  } catch (err) {
    console.error('getDivinationRecords 异常:', err);
    throw err;
  }
};

export const deleteDivinationRecord = async (id) => {
  try {
    const { error } = await supabase
      .from('divination_records')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除记录失败:', error);
      throw new Error(`删除失败: ${error.message}`);
    }
  } catch (err) {
    console.error('deleteDivinationRecord 异常:', err);
    throw err;
  }
};

export const subscribeToRecords = (userId, callback) => {
  return supabase
    .channel('divination_records_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'divination_records',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe();
};
