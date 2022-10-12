/* global window */
import lodash from 'lodash'

window.log = (...args) => {
  if (!!window.showLog || window.location.hostname === 'localhost') {
    console.log(...args)
  }
}
/**
 * 加法运算，避免数据相加小数点后产生多位数和计算精度损失。
 * 
 * @param num1加数1 | num2加数2
 */
const numAdd = (num1, num2) => {
  var baseNum, baseNum1, baseNum2;
  try {
    baseNum1 = num1.toString().split('.')[1].length;
  } catch (e) {
    baseNum1 = 0;
  }
  try {
    baseNum2 = num2.toString().split('.')[1].length;
  } catch (e) {
    baseNum2 = 0;
  }
  baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
  return (num1 * baseNum + num2 * baseNum) / baseNum;
};
/**
 * 减法运算，避免数据相减小数点后产生多位数和计算精度损失。
 * 
 * @param num1被减数  |  num2减数
 */
const numSub = (num1, num2) => {
  var baseNum, baseNum1, baseNum2;
  var precision;// 精度
  try {
    baseNum1 = num1.toString().split('.')[1].length;
  } catch (e) {
    baseNum1 = 0;
  }
  try {
    baseNum2 = num2.toString().split('.')[1].length;
  } catch (e) {
    baseNum2 = 0;
  }
  baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
  precision = baseNum1 >= baseNum2 ? baseNum1 : baseNum2;
  return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
};
/**
 * 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。
 * 
 * @param num1被乘数 | num2乘数
 */
const numMulti = (num1, num2) => {
  var baseNum = 0;
  try {
    baseNum += num1.toString().split('.')[1].length;
  } catch (e) {
  }
  try {
    baseNum += num2.toString().split('.')[1].length;
  } catch (e) {
  }
  return Number(num1.toString().replace('.', '')) * Number(num2.toString().replace('.', '')) / Math.pow(10, baseNum);
};
/**
 * 除法运算，避免数据相除小数点后产生多位数和计算精度损失。
 * 
 * @param num1被除数 | num2除数
 */
const numDiv = (num1, num2) => {
  var baseNum1 = 0, baseNum2 = 0;
  var baseNum3, baseNum4;
  try {
    baseNum1 = num1.toString().split('.')[1].length;
  } catch (e) {
    baseNum1 = 0;
  }
  try {
    baseNum2 = num2.toString().split('.')[1].length;
  } catch (e) {
    baseNum2 = 0;
  }

  baseNum3 = Number(num1.toString().replace('.', ''));
  baseNum4 = Number(num2.toString().replace('.', ''));
  return baseNum3 / baseNum4 * Math.pow(10, baseNum2 - baseNum1);

};


String.prototype.Trim = function() {
  return this.replace(/(^\s*)|(\s*$)/g, '');
}
String.prototype.LTrim = function() {
  return this.replace(/(^\s*)/g, '');
}
String.prototype.RTrim = function() {
  return this.replace(/(\s*$)/g, '');
}
Array.prototype.remove = function(val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
// 连字符转驼峰
String.prototype.hyphenToHump = function() {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase()
  })
}

// 驼峰转连字符
String.prototype.humpToHyphen = function() {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化
Date.prototype.format = function(format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds()
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length))
    }
  }
  return format
}


/**
 * @param   {String}
 * @return  {String}
 */

const queryURL = (name, searchStr) => {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  let r = window.location.search.substr(1).match(reg);
  if (searchStr) {
    r = searchStr.substr(1).match(reg);
  }
  if (r != null) {return decodeURI(r[2])}
  return null
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  const item = array.filter(_ => _[keyAlias] === key)
  if (item.length) {
    return item[0]
  }
  return null
}

