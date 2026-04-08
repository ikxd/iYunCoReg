# iYunCoReg

一个面向**手动输入邮箱**的 Chrome 扩展，用来小量自用全自动 Codex 的 OAuth 注册 / 登录流程。

它的定位很简单：

- 自动获取 `CPA Auth` 面板里的 OAuth 链接
- 自动完成注册、收码、登录、授权确认
- **手动输入邮箱**（已移除自动生成iCloud邮箱功能）
- 支持单步执行，也支持整套 `Auto`

## 适合谁

如果你已经有：

- Chrome 浏览器
- 一个可用的 `CPA Auth` 管理面板
- 当前浏览器里的 iCloud 登录态
- 至少一种可读验证码的邮箱页面

那这个插件就是开箱即用的。

## 功能概览

- 自动读取 `CPA Auth` 面板中的 OpenAI OAuth 链接
- 自动打开注册页并进入 `Sign up / Register`
- 自动填写邮箱、密码、姓名、生日 / 年龄
- 自动轮询验证码并回填
- 自动处理 OAuth 授权确认页
- 支持 `QQ Mail`、`163 Mail`、`Inbucket`
- 支持中英文界面切换，默认中文
- 支持失败后 `Skip`
- 支持中断后继续
- 支持 `Auto` 多轮运行
- **手动输入邮箱**，支持粘贴功能
- 支持管理 iCloud alias：
  - 查看
  - 手动删除
  - 批量删除已用 alias
  - 用完自动删除

## 使用前准备

开始之前，请确认：

- 已开启 Chrome 扩展开发者模式
- `CPA Auth` 面板可以正常打开
- 你的验证码邮箱网页可以正常访问
- 准备好要使用的邮箱地址

支持的验证码来源：

- `QQ Mail`
- `163 Mail`
- `Inbucket`

> **注意**：本扩展已移除自动生成iCloud邮箱功能，需要手动输入邮箱地址。你仍可以使用iCloud邮箱，但需要自行在iCloud网站生成别名后手动输入。

## 当前测试范围与限制

目前这套流程主要是在以下环境下测试：

- 手动输入邮箱
- 支持各类邮箱服务

本项目的定位是：

- 服务个人自用
- 提高日常操作效率

不建议也不支持：

- 大批量注册
- 滥用邮箱服务

## 安装

1. 打开 `chrome://extensions/`
2. 开启“开发者模式”
3. 点击“加载已解压的扩展程序”
4. 选择当前项目目录
5. 打开扩展侧边栏

## 快速开始

第一次使用，建议按下面顺序操作：

1. 在侧边栏填好 `CPA Auth`
2. 选择验证码来源 `Verify`
3. **手动输入或粘贴邮箱地址**
4. 留空 `Password` 让插件自动生成，或手动指定密码
5. 先试一次单步流程，确认页面都能识别
6. 没问题后再使用右上角 `Auto`

## 侧边栏说明

### `CPA Auth`

填写你的管理面板地址，例如：

```txt
http(s)://<your-host>/management.html#/oauth
```

这个地址主要用于：

- Step 1 获取 OAuth 链接
- Step 9 回填 callback 并验证

### `Language`

可切换：

- `中文`
- `English`

默认语言是中文。

### `Cleanup`

可选开启“成功使用后自动删除 iCloud alias”。

行为说明：

- 只有 Step 9 成功后才会触发
- 删除失败不会中断整轮流程
- 如果当前邮箱不是 iCloud alias，会自动跳过

### `Verify`

用于选择验证码读取来源：

- `163 Mail`
- `QQ Mail`
- `Inbucket`

### `Email`

这是注册时使用的邮箱。

**手动输入**邮箱地址，或点击 `Paste` 按钮从剪贴板粘贴。

> **重要提示**：已移除自动生成iCloud邮箱功能。如需使用iCloud邮箱，请：
> 1. 访问 iCloud 官网
> 2. 在设置中生成 Hide My Email 别名
> 3. 复制生成的邮箱地址
> 4. 在此处粘贴使用

### `Password`

- 留空：自动生成强密码
- 手动填写：使用自定义密码
- 可通过 `Show / Hide` 切换显示

## 工作流

### 单步模式

侧边栏一共 9 个步骤：

1. `Get OAuth Link`
2. `Open Signup`
3. `Fill Email / Password`
4. `Get Signup Code`
5. `Fill Name / Birthday`
6. `Login via OAuth`
7. `Get Login Code`
8. `OAuth Auto Confirm`
9. `CPA Auth Verify`

适合：

- 第一次调试
- 页面结构变了之后排查问题
- 某一步失败后手动续跑

### Auto 模式

`Auto` 会自动串行执行完整流程。

默认过程：

1. 获取 `CPA Auth` OAuth 链接
2. 打开注册页
3. **手动输入邮箱**
4. 收注册验证码
5. 完成注册信息填写
6. 登录
7. 收登录验证码
8. 自动确认 OAuth
9. 回到 `CPA Auth` 验证成功

如果自动流程中断：

- 可以修正问题后点击 `Continue`
- 也可以对失败步骤使用 `Skip`

## 常见问题

### 1. 如何使用iCloud邮箱？

虽然已移除自动生成功能，你仍可以使用iCloud邮箱：

1. 访问 [iCloud.com](https://www.icloud.com) 并登录
2. 进入设置 → Hide My Email
3. 手动生成新的邮箱别名
4. 复制生成的邮箱地址
5. 在扩展中粘贴使用

### 2. Step 8 最容易失败吗

是的。

这是最依赖页面结构的一步，也是最容易因为页面变动失效的一步。

### 3. 出现 `debugger attach failed`

通常说明目标标签页已经被 DevTools 占用。

先关闭那个页面上的 DevTools，再重试。

### 4. 为什么邮箱已经用过，但没有立刻删除

因为删除是可选行为，并且只会在 Step 9 成功后触发。

### 5. 为什么 iCloud alias 没有被自动删除

常见原因：

- 没有开启 `Cleanup`
- 当前邮箱不是 iCloud alias
- iCloud 会话失效
- 删除接口当时失败

## 致谢

感谢开源项目 [StepFlow-Duck](https://github.com/whwh1233/StepFlow-Duck) 提供的基础版本。

本项目也受 [LINUX DO](https://linux.do/) 社区启发和支持。

## License

This project is licensed under the MIT License.

It includes code derived from:
- [StepFlow-Duck](https://github.com/whwh1233/StepFlow-Duck)
