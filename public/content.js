const showWindow = () => {
    const container = document.createElement("div");
    container.id = "container";
    container.style.backgroundColor = "white";
    container.style.padding = "5px"
    container.style.top = "25%";
    container.style.right = "40px";
    container.style.position = "fixed";
    container.style.width = "500px";
    container.style.height = "400px";
    //container.style.height = "fit-content";
    container.style.overflowY = "scroll";

    const button = document.createElement("button");
    button.style.border = "none";
    button.style.background = "none";
    button.style.top = "0px";

    // Add image inside button
    const img = document.createElement("img");
    img.src = chrome.runtime.getURL("images/close-button.png");
    img.style.pointerEvents = "none";
    img.style.width = "20px"
    img.style.height = "20px"
    button.appendChild(img);

    // Add onclick event
    button.addEventListener("click", () => {
        deleteContainer();
    });

    container.appendChild(button);

    const footer = document.createElement("div");
    footer.innerHTML = "Made by <a href='https://twitter.com/nithurM'>Nithur</a> • <a href='https://www.buymeacoffee.com/nithur'>Buy me a coffee</a>"
    footer.style.color = "black";
    footer.style.bottom = "0px";

    container.appendChild(footer)
    
    document.body.appendChild(container);

    setLoading();
}

const insertText = (text) => {
    const container = document.getElementById("container");
    const textContainer = document.createElement("div");
    textContainer.style.color = "black";
    textContainer.style.fontSize = "18px";
    setLoaded();
    textContainer.innerText = text;

    container.appendChild(textContainer);
};

const setLoading = () => {
    const container = document.getElementById("container");
    const loadingIndicator = document.createElement("div");
    loadingIndicator.id = "loading-indicator";
    loadingIndicator.style.color = "black";
    loadingIndicator.style.fontSize = "18px";
    loadingIndicator.innerText = "Loading...";

    container.appendChild(loadingIndicator);
}

const setLoaded = () => {
    const loadingIndicator = document.getElementById("loading-indicator");
    if (loadingIndicator != null) loadingIndicator.remove();
}

const deleteContainer = () => {
    const container = document.getElementById("container");
    if (container != null) container.remove();
};

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request) => {
    if (request.generate) {
        if (request.generate.error) {

        } else if (request.generate.text) {
            insertText(request.generate.text);
        }
    } else if (request.message) {
        showWindow();
    }
});
