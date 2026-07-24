# 内容配置

## 照片瀑布流 — `gallery.json`

对应图床目录：`yuqiong/img/works/`

| 字段 | 必填 | 说明 |
|------|------|------|
| `file` | 是 | 文件名，须存在于 `img/works/` |
| `title` | 否 | 悬停 / 灯箱标题 |
| `alt` | 否 | 图片 alt 文案 |

## B 站视频 — `videos.json`

卡片点击后会在**新标签页**打开 B 站链接（不内嵌播放）。

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | 是 | 视频标题 |
| `url` | 是 | 完整 B 站链接（含 BV 号即可） |
| `desc` | 否 | 副标题 / 说明 |
| `cover` | 否 | 封面图路径，相对 `yuqiong/`，如 `img/works/cover.jpg` |

示例：

```json
{
  "videos": [
    {
      "title": "腾势门店短视频",
      "desc": "品牌宣传 · 2025",
      "url": "https://www.bilibili.com/video/BV1xxxxxx"
    }
  ]
}
```