const randomString = (len) => {
  len = len || 32;
  let $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789';
  let maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

const randomId = () => {
  return String(new Date().getTime());
}

const parseParams = (data) => {
  try {
    var tempArr = [];
    for (var i in data) {
      var key = encodeURIComponent(i);
      var value = encodeURIComponent(data[i]);
      tempArr.push(key + '=' + value);
    }
    var urlParamsStr = tempArr.join('&');
    return urlParamsStr;
  } catch (err) {
    return '';
  }
}

//将科学计数法转换为小数
const NE = (num) => {
  let m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
}

const isEmpty = (obj) => {
  if (typeof obj === 'undefined' || obj === null || obj === '') {
    return true;
  }

  // 检验 undefined 和 null
  if (!obj && obj !== 0) {
    return true;
  }

  if (Array.prototype.isPrototypeOf(obj) && obj.length === 0) {
    return true;
  }

  if (Object.prototype.isPrototypeOf(obj) && Object.keys(obj).length === 0) {
    return true;
  }

  return false;
}

const fNum = (str, tail = 4, ne = 0) => {
  // return parseFloat(Number(str).toFixed(tail));
  if (isEmpty(str)) {str = 0;}
  let num = parseFloat(Number(str).toFixed(tail));

  if (ne) {num = NE(num);}

  return num;
}

const getTailArr = (fromData) => {
  let tailArr = [];
  let formArr = [];
  for (let i = 0; i < fromData.length; i++) {
    formArr = formArr.concat(fromData[i].form);
  }
  for (let i = 0; i < formArr.length; i++) {
    if (formArr[i].type !== 'array') {
      if (formArr[i].tail === '%') {
        tailArr.push(formArr[i].name);
      }
    } else {
      let arrayForm = formArr[i].form;
      for (let j = 0; j < arrayForm.length; j++) {
        if (arrayForm[j].tail === '%') {
          tailArr.push(arrayForm[j].name);
        }
      }
    }
  }
  return tailArr;
}
const formatterNum = (value) => {
  const reg = new RegExp('^[+-]{0,1}(\\d+)$|^[+-]{0,1}(\\d+\\.\\d+)$');
  if (reg.test(String(value))) {
    return fNum(`${numMulti(parseFloat(value), 100)}`, 16);
  }
  return value;
}
const parserNum = (value) => {
  const reg = new RegExp('^[+-]{0,1}(\\d+)$|^[+-]{0,1}(\\d+\\.\\d+)$');
  if (reg.test(String(value))) {
    return fNum(`${numDiv(parseFloat(value), 100)}`, 16);
  }
  return value;
}

const parserValues = (strategyFormData, values) => {
  let tailArr = getTailArr(strategyFormData);
  for (let key in values) {
    if (tailArr.indexOf(key) !== -1) {
      if (Object.prototype.toString.call(values[key]) === '[object Array]') {
        for (let k = 0; k < values[key].length; k++) {
          values[key][k] = parserNum(values[key][k]);
        }
      } else {
        values[key] = parserNum(values[key]);
      }
    }
  }
  return values;
}

// 获取表单元素是否可用参考值
const getPvalue = (formData, name) => {
  let result = null;
  for (let i = 0; i < formData.length; i++) {
    for (let ii = 0; ii < formData[i].form.length; ii++) {
      if (formData[i].form[ii].name === name) {
        result = formData[i].form[ii].value;
        break;
      }
    }
  }
  return result;
}


const getObjFromArray = (arr, key, val) => {
  let result = null;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] == val) {
      result = arr[i];
      break;
    }
  }
  return result;
}

// 科学记数法数字转成可读的数字字符串
const getFullNum = (num) => {
  //处理非数字
  if (isNaN(num)) {return num}

  //处理不需要转换的数字
  var str = '' + num;
  if (!/e/i.test(str)) {return num;}

  return num.toFixed(18).replace(/\.?0+$/, '');
}


const setHeight = () => {
  let hp100 = document.getElementById('hp100');
  let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  if (hp100) {
    hp100.style.height = h + 'px';
  }
}

const fPrice = (s) => {
  if (isNaN(Number(s)) || s === null || typeof s === 'object' || typeof s === 'boolean') {
    return null;
  }
  let b = '';
  if (s < 0) {
    b = '-';
  }
  s = parseFloat((s + '').replace(/[^\d\\.]/g, '')) + '';
  let l = s.split('.')[0].split('').reverse();
  let r = s.split('.')[1];   
  let t = '';   
  for (let i = 0; i < l.length; i ++) {   
    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '');   
  }   
  return b + t.split('').reverse().join('') + (r ? '.' + r : '');   
}
const rPrice = (s) => {
  return parseFloat(s.replace(/[^\d\\.-]/g, '')); 
}


const wanNum = (v, fixedNum = 2, wanFixedNum = 2, ltone = 4) => {
  v = Number(v);
  let result = null
  if (v || v === 0) {
    if (Math.abs(v) >= 10000) {
      result = fPrice(fNum(v / 10000, wanFixedNum, 1)) + 'w';
    } else if (Math.abs(v) < 1) {
      result = fNum(v, ltone, 1);
    } else {
      result = fPrice(fNum(v, fixedNum, 1));
    }
  }
  return result;
}

