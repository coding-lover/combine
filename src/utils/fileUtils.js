
/**
 * 格式化时间差 (毫秒转 "x分y秒")
 * @param {number} time 毫秒数
 * @returns {string} 格式化后的时间
 */
export const formatTimeDifference = (time) => {
    let differenceInSeconds = time / 1000;
    let minutes = Math.floor((differenceInSeconds % 3600) / 60);
    let seconds = (differenceInSeconds % 60).toFixed(2);
    return `${minutes}分${seconds}秒`;
};

/**
 * 获取当前格式化日期时间 (YYYY-MM-DD HH:mm:ss)
 * @returns {string} 格式化后的日期时间
 */
export const getDatetime = () => {
    const dateObj = new Date();
    const fixDate = (num) => (num.toString().length > 1 ? num : "0" + num);

    return dateObj.getFullYear() + '-'
        + fixDate(dateObj.getMonth() + 1) + '-'
        + fixDate(dateObj.getDate()) + ' '
        + fixDate(dateObj.getHours()) + ':'
        + fixDate(dateObj.getMinutes()) + ':'
        + fixDate(dateObj.getSeconds());
};

/**
 * 从字符串中移除指定行数
 * @param {string} fileStr 文件字符串
 * @param {number} line 行数 (正数表示从头移除，负数表示从尾部移除)
 * @returns {string} 处理后的字符串
 */
export const removeLineFromStr = (fileStr, line) => {
    if (!fileStr) return '';
    const splitStr = fileStr.indexOf("\r") !== -1 ? "\r\n" : "\n";
    
    if (line > 0) {
        const linesToRemove = new RegExp(`^(.*?${splitStr}){${line}}`);
        if (fileStr.match(linesToRemove)) {
            return fileStr.replace(linesToRemove, '');
        }
        // 回退逻辑: 如果正则匹配失败，尝试通过分割字符串处理
        let lines = fileStr.split(splitStr);
        return lines.slice(line).join(splitStr);
    }

    if (line < 0) {
        line = Math.abs(line);
        const linesToRemove = new RegExp(`(${splitStr}.*){${line}}$`);
        if (fileStr.match(linesToRemove)) {
            return fileStr.replace(linesToRemove, '');
        }
        // 回退逻辑
        let lines = fileStr.split(splitStr);
        if (lines.length > line) {
            return lines.slice(0, lines.length - line).join(splitStr);
        }
    }

    return fileStr;
};

/**
 * 获取路径的基准名称 (文件名)
 * @param {string} path 路径
 * @returns {string} 文件名
 */
export const basename = (path) => {
    if (!path) return '';
    let idx = path.lastIndexOf('/');
    idx = idx > -1 ? idx : path.lastIndexOf('\\');
    if (idx < 0) {
        return path;
    }
    return path.substring(idx + 1);
};

/**
 * 修复文本域内容的换行符 (针对 Windows)
 * @param {string} content 内容
 * @param {boolean} isWinOs 是否为 Windows
 * @returns {string} 修复后的内容
 */
export const fixTextArea = (content, isWinOs) => {
    if (!isWinOs || !content) {
        return content;
    }
    return content.replace(/\n/g, "\r\n");
};
