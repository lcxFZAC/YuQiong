# 作品照片图床

把作品照片直接放进这个文件夹即可，支持 `.jpg` / `.jpeg` / `.png` / `.webp` / `.gif`。

## 使用步骤

1. 将照片复制到本目录，例如 `sunset-01.jpg`
2. 打开 `yuqiong/data/gallery.json`，在 `items` 里登记：

```json
{
  "items": [
    {
      "file": "sunset-01.jpg",
      "title": "可选标题",
      "alt": "可选描述（无障碍 / SEO）"
    },
    {
      "file": "portrait-02.png"
    }
  ]
}
```

3. 刷新页面，瀑布流分区会自动展示。

`title` 与 `alt` 均可省略；省略时页面会用文件名作为后备文案。
