document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.nav-btn');
    const iframe = document.getElementById('service-frame');
    const loader = document.getElementById('loader');
    const explanationArea = document.getElementById('function-explanation');
    const notesArea = document.getElementById('notesArea');
    const btnExportNotes = document.getElementById('btn-export-notes');

    // --- 步驟說明內容 ---
    const explanations = {
        '1': '<h3>🎵 智能語音MP3播放</h3><p>播放 MP3 檔案，並支援語音智能控制（播放、暫停、快轉等）。</p>',
        '2': '<h3>📚 Cbeta名詞查詢</h3><p>專業佛學名詞的查詢，提供多大腦檢索與總結。請在右側圈選重點文字加入筆記。</p>',
        '3': '<h3>⚙️ 文字轉檔語音</h3><p>將感興趣的文章或是佛典，透過高品質語音引擎轉成語音檔。</p>',
        '4': '<h3>📖 發音校正字典</h3><p>針對專業術語與特殊讀音，提供自訂發音規則與校正功能。</p>',
        '5': '<h3>🎧 逐行朗讀文字</h3><p>利用產生的 MP3 與 LRC 檔案，進行專業的沉浸式逐字朗讀與檢視。</p>'
    };

    function updateExplanation(id) {
        explanationArea.innerHTML = explanations[id] || '';
    }

    // 初始化預設說明
    updateExplanation('1');

    // 處理 iframe 載入完成事件，隱藏 loader
    iframe.addEventListener('load', () => {
        loader.classList.remove('active');
        iframe.style.opacity = '1';
    });

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const targetUrl = button.getAttribute('data-target');
            const btnId = button.getAttribute('data-id');
            updateExplanation(btnId);

            if (iframe.src !== targetUrl) {
                loader.classList.add('active');
                iframe.style.opacity = '0.5';
                setTimeout(() => {
                    iframe.src = targetUrl;
                }, 300);
            }
        });
    });

    // --- 全域筆記功能 (Global Notes) ---
    let savedNotes = [];
    
    function loadNotes() {
        const localData = localStorage.getItem('cbeta_agent_notes');
        if (localData) {
            savedNotes = JSON.parse(localData);
            renderNotes();
        }
    }

    function renderNotes() {
        if (savedNotes.length === 0) {
            notesArea.innerHTML = '（目前尚未圈選任何重點，請在右側文字區圈選文字後，系統會自動摘錄至此）';
            return;
        }
        let html = "";
        savedNotes.forEach((note, index) => {
            html += '<div class="note-item">' +
                    '<button class="delete-btn" data-index="' + index + '">❌</button>' +
                    '<div>[重點 ' + (index + 1) + '] ' + note + '</div>' +
                    '</div>';
        });
        notesArea.innerHTML = html;

        // 綁定刪除按鈕事件
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'));
                deleteNote(idx);
            });
        });
    }

    function deleteNote(index) {
        savedNotes.splice(index, 1);
        localStorage.setItem('cbeta_agent_notes', JSON.stringify(savedNotes));
        renderNotes();
    }

    // 接收來自 iframe 的 postMessage
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'add_note') {
            const text = event.data.text;
            if (text && !savedNotes.includes(text)) {
                savedNotes.push(text);
                localStorage.setItem('cbeta_agent_notes', JSON.stringify(savedNotes));
                renderNotes();
            }
        }
    });

    btnExportNotes.addEventListener('click', function() {
        if (savedNotes.length === 0) {
            alert("目前欄位內沒有任何筆記重點，無法儲存！");
            return;
        }
        let fileContent = "=== 禪音智友 · 研讀摘錄筆記 ===\n\n";
        savedNotes.forEach((note, index) => {
            fileContent += "【重點摘要 " + (index + 1) + "】\n" + note + "\n\n";
        });
        
        const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "ZenVoiceAI_佛學筆記.txt";
        link.click();
        URL.revokeObjectURL(link.href);
    });

    loadNotes(); // 初始化載入筆記

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

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
