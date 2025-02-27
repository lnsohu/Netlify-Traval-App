console.log('[debug]: go into travel.js');
// import supabase from './db.js'; // 默认方式导入 Supabase 客户端

const { supabase } = require('./db');

exports.handler = async (event, context) => {
    console.log('[Debug] event:', event);

    // 解析请求体（如果是 POST/PUT 请求）
    let body = {};
    if (event.body) {
        try {
            body = JSON.parse(event.body);
        } catch (err) {
            console.error('[Debug Error]: Failed to parse request body:', err);
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid request body' }),
            };
        }
    }

    // 解析查询参数（如果是 GET/DELETE 请求）
    const query = event.queryStringParameters || {};
    console.log('[Debug] query:', query);

    try {
        let data, error;

        // 根据请求方法执行不同的操作
        switch (event.httpMethod) {
            case 'GET':
                // 查询旅行记录
                if (query.command === 'get') {
                    console.log('[Debug] get travels');
                    ({ data, error } = await supabase
                        .from('travels')
                        .select('*')
                        .eq('userid', query.userid));
                }
                break;

            case 'POST':
                // 插入旅行记录
                if (query.command === 'insert') {
                    console.log('[Debug] insert travel');
                    ({ data, error } = await supabase
                        .from('travels')
                        .insert([
                            {
                                userid: query.userid,
                                location: query.location,
                                date: query.date,
                                description: query.description,
                            },
                        ]));
                }
                break;

            case 'PUT':
                // 更新旅行记录
                if (query.command === 'update') {
                    console.log('[Debug] update travel');
                    ({ data, error } = await supabase
                        .from('travels')
                        .update({ description: query.description })
                        .eq('id', query.id));
                }
                break;

            case 'DELETE':
                // 删除旅行记录
                if (query.command === 'delete') {
                    console.log('[Debug] delete travel');
                    ({ data, error } = await supabase
                        .from('travels')
                        .delete()
                        .eq('id', query.id));
                }
                break;

            default:
                return {
                    statusCode: 405,
                    body: JSON.stringify({ error: 'Method not allowed' }),
                };
        }

        // 处理错误
        if (error) {
            console.error('[Debug Error]:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Database operation failed' }),
            };
        }

        // 返回成功响应
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (err) {
        console.error('[Debug Error]: Unexpected error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
