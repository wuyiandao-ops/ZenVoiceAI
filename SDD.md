# ZenVoiceAI 總控制台 - 軟體設計文件 (SDD)

## 1. 系統架構概述
ZenVoiceAI 主控台採用 **純前端架構 (Vanilla HTML/JS/CSS)** 實作，作為多個微服務的整合入口 (Microservices Dashboard)。
系統不具備複雜的後端邏輯，而是利用 `<iframe>` 容器將運行於不同本地埠的獨立 Web 應用程式嵌入，形成單一的聚合使用者介面 (Aggregated UI)。

## 2. 核心技術選型
- **結構**：HTML5 語意化標籤。
- **樣式**：純 CSS3 (Vanilla CSS)，大量使用 CSS Variables 進行主題化與深色模式管理，並利用 Flexbox 進行彈性佈局。
- **邏輯控制**：Vanilla JavaScript (ES6+)，無需前端框架，以達最輕量級的效能開銷。

## 3. 關鍵元件設計

### 3.1 佈局結構 (`index.html`)
- **`.main-container`**: 左右分欄的容器。
  - **`.left-section`**: 包含工具操作說明 (`#function-explanation`) 與筆記展示區 (`#notesArea`)。
  - **`.right-section`**: 動態內容區，負責渲染各子系統的畫面。此區塊設定為 `position: relative` 作為 iframe 容器的定位基準。
  - **`#iframe-container`**: 多重視窗存放區，所有被動態生成的 `<iframe>` 都掛載於此。

### 3.2 樣式管理 (`style.css`)
- **Theme Variables**: 
  - `--bg-color`: 深綠灰背景
  - `--text-color`: 柔和亮色字體
  - `--border-color`: 分隔線顏色
- **`.service-frame`**:
  ```css
  .service-frame {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      opacity: 0; pointer-events: none;
      transition: opacity 0.4s ease;
  }
  .service-frame.active {
      opacity: 1; pointer-events: auto;
  }
  ```
  設計原理：利用 `opacity` 與 `pointer-events` 進行切換，確保過場動畫平滑且隱藏的 iframe 不會攔截使用者的點擊事件。

### 3.3 狀態駐留邏輯 (`script.js`)
- **Iframe 快取池 (`iframes` Object)**:
  - 鍵值對結構：`{ "按鈕ID": HTMLIFrameElement }`
  - 設計模式：Lazy Initialization (延遲初始化)。只有當使用者首次點擊該工具時，才動態執行 `document.createElement('iframe')`。
- **Loader 控制**:
  - 在 iframe 建立時綁定 `load` 事件。當資源載入完畢，寫入自訂屬性 `dataset.loaded = 'true'`。
  - 二次切換時，檢查該 iframe 的 `dataset.loaded`，若已為 true 則繞過 Loader，實現 0 秒瞬間切換。
