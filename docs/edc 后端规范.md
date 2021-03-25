
## 项目规约

### 常用
- 【强制】 commit 规范 https://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html
  
### 安全
- 【强制】 用户请求传入的参数必须做有效性验证
- 【强制】 随产品需求, 需脱敏数据API层面进行脱敏

### 前端接口
- 【强制】 接口设计向REST靠近
```
例外：
- 不使用URL params, 需要体现在URL中的参数通过query传递
- 部分动作(如同意、拒绝审批)无法与GET、POST、PUT、DELETE对应, 则将动词放在URL中
```
- 【强制】 前后端交互的JSON格式数据中, 所有的key必须为小写字母开始的`lowerCamelCase`风格, 符合英文表达习惯, 且表意完整
- 【强制】 接口需要进行参数校验。公开接口需要进行入参保护, 尤其是批量操作的接口

## 编程规约

### 命名风格
- 【强制】 所有编程相关的命名严禁使用拼音与英文混合的方式, 更不允许直接使用中文的方式
- 【强制】 文件名和目录名使用下划线作为分隔符
- 【强制】 类名使用`UpperCamelCase`风格
- 【强制】 方法名、参数名、成员变量、局部变量都统一使用`lowerCamelCase`风格
- 【强制】 常量命名全部大写, 单词间用下划线隔开, 力求语义表达完整清楚, 不要嫌名字长
- 【强制】 杜绝完全不规范的缩写, 避免望文不知义。为了达到代码自解释的目标, 任何自定义编程元素在命名时, 使用尽量完整的单词组合来表达
- 【强制】 在常量与变量的命名时, 表示类型的名词放在词尾, 以提升辨识度
```
Bad: startedAt / QueueOfWork / listName / COUNT_TERMINATED_THREAD
Good: startTime / workQueue / nameList / TERMINATED_THREAD_COUNT
```
- 【推荐】 正向命名
```
Bad: isBugNotExists
Good: isBuGExists
```

### 代码检查&风格
- 【强制】 使用`Eslint`检查代码, 使用VS Code可以安装插件`Eslint`
- 【强制】 不允许任何魔法值（即未经预先定义的常量）直接出现在代码中
- 【强制】 除`fw`外不允许使用全局变量
- 【强制】 用`let`代替`var`
- 【强制】 禁止使用Tab, JS与JSON文件4个空格代替Tab
- 【强制】 if/for/while/switch/do等保留字与括号之间都必须加空格
- 【强制】 所有字符串使用单引号`'`非双引号`"`
- 【强制】 代码最后保持一个空白行
- 【强制】 行尾无多余空白
- 【强制】 字面量创建Object与Array, 而不是new
```
Bad: 
let item = new Object();
let items = new Array();

Good: 
let item = {};
let items = [];
```
- 【强制】 对象定义时只对必要的`key`使用引号
```
Bad:
let o = {
    'key': 1,
    'key-key': 2
};

Good: 
let o = {
    key: 1,
    'key-key': 2,
}
```
- 【强制】 优先使用`.`访问对象属性, 变量情况才使用中括号
```
let o = {
    name: 'name',
    age: 18,
};

Bad:
let name = o['name'];

Good:
let age = o.age;

let key = 'name';
console.log(o[key]);
```
- 【强制】 区块代码内部最后保留逗号
```
Bad:
let o = {
    x: 1,
    y: 2
};

Good:
let o = {
    x: 1,
    y: 2,
};
```
- 【推荐】 使用`// TODO`表明待完成代码
- 【推荐】 使用`// FIXME`声明已知问题
```
Good:
// FIXME: shouldn't use a global here
g = 1;
```
- 【推荐】 代码内尽量不用`+`拼接字符串, 使用模板替换语法
```
Bad: s = 'xxxx' + y + 'zzzz'
Good: s = `xxxx${y}zzzz`
```
- 【推荐】 if后的语句块使用`{}`
```
Bad: 
if (false) return;

Good: 
if (false) {
    return;
}
```
- 【推荐】 单行注释`//`与内容之间保留一个空格
```
Bad: //this is comment
Good: // this is comment
```
- 【推荐】 代码块之后留一行空白
```
Bad:
if (false) {
    return x;
}
return y;

let o = {
    a: 1,
    b: 2
};
return o;

Good:
if (false) {
    return x;
}

return y;

let o = {
    a: 1,
    b: 2,
};

return o;
```

### 编码习惯
- 【推荐】 function内直接代码不超过100行
```
Bad:
function x() {
    // ...more than 100 lines of code
}

Good:
function x() {
    do_something_of_a();
    do_something_of_b();
    do_something_of_c();

    function do_something_of_a() {}
    function do_something_of_b() {}
    function do_something_of_c() {}
}
// do_something_of_a/b/c可以起到注释效果, 描述自己内部在做的事情
// do_something_of_a/b/c如果业务独立可复用, 则可相应提取到x外部
```
- 【推荐】 使用`Object.assign`兜底
```
Bad: o.attr = o.attr || 'default'
Good: o = Object.assign({attr: 'default'}, o)
```
- 【推荐】 避免参数列表过长(超过3个), 过多尝试用Object
```
Bad: 
function fn(arg0, arg1, arg2, arg3, arg4...)
fn(1, 2, 3, 4, 5...);

Good:
function fn(opts) {}
fn({
    arg0: 1,
    arg1: 2,
    arg2: 3,
    arg3: 4,
    ...
})
```
- 【推荐】 function保持单一职责
- 【推荐】 非强相关的内容使用event异步通知, 项目中可使用`evbus`
- 【推荐】 表达异常分支时, 少用if-else方式而是if-return
```
if (condition) {
    return;
}

// do something else
```
- 【推荐】 require/exports集中在模块顶部
```
Bad:
// file head
// after 100 lines of code
const x = require('x')
exports.y = function y() {
    // ...
}

Good:
// file head
const x = require('x');
exports.y = y;

// after 1000 lines of code
function y() {
    // ...
}
```

## 数据库规约

### 建表公约
- 【强制】 表名、字段名必须使用小写字母或数字, 禁止出现数字开头, 禁止两个下划线中间只出现数字
- 【强制】 表名不使用复数名词
- 【强制】 主键索引名为pk_字段名；唯一索引名为uk_字段名；普通索引名则为idx_字段名
- 【强制】 小数类型为Numeric
- 【强制】 表必备字段：id, 自增主键
- 【强制】 字段允许适当冗余, 以提高查询性能, 但必须考虑数据一致
```
冗余字段应遵循：
- 不是频繁修改的字段
- 不是唯一索引的字段
- 不是varchar超长字段, 更不能是text字段
```
- 【推荐】 表的命名最好是遵循“业务名称_表的作用”
- 【推荐】 如果存储的字符串长度几乎相等, 使用char定长字符串类型

### 索引规约
- 【强制】 业务上具有唯一特性的字段, 即使是组合字段, 也必须建成唯一索引
- 【推荐】 在varchar字段上建立索引时, 必须指定索引长度, 没必要对全字段建立索引, 根据实际文本区分度决定索引长度

### SQL语句
- 【推荐】 在表查询中, 不要使用`*`作为查询的字段列表, 需要哪些字段必须明确写明
```
原因：
- 增加查询分析器解析成本
- 增减字段容易与resultMap配置不一致
- 无用字段增加网络消耗, 尤其是text类型的字段
```