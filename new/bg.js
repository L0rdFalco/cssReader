
var cssReaderLoaded = false;
var cssCiewerContextMenusParent = null;

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install" || details.reason == "update") {
        chrome.tabs.create({ url: "./web/thanks.html" });
    }

    // chrome.storage.sync.set({ mDate: Date.now });

});





chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.message === "from popup-show") {
        sendResponse({
            message: "from options activation success"
        })

    }

    else if (request.message === "notify") {
        chrome.notifications.create({ title: "Title", message: "There is an time slot available", iconUrl: "/img/24.png", type: "basic" })

    }

    else {

        try {
            sendResponse({
                message: "fail"
            })
        } catch (error) {
            console.log(error);

        }


    }


    return true


})

chrome.notifications.onClicked.addListener((info) => {
    chrome.tabs.create({ url: "https://google.com" });

})

chrome.action.onClicked.addListener(async (tab) => {
    let tabId = tab.id
    if (tab.url.indexOf("https://chrome.google.com") == 0 || tab.url.indexOf("chrome://") == 0) {
        alert("CSSReader doesn't work on Google's websites!");

        return;
    }

    if (!cssReaderLoaded) {

        cssCiewerContextMenusParent = chrome.contextMenus.create({ id: "0", "title": "CSSReader console", contexts: ["all"] });

        chrome.contextMenus.create({ id: "1", "title": "element", contexts: ["all"], "parentId": cssCiewerContextMenusParent, });
        chrome.contextMenus.create({ id: "2", "title": "element.id", contexts: ["all"], "parentId": cssCiewerContextMenusParent, });
        chrome.contextMenus.create({ id: "3", "title": "element.tagName", contexts: ["all"], "parentId": cssCiewerContextMenusParent, });
        chrome.contextMenus.create({ id: "4", "title": "element.className", contexts: ["all"], "parentId": cssCiewerContextMenusParent, });
        chrome.contextMenus.create({ id: "5", "title": "element.style", contexts: ["all"], "parentId": cssCiewerContextMenusParent, });
        chrome.contextMenus.create({ id: "6", "title": "element.cssText", contexts: ["all"], "parentId": cssCiewerContextMenusParent, });
        chrome.contextMenus.create({ id: "7", "title": "element.getComputedStyle", contexts: ["all"], "parentId": cssCiewerContextMenusParent, });
        chrome.contextMenus.create({ id: "8", "title": "element.simpleCssDefinition", contexts: ["all"], "parentId": cssCiewerContextMenusParent });

    }

    chrome.contextMenus.onClicked.addListener((info) => {
        console.log("info", info);

        switch (info.menuItemId) {
            case "1":
                cssCiewerDebugEl(tab)
                break;
            case "2":
                cssCiewerDebugElId(tab)
                break;

            case "3":
                cssCiewerDebugElTagName(tab)
                break;

            case "4":
                cssCiewerDebugElClassName(tab)
                break;

            case "5":
                cssCiewerDebugElStyle(tab)
                break;

            case "6":
                cssCiewerDebugElCssText(tab)
                break;

            case "7":
                cssCiewerDebugElGetComputedStyle(tab)
                break;

            case "8":
                cssCiewerDebugElSimpleCssDefinition()
                break;
            default:
                // Standard context menu item function
                console.log('Standard context menu item clicked.');

        }
    });

    if (!tab.url
        || tab.status !== "complete"
        || !tab.url.startsWith("http")

    ) return;


    try {

        await chrome.scripting.insertCSS({
            target: {
                tabId: tabId
            },
            files: ["./content/cssReader.css"]
        })

        await chrome.scripting.executeScript({
            target: {
                tabId: tabId
            },
            files: ["./content/cssReader.js"]
        })


    } catch (error) {
        console.log(error);
    }

    cssReaderLoaded = true;


});

function cssCiewerDebugEl() {
    msgSender("el")
}

function cssCiewerDebugElId() {
    msgSender("id")

}

function cssCiewerDebugElTagName() {
    msgSender("tagName")

}

function cssCiewerDebugElClassName() {
    msgSender("className")

}

function cssCiewerDebugElStyle() {
    msgSender("style")

}

function cssCiewerDebugElCssText() {
    msgSender("cssText")

}

function cssCiewerDebugElGetComputedStyle() {
    msgSender("getComputedStyle")

}

function cssCiewerDebugElSimpleCssDefinition() {
    msgSender("simpleCssDefinition")
}

function msgSender(arg) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { args: arg });
    });

}


