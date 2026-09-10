# EazySales

EazySales 是面向 Windows 11 的本地销售统筹工作台，用于由管理者统一维护销售、客户、商机与后续行动。它以人员和商机阶段组成销售沙盘，帮助识别停滞事项、近期节点及需要协调的工作。

## 当前功能

- 销售人员档案与客户归属
- 独立客户档案及联系人信息
- 商机阶段看板，拖动卡片调整阶段
- 商机金额、优先级、阻碍、下一步动作及协调标记
- 周会模式，按销售依次检查在跟商机
- 计划日程及逾期标识
- 本地自动保存、数据导入与备份导出
- GitHub Release 在线检查、下载和重启安装

## 数据与后续协作

当前数据保存在 Windows 用户数据目录。界面通过独立数据服务读写，后续可将本地存储替换为在线 API，并为销售提供网页填报入口。

## 开发

```bash
npm install
npm run dev
```

构建 Windows 安装包：

```bash
npm run dist:win
```

## 发布

在 GitHub Actions 中手动运行 **Build and publish Windows release**。工作流会读取 `package.json` 的版本号、创建对应标签并发布 Windows 安装包。新版本发布后，已安装的 EazySales 可在应用内检查并安装更新。

## License

MIT
