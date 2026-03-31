
import { invoke } from '@tauri-apps/api';

/**
 * 读取目录内容
 * @param {string} path 目录路径
 * @returns {Promise<Array>} 文件和目录列表
 */
export const readDir = (path) => {
    return invoke('wmc_read_dir', { path }).then(res => {
        let content = JSON.parse(res);
        if (!content || content.length === 0) {
            return [];
        }
        return content.map(item => {
            let parsed = item.split(',');
            return {
                path: fixPath(parsed[0]),
                is_dir: parsed[1] === 'true',
            };
        });
    });
};

/**
 * 写入文件内容
 * @param {string} path 文件路径
 * @param {string} content 文件内容
 * @returns {Promise<any>} 写入结果
 */
export const writeFile = (path, content) => {
    return invoke('wmc_write', { path, content }).then(res => {
        return JSON.parse(res);
    });
};

/**
 * 读取文件内容
 * @param {string} path 文件路径
 * @returns {Promise<string>} 文件内容
 */
export const readFile = (path) => {
    return invoke('wmc_read', { path });
};

/**
 * 修复 Windows 路径中的斜杠
 * @param {string} path 路径
 * @returns {string} 修复后的路径
 */
export const fixPath = (path) => {
    const isWinOs = navigator.userAgent.toLowerCase().indexOf('windows') !== -1;
    if (!isWinOs) {
        return path;
    }
    return path.replace(/\/\//g, '/').replace(/\\/g, '/');
};
