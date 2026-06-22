document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.nav-btn');
    const iframe = document.getElementById('service-frame');
    const loader = document.getElementById('loader');

    // 處理 iframe 載入完成事件，隱藏 loader
    iframe.addEventListener('load', () => {
        loader.classList.remove('active');
        iframe.style.opacity = '1';
    });

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按鈕的 active 狀態
            buttons.forEach(btn => btn.classList.remove('active'));
            
            // 為點擊的按鈕加入 active 狀態
            button.classList.add('active');

            // 取得目標 URL
            const targetUrl = button.getAttribute('data-target');

            // 只有當目標 URL 與當前 iframe 的 src 不同時才進行切換
            if (iframe.src !== targetUrl) {
                // 顯示 loader 並淡出 iframe
                loader.classList.add('active');
                iframe.style.opacity = '0.5';

                // 稍微延遲以確保動畫過渡平滑，然後更改 src
                setTimeout(() => {
                    iframe.src = targetUrl;
                }, 300);
            }
        });
    });

    // --- 操作教學視窗邏輯 ---
    const btnTutorial = document.getElementById('btn-tutorial');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const modal = document.getElementById('tutorial-modal');

    const openModal = () => {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        btnTutorial.classList.add('active-tool');
    };

    const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        btnTutorial.classList.remove('active-tool');
    };

    btnTutorial.addEventListener('click', openModal);
    btnCloseModal.addEventListener('click', closeModal);

    // 點擊視窗外部區域也可關閉
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // 支援 ESC 鍵關閉視窗
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
