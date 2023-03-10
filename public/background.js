chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'explanation-generator',
        title: 'Generate explanation',
        contexts: ['selection']
    });
});
  
  chrome.contextMenus.onClicked.addListener(async (clickData) => {
    if (clickData.menuItemId === 'explanation-generator' && clickData.selectionText) {
        console.log("clciked")
        // Communicate with content script to show loading
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { message: "show loading" });
        });
        const selectedText = clickData.selectionText;
        const prompt = "explain this code in bullet points: " + selectedText
        const nextTokens = await getNextTokens(prompt);

        // Communicate with content script to update the text
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { generate: nextTokens });
        });
    }
  });
  
const getConfig = async () => {
    const {
        apiKey,
        model,
        maxTokens,
    } = await chrome.storage.sync.get([
        "apiKey",
        "model",
        "maxTokens",
    ]);

    return {
        apiKey: apiKey || "",
        model: model || "text-davinci-002",
        temperature: 0.7,
        maxTokens: maxTokens || 256,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
    };
};

const getNextTokens = async (prompt) => {
    const url = "https://api.openai.com/v1/completions";

    // Get config from storage
    const {
        apiKey,
        model,
        temperature,
        maxTokens,
        topP,
        frequencyPenalty,
        presencePenalty,
    } = await getConfig();

    // Create request body
    const data = {
        prompt: prompt,
        suffix: null,
        model: model,
        max_tokens: maxTokens,
        temperature: temperature,
        top_p: topP,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty,
    };

    // Create headers
    const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
    };

    // Make request
    const res = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
    });

    const json = await res.json();

    if (json.error) {
        return { error: json.error };
    }

    return { text: json.choices[0].text };
};

// chrome.commands.onCommand.addListener(()=> {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.tabs.sendMessage(tabs[0].id, { action: "generate explanation" });
//     });
// });