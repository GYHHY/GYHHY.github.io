/**
 * 
 * @param {(system:{close:()=>void, root: HTMLDivElement, shader: HTMLDivElement, panel: HTMLDivElement}) => void} initialize 
 * @param {(system:{close:()=>void, root: HTMLDivElement, shader: HTMLDivElement, panel: HTMLDivElement}) => void} onclose
 * @returns {{close:()=>void, root: HTMLDivElement, shader: HTMLDivElement, panel: HTMLDivElement}}
 */
var Panel = function (initialize, onclose) {
    var root = document.createElement("div");
    var dark = document.createElement("div");
    var system = {
        close: function () {
            if (onclose != null)
                onclose(system);
            root.remove();
        }
    };
    root.appendChild(dark);
    root.style.position = "fixed";
    root.style.zIndex = "2333";
    root.style.top = "0";
    root.style.width = "100vw";
    root.style.height = "100vh";
    dark.style.backgroundColor = "#000000AA";
    dark.style.width = "100vw";
    dark.style.height = "100vh";
    dark.style.zIndex = "4433";
    dark.style.position = "absolute";
    dark.style.top = "0";
    var panel = document.createElement("div");
    panel.style.margin = "auto";
    panel.style.marginTop = "50px";
    panel.style.zIndex = "4444";
    panel.style.position = "relative";
    root.appendChild(panel);
    system.root = root;
    system.shader = dark;
    system.panel = panel;
    initialize(system);
    dark.addEventListener("click", system.close);
    document.body.appendChild(root);
    return system;
};