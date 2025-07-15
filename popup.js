document.getElementById('copy-btn').addEventListener('click', async () => {
    const messageEl = document.getElementById('copy-message');
    messageEl.textContent = ''; // 초기화

    // 현재 활성 탭 가져오기
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) {
        messageEl.style.color = 'red';
        messageEl.textContent = '❌ 활성 탭을 찾을 수 없습니다.';
        return;
    }

    // content.js 에게 메시지 보내서 예제 데이터 요청
    chrome.tabs.sendMessage(tab.id, { action: "getExamples" }, async (response) => {
        if (chrome.runtime.lastError) {
            messageEl.style.color = 'red';
            messageEl.textContent = '❌ 콘텐츠 스크립트와 통신할 수 없습니다.';
            return;
        }
        if (!response || !response.text) {
            messageEl.style.color = 'red';
            messageEl.textContent = '❌ 예제 입력 또는 출력을 찾을 수 없습니다.';
            return;
        }

        try {
            await navigator.clipboard.writeText(response.text);
            messageEl.style.color = 'green';
            messageEl.textContent = '✅ 예제 입력/출력 클립보드에 복사됨!';
        } catch (e) {
            messageEl.style.color = 'red';
            messageEl.textContent = '❌ 클립보드 복사 실패!';
        }
    });
});
