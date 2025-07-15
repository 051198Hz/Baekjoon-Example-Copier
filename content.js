// 팝업에서 메시지 오면 예제 입력/출력 추출해서 답장 보내기
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getExamples") {
        try {
            const inputSections = [...document.querySelectorAll('section[id^="sampleinput"]')];
            const outputSections = [...document.querySelectorAll('section[id^="sampleoutput"]')];

            if (inputSections.length === 0 || outputSections.length === 0) {
                sendResponse({ text: null });
                return;
            }
            if (inputSections.length !== outputSections.length) {
                sendResponse({ text: null });
                return;
            }

            let result = '';
            for (let i = 0; i < inputSections.length; i++) {
                const inputPre = inputSections[i].querySelector('pre.sampledata');
                const outputPre = outputSections[i].querySelector('pre.sampledata');
                if (!inputPre || !outputPre) {
                    sendResponse({ text: null });
                    return;
                }

                result += inputPre.textContent.trim() + '\n\n' + outputPre.textContent.trim() + '\n\n';
            }

            result = result.trim()
            result += '\n\n'

            sendResponse({ text: result });
        } catch (e) {
            sendResponse({ text: null });
        }
        // 비동기 응답이 아니면 true 안해도 됨
        return false;
    }
});