const yiwanNum = (v, fixedNum = 2) => {
  v = Number(v);
  let result = null
  if (v || v === 0) {
    if (Math.abs(v) >= 10000 && Math.abs(v) < 100000000) { 
      result = fPrice(fNum(v / 10000, fixedNum, 1)) + '万';
    } else if (Math.abs(v) >= 100000000 && Math.abs(v) < 100000000000) {
      result = fPrice(fNum(v / 100000000, fixedNum, 1)) + '亿';
    } else if (Math.abs(v) > 100000000000) {
      result = fPrice(fNum(v / 100000000000, fixedNum, 1)) + '千亿';
    } else if (Math.abs(v) < 1) {
      result = fNum(v, 4, 1);
    } else {
      result = fPrice(fNum(v, fixedNum, 1));
    }
  }
  return result;
}

const deepGet = (data, str, def = null) => {
  if (str.substr) {str = str.split(/\.|\\|\//);}

  if (str.length && data) {
    return deepGet(data[str.shift()], str)
  } else if (!str.length && data) {
    return data
  }
  return def;
}

const getFixedNum = (symbol) => { //POS的规则 取整后4~5位数的币有2位小数点。2~3位数的币有1位小数点
  const spot = fNum(deepGet(window.priceList, `${symbol}.spot`) || 0, 0);
  let len = String(spot).length;
  
  let fixedNum = 0;
  if (len === 2 || len === 3) {
    fixedNum = 1;
  } 
  if (len >= 4) {
    fixedNum = 2; 
  }
  // switch (symbol.toUpperCase()) {
  //   case 'BTC':
  //     fixedNum = 2;
  //     break;
  //   case 'ETH': case 'BCH': case 'LTC':
  //     fixedNum = 1;
  //     break;
  //   default:
  //     fixedNum = 0;
  // }
  return fixedNum;
}

const getPriceFixedNum = (stymbol) => {
  let fixedNum;
  switch (stymbol.toUpperCase()) {
    case 'BTC':
      fixedNum = 1;
      break;
    case 'BCH': case 'BSV': case 'LTC': case 'ETH':
      fixedNum = 2;
      break;
    case 'ETC': case 'EOS':
      fixedNum = 3;
      break;
    case 'XRP':
      fixedNum = 4;
      break;
    case 'TRX': case 'USDT':
      fixedNum = 5;
      break;
    default:
      fixedNum = 3;
      break;
  }
  return fixedNum;
}

const changeIcon = (url) => {
  if (url) {
    const link = document.head.querySelector('link');
    link.href = '/www/favicon/' + url;
  }
}

const fTime = (t, str = 'yyyy-MM-dd hh:mm:ss') => {
  if (t) {
    if ((t + '').length < 12) {
      t = t * 1000;
    }
    return new Date(Number(t)).format(str);
  }
  return '--';
}


// 1.为了获得每个月的日期有多少，我们需要判断 平年闰年[四年一闰，百年不闰，四百年再闰]
const isLeapYear = (year) => {
  return year % 400 === 0 || year % 100 !== 0 && year % 4 === 0;
};
  // 2.获得每个月的日期有多少，注意 month - [0-11]
const getMonthCount = (year, month) => {
  let arr = [
    31, null, 31, 30, 
    31, 30, 31, 31,
    30, 31, 30, 31
  ];
  let count = arr[month] || (isLeapYear(year) ? 29 : 28);
  return Array.from(new Array(count), (item, value) => value + 1);
};
  // 3.获得某年某月的 1号 是星期几，这里要注意的是 JS 的 API-getDay() 是从 [日-六](0-6)，返回 number
const getWeekday = (year, month) => {
  let date = new Date(year, month, 1);
  return date.getDay();
};
  // 4.获得上个月的天数
const getPreMonthCount = (year, month) => {
  if (month === 0) {
    return getMonthCount(year - 1, 11);
  } 
  return getMonthCount(year, month - 1);
    
};
  // 5.获得下个月的天数
const getNextMonthCount = (year, month) => {
  if (month === 11) {
    return getMonthCount(year + 1, 0);
  } 
  return getMonthCount(year, month + 1);
    
};


//得到缩减的标识 如：this_week -> T
function getSim(contract, underlying)
{
  let sim = '';

  if (underlying === 'USD')
  {
    switch (contract)
    {
      case '': case 'spot':
        sim = 'S';
        break;
      case 'swap':
        sim = 'W';
        break;
      case 'this_week':
        sim = 'T';
        break;
      case 'next_week':
        sim = 'N';
        break;
      case 'quarter':
        sim = 'Q';
        break;
      case 'bi_quarter':
        sim = 'B';
        break;
      default:
        break;
    }
  }
  else
  {
    switch (contract)
    {
      case '': case 'spot':
        sim = 'S';
        break;
      case 'swap':
        sim = 'V';
        break;
      case 'this_week':
        sim = 'X';
        break;
      case 'next_week':
        sim = 'Y';
        break;
      case 'quarter':
        sim = 'Z';
        break;
      case 'bi_quarter':
        sim = 'H';
        break;
      default:
        break;
    }
  }

  return sim;
}
const gapSymbol = (symbol, xEx, yEx, xContract, yContract, xUnderlying = 'USD', yUnderlying = 'USD') =>
{
  //debugger
  symbol = symbol.toUpperCase();

  xEx = xEx.toUpperCase();
  yEx = yEx.toUpperCase();

  xContract = xContract.toLowerCase();
  yContract = yContract.toLowerCase();

  let xSim = getSim(xContract, xUnderlying);
  let ySim = getSim(yContract, yUnderlying);

  symbol = `${symbol}_${ySim}${xSim}|${yEx}_${xEx}`;
  if (`${yEx}_${xEx}` === 'OKEX_OKEX') {
    symbol = symbol.replace('|OKEX_OKEX', '');
  }

  return symbol;
}

const gapSymbolTwo = (xSymbol, ySymbol, xEx, yEx, xContract, yContract, xUnderlying = 'USD', yUnderlying = 'USD') =>
{
  //debugger
  xSymbol = xSymbol.toUpperCase();

  xEx = xEx.toUpperCase();
  yEx = yEx.toUpperCase();

  xContract = xContract.toLowerCase();
  yContract = yContract.toLowerCase();

  let xSim = getSim(xContract, xUnderlying);
  let ySim = getSim(yContract, yUnderlying);
 
  xSymbol = `${xSymbol}-${ySymbol}_${ySim}${xSim}|${yEx}_${xEx}`;
  if (`${yEx}_${xEx}` === 'OKEX_OKEX') {
    xSymbol = xSymbol.replace('|OKEX_OKEX', '');
  }
  return xSymbol;
}

const timeDiff = (time1, time2) => {
  const t = time1 - time2;
  const result = fNum(t / 1000 / 3600, 2);
  return result;
}

const bufferToBase64 = (buffer) => {
  let bytes = new Uint8Array(buffer);
  let len = buffer.byteLength;
  let binary = '';
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const sprintf = () => {
  var i = 0, a, f = arguments[i++], o = [], m, p, c, x, s = '';
  while (f) {
    if (m = /^[^\x25]+/.exec(f)) {
      o.push(m[0]);
    }
    else if (m = /^\x25{2}/.exec(f)) {
      o.push('%');
    }
    else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
      if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) {
        throw('Too few arguments.');
      }
      if (/[^s]/.test(m[7]) && (typeof(a) != 'number')) {
        throw('Expecting number but found ' + typeof(a));
      }
      switch (m[7]) {
        case 'b': a = a.toString(2); break;
        case 'c': a = String.fromCharCode(a); break;
        case 'd': a = parseInt(a); break;
        case 'e': a = m[6] ? a.toExponential(m[6]) : a.toExponential(); break;
        case 'f': a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a); break;
        case 'o': a = a.toString(8); break;
        case 's': a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a); break;
        case 'u': a = Math.abs(a); break;
        case 'x': a = a.toString(16); break;
        case 'X': a = a.toString(16).toUpperCase(); break;
      }
      a = (/[def]/.test(m[7]) && m[2] && a >= 0 ? '+'+ a : a);
      c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
      x = m[5] - String(a).length - s.length;
      p = m[5] ? str_repeat(c, x) : '';
      o.push(s + (m[4] ? a + p : p + a));
    }
    else {
      throw('Huh ?!');
    }
    f = f.substring(m[0].length);
  }
  return o.join('');
};

export default {
  queryURL,
  queryArray,
  randomString,
  parseParams,
  fNum,
  numAdd,
  numSub,
  numMulti,
  numDiv,
  parserValues,
  getTailArr,
  formatterNum,
  randomId,
  getPvalue,
  isEmpty,
  getObjFromArray,
  getFullNum,
  NE,
  setHeight,
  fPrice,
  rPrice,
  wanNum,
  yiwanNum,
  deepGet,
  getFixedNum,
  getPriceFixedNum,
  changeIcon,
  fTime,
  isLeapYear,
  getMonthCount,
  getWeekday,
  getPreMonthCount,
  getNextMonthCount,
  gapSymbol,
  gapSymbolTwo,
  timeDiff,
  bufferToBase64,
  sprintf,
}
