/**
 * Minified by jsDelivr using Terser v5.39.0.
 * Original file: /gh/deafnv/bokitube-server@master/channel/script.js
 * 
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */

// =============================================
// INICIALIZAÇÃO E CONFIGURAÇÃO DA INTERFACE
// =============================================

// Remove botões de redimensionamento de vídeo
const resizes = document.getElementById("resize-video-smaller"),
      resizel = document.getElementById("resize-video-larger");
resizes.remove(), resizel.remove();

// Esconde container principal temporariamente
document.querySelector(".container-fluid").style.display = "none";

// Adiciona banner de slideshow se habilitado
"undefined" != typeof scrollingBannerEnabled && scrollingBannerEnabled && 
$("#motdwrap").prepend($('<div class="banner-slideshow"><div class="mover-1"></div></div>'));

// Adiciona créditos do tema
$(".credit").append($('<p class="text-muted credit">Theme by deafnv, available on <a href="https://github.com/deafnv/bokitube-server" target="_blank" rel="noreferrer noopener">Github</a></p>'));

// =============================================
// REORGANIZAÇÃO DO LAYOUT DA PÁGINA
// =============================================

// Cria estrutura principal do layout
$("#mainpage").prepend($('<div id="content-wrap">'));
$("#content-wrap").prepend($('<div id="rightcontent">'));
$("#content-wrap").prepend($('<div id="leftcontent">'));

// Organiza conteúdo do lado esquerdo (vídeo e informações do canal)
$("<div id='video-container'>").prependTo($("#leftcontent"));
$("#videowrap").prependTo($("#video-container"));
$('<div id="channel-content">').appendTo($("#leftcontent"));

// Move elementos para a área de conteúdo do canal
$("#announcements").appendTo($("#channel-content"));
$("#drinkbar").appendTo($("#channel-content"));
$("#motdrow").appendTo($("#channel-content"));
$("#controlsrow").appendTo($("#channel-content"));
$("#playlistrow").appendTo($("#channel-content"));
$("#sitefooter").appendTo($("#channel-content"));
$("#footer").appendTo($("#channel-content"));
$("#leftcontent").prepend($("#pollwrap"));

// Organiza conteúdo do lado direito (chat e usuários)
$("#chatheader").appendTo($("#rightcontent"));
$("#userlist").appendTo($("#rightcontent"));
$("#messagebuffer").appendTo($("#rightcontent"));

// Configura linha de formulário do chat
const formLine = document.querySelector("div#chatwrap > form");
formLine.setAttribute("id", "formline");
$("#formline").appendTo($("#rightcontent"));
$("#leftcontrols").appendTo($("#rightcontent"));

// Configura título atual do vídeo
$("#rightcontent").prepend($("<div id='currenttitlewrap'>"));
$("#videowrap-header").prependTo($("#currenttitlewrap"));

// Clona e ajusta título atual
const nodecurrenttitle = document.getElementById("currenttitle"),
      clonecurrenttitle = nodecurrenttitle.cloneNode(!0),
      pagewrap = document.getElementById("wrap");
pagewrap.setAttribute("style", "padding-bottom: 0px;");

// =============================================
// CONFIGURAÇÃO DO CHAT E RESPONSIVIDADE
// =============================================

const chatline = document.getElementById("chatline");

// Função para ajustar posição do chat em dispositivos móveis
function chatPosition(e) {
    e.matches ? (
        $("#rightcontent").appendTo($("#leftcontent")),
        $("#channel-content").appendTo($("#leftcontent")),
        $("#footer").appendTo($("#leftcontent")),
        document.getElementById("chatline").onclick = function() {
            var e = 0, t = setInterval((() => {
                document.documentElement.scrollTop = 0, 10 == ++e && window.clearInterval(t)
            }), 50)
        },
        setInterval((function() {
            document.documentElement.style.setProperty("--vh", window.innerHeight / 100 + "px")
        }), 20)
    ) : (
        $("#rightcontent").appendTo($("#content-wrap")),
        document.documentElement.style.setProperty("--vh", window.innerHeight / 100 + "px")
    )
}

// Configura placeholder e spellcheck do chat
chatline.removeAttribute("placeholder");
chatline.setAttribute("placeholder", "Send a message");
chatline.setAttribute("spellcheck", "false");

// Atualiza variável CSS de altura da viewport
setInterval((function() {
    document.documentElement.style.setProperty("--vh", window.innerHeight / 100 + "px")
}), 20);

// Aplica responsividade para mobile
var mediaQuery = window.matchMedia("(max-width: 768px)");
chatPosition(mediaQuery);
mediaQuery.addEventListener("change", chatPosition);

// =============================================
// BOTÕES E CONTROLES ADICIONAIS
// =============================================

// Botão para pular para o item atual
const jumpBtn = document.createElement("button");
jumpBtn.innerHTML = "Scroll to current item";
jumpBtn.setAttribute("id", "jump-btn");
jumpBtn.setAttribute("class", "btn");
jumpBtn.onclick = function() {
    window.scrollQueue()
};

const rightControls = document.getElementById("rightcontrols");
rightControls.insertBefore(jumpBtn, rightControls.children[1]);

// =============================================
// SISTEMA AFK (AUSÊNCIA)
// =============================================

var VOL_AFK = !1, FOCUS_AFK = !1;

// Verifica periodicamente se usuário está AFK
setInterval((function() {
    !1 === VOL_AFK && !1 === FOCUS_AFK && $("#userlist").find("span[class^=userlist]").each((function() {
        $(this).html() != CLIENT.name || "italic" != $(this).css("font-style") || socket.emit("chatMsg", { msg: "/afk" })
    }))
}), 500);

// Detecta foco e perda de foco da janela para AFK automático
window.addEventListener("focus", (() => {
    FOCUS_AFK && VOL_AFK && (socket.emit("chatMsg", { msg: "/afk" }), FOCUS_AFK = !FOCUS_AFK, VOL_AFK = !VOL_AFK)
}));

window.addEventListener("blur", (() => {
    FOCUS_AFK || VOL_AFK || (socket.emit("chatMsg", { msg: "/afk" }), FOCUS_AFK = !FOCUS_AFK, VOL_AFK = !VOL_AFK)
}));

// =============================================
// INICIALIZAÇÃO DA PÁGINA
// =============================================

$(document).ready((function() {
    // Configurações específicas para cytu.be
    "cytu.be" == window.location.host && (
        "undefined" != typeof channelName && $(".navbar-brand").html(channelName),
        "undefined" != typeof faviconUrl && $('<link id="chanfavicon" href="' + faviconUrl + '" type="image/x-icon" rel="shortcut icon" />').appendTo("head")
    );
    
    // Adiciona fontes do Google
    $('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Ubuntu">').appendTo("head");
    $('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Quicksand">').appendTo("head");
}));

// =============================================
// CONTROLES DE CSS E BOTÕES PERSONALIZADOS
// =============================================

// Botão de preview de CSS
$('<button class="btn btn-primary" id="cs-csspreview">Preview CSS</button>')
    .appendTo("#cs-csseditor")
    .on("mousedown", (function() {
        document.getElementById("channeloptions").style.visibility = "hidden";
        document.getElementById("cs-csseditor").style.visibility = "hidden";
        document.getElementById("cs-csspreview").style.visibility = "visible";
    }))
    .on("mouseout", (function() {
        document.getElementById("channeloptions").style.visibility = "visible";
        document.getElementById("cs-csseditor").style.visibility = "visible";
    }))
    .on("mouseup", (function() {
        document.getElementById("channeloptions").style.visibility = "visible";
        document.getElementById("cs-csseditor").style.visibility = "visible";
    }));

// Botão AFK personalizado
$('<button id="afk-btn" class="btn btn-default btn-sm">AFK</button>')
    .appendTo("#leftcontrols")
    .on("click", (function() {
        socket.emit("chatMsg", { msg: "/afk" });
        VOL_AFK = !VOL_AFK;
    }));

// Botão Clear personalizado
$('<button id="clear-btn" class="btn btn-default btn-sm">Clear</button>')
    .appendTo("#leftcontrols")
    .on("click", (function() {
        socket.emit("chatMsg", { msg: "/clear" });
    }));

// =============================================
// SISTEMA DE EMOTES
// =============================================

// Configura posição inicial do painel de emotes
localStorage.epFlTop && localStorage.epFlLeft || (localStorage.epFlTop = 100, localStorage.epFlLeft = -15);

$('<div class="emotewrap" id="emotewrap" style="top: ' + localStorage.epFlTop + "px; left: " + localStorage.epFlLeft + 'px;">').appendTo($("#rightcontent"));

// Inicializa painel de emotes
localStorage.epposition || (localStorage.epposition = 1, emotespanel = $('<div id="emotespanel" class="ep__fixed" style="display:none" />').insertAfter("#userlist"));

// Posiciona painel de emotes conforme configuração
0 == localStorage.epposition ? 
    emotespanel = $('<div id="emotespanel" class="ep__floating" style="display:none" />').appendTo($("#emotewrap")) : 
    emotespanel = $('<div id="emotespanel" class="ep__fixed" style="display:none" />').insertAfter("#userlist");

// Verifica se painel deve estar aberto
localStorage.epIsOpen || (localStorage.epIsOpen = 0);
1 == localStorage.epIsOpen && toggleDiv(emotespanel);

// Observer para controle de visibilidade da fila
let observer = new IntersectionObserver(observerCallback);

function observerCallback() {
    toggleDiv("#queue");
}

// =============================================
// FUNÇÕES GLOBAIS UTILITÁRIAS
// =============================================

function toggleDiv(e) {
    "none" == $(e).css("display") ? $(e).show() : $(e).hide();
}

function insertText(e) {
    $("#chatline").val($("#chatline").val() + e).focus();
}

// =============================================
// SISTEMA DE AUTOMCOMPLETE E PAINEL DE EMOTES
// =============================================

var autocompleteArr = [];

// Função principal do painel de emotes
function emotesPanel() {
    if (emotespanel.removeClass("row"), document.querySelector("#emotespanel").replaceChildren(), len = CHANNEL.emotes.length, len < 1) {
        // Sem emotes disponíveis
        emotespanel.addClass("row");
        makeAlert("No emotes available", "Ask channel administrator. This panel will update every second until an emote is found.").appendTo(emotespanel);
        document.querySelector("#content-wrap").contains(document.querySelector("#needpw")) || $("#needpw").appendTo($("#content-wrap"));
        console.log("No emotes found, reloading in 1 second");
        setTimeout((function() {
            emotesPanel()
        }), 1e3);
    } else {
        // Carrega emotes disponíveis
        for (i in CHANNEL.emotes) {
            $("<img onclick=\"insertText('" + CHANNEL.emotes[i].name + " ')\" />")
                .attr({ src: CHANNEL.emotes[i].image, title: CHANNEL.emotes[i].name })
                .appendTo(emotespanel);
            autocompleteArr.push({ name: CHANNEL.emotes[i].name, image: CHANNEL.emotes[i].image });
        }
        
        // Ordena emotes e configura autocomplete
        autocompleteArr.sort(((e, t) => e.name.localeCompare(t.name)));
        window.matchMedia("(max-width: 768px)").matches ? 
            observer.observe(document.querySelector("#rightpane-inner").children[5]) : 
            autocomplete(document.getElementById("chatline"), autocompleteArr);
    }
}

// Alterna entre painel fixo e flutuante
function switchEp() {
    const e = document.querySelector("#emotespanel");
    1 == localStorage.epposition ? (
        e.setAttribute("class", "ep__floating"),
        $("#emotespanel").appendTo($("#emotewrap")),
        localStorage.epposition = 0,
        document.querySelector("#emotewrap").style.top = "100px",
        document.querySelector("#emotewrap").style.left = "-15px",
        localStorage.epFlTop = 100,
        localStorage.epFlLeft = -15
    ) : (
        e.setAttribute("class", "ep__fixed"),
        $("#emotespanel").insertAfter("#userlist"),
        localStorage.epposition = 1
    );
}

// Sistema de arrastar para painel flutuante
function dragElement(e) {
    var t = 0, n = 0, o = 0, l = 0;

    function s(e) {
        (e = e || window.event).preventDefault();
        o = e.clientX, l = e.clientY;
        document.onmouseup = r;
        document.onmousemove = a;
    }

    function a(s) {
        (s = s || window.event).preventDefault();
        t = o - s.clientX, n = l - s.clientY;
        o = s.clientX, l = s.clientY;
        e.style.top = e.offsetTop - n + "px";
        e.style.left = e.offsetLeft - t + "px";
    }

    function r() {
        document.onmouseup = null;
        document.onmousemove = null;
        localStorage.epFlTop = document.querySelector("#emotewrap").style.top.substring(0, document.querySelector("#emotewrap").style.top.length - 2);
        localStorage.epFlLeft = document.querySelector("#emotewrap").style.left.substring(0, document.querySelector("#emotewrap").style.left.length - 2);
    }

    document.getElementById(e.id + "header") ? 
        document.getElementById(e.id + "header").onmousedown = s : 
        e.onmousedown = s;
}

// Sistema de autocomplete para emotes no chat
function autocomplete(e, t) {
    var n, o = "";

    function l(e) {
        if (!e) return !1;
        !function(e) {
            for (var t = 0; t < e.length; t++) e[t].classList.remove("autocomplete-active");
        }(e);
        n >= e.length && (n = 0);
        n < 0 && (n = e.length - 1);
        e[n]?.classList.add("autocomplete-active");
    }

    function s(t) {
        for (var n = document.getElementsByClassName("autocomplete-items"), o = 0; o < n.length; o++) 
            t != n[o] && t != e && n[o].parentNode.removeChild(n[o]);
    }

    e.addEventListener("input", (function(e) {
        var l, a, r, i = this.value;
        if (s(), !i) return !1;
        n = -1;
        (l = document.createElement("DIV")).setAttribute("id", "autocomplete-list");
        l.setAttribute("class", "autocomplete-items");
        l.style.bottom = `${$("#rightcontent > form").outerHeight() + $("#leftcontrols").outerHeight()}px`;
        this.parentNode.appendChild(l);
        $("#autocomplete-list").insertBefore(document.querySelectorAll("form")[1]);

        var c = document.getElementById("chatline").value.match(/(?<!\S)\/\S*$/gim)?.toString(),
            p = c?.substring(1, c.length);

        for (o = document.getElementById("chatline").value, r = 0; r < t.length; r++) {
            if (t[r].name.substr(0, c?.length)?.toUpperCase() == c?.toUpperCase()) {
                c.length;
                (a = document.createElement("DIV")).innerHTML = "<strong>" + t[r].name.substr(0, c?.length) + "</strong>";
                a.innerHTML += t[r].name.substr(c?.length);
                a.innerHTML += "<input type='hidden' value='" + t[r].name + "'>";
                a.innerHTML += "<img id='autocomplete-image' src='" + t[r].image + "'>";
                a.addEventListener("click", (function(e) {
                    $("#chatline").val($("#chatline").val().substring(0, $("#chatline").val().length - $("#chatline").val().match(/(?<!\S)\/\S*$/gim).toString().length) + this.getElementsByTagName("input")[0].value);
                    s();
                }));
                l.appendChild(a);
            } else if (t[r].name.substring(1, t[r].name.length).indexOf(p) > -1) {
                var m = t[r].name.indexOf(p);
                (a = document.createElement("DIV")).innerHTML = "<strong>/</strong>";
                a.innerHTML += t[r].name.substring(1, m);
                a.innerHTML += "<strong>" + p + "</strong>";
                a.innerHTML += t[r].name.substring(m + p?.length, t[r].name.length);
                a.innerHTML += "<input type='hidden' value='" + t[r].name + "'>";
                a.innerHTML += "<img id='autocomplete-image' src='" + t[r].image + "'>";
                a.addEventListener("click", (function(e) {
                    $("#chatline").val($("#chatline").val().substring(0, $("#chatline").val().length - $("#chatline").val().match(/(?<!\S)\/\S*$/gim).toString().length) + this.getElementsByTagName("input")[0].value);
                    s();
                }));
                l.appendChild(a);
            }
        }
    }));

    e.addEventListener("keydown", (function(e) {
        var t = document.getElementById("autocomplete-list");
        t && (t = t.getElementsByTagName("div"));
        40 == e.keyCode ? (
            e.preventDefault(),
            n++,
            l(t),
            document.querySelector(".autocomplete-active").scrollIntoViewIfNeeded(!1),
            $("#chatline").val(o.substring(0, o.length - o.match(/(?<!\S)\/\S*$/gim).toString().length) + document.getElementsByClassName("autocomplete-active")[0].querySelector("input").getAttribute("value"))
        ) : 38 == e.keyCode ? (
            e.preventDefault(),
            n--,
            l(t),
            document.querySelector(".autocomplete-active").scrollIntoViewIfNeeded(!1),
            $("#chatline").val(o.substring(0, o.length - o.match(/(?<!\S)\/\S*$/gim).toString().length) + document.getElementsByClassName("autocomplete-active")[0].querySelector("input").getAttribute("value"))
        ) : 13 != e.keyCode && 9 != e.keyCode || s();
    }));

    document.addEventListener("click", (function(e) {
        s(e.target);
    }));
}

// =============================================
// CONFIGURAÇÃO FINAL DOS CONTROLES
// =============================================

// Inicializa painel de emotes
emotesPanel();

// Remove botão original de emotes e configura novos botões
$("#emotelistbtn").remove();

// Configura botão de nova enquete com SVG
$("#newpollbtn").html('<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#FFFFFF" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 490.4 490.4" xml:space="preserve"><path d="M17.2,251.55c-9.5,0-17.2,7.7-17.2,17.1v179.7c0,9.5,7.7,17.2,17.2,17.2h113c9.5,0,17.1-7.7,17.1-17.2v-179.7 c0-9.5-7.7-17.1-17.1-17.1L17.2,251.55L17.2,251.55z M113,431.25H34.3v-145.4H113V431.25z"/><path d="M490.4,448.45v-283.7c0-9.5-7.7-17.2-17.2-17.2h-113c-9.5,0-17.2,7.7-17.2,17.2v283.6c0,9.5,7.7,17.2,17.2,17.2h113 C482.7,465.55,490.4,457.85,490.4,448.45z M456.1,431.25h-78.7v-249.3h78.7L456.1,431.25L456.1,431.25z"/> <path d="M301.7,465.55c9.5,0,17.1-7.7,17.1-17.2V42.05c0-9.5-7.7-17.2-17.1-17.2h-113c-9.5,0-17.2,7.7-17.2,17.2v406.3 c0,9.5,7.7,17.2,17.2,17.2H301.7z M205.9,59.25h78.7v372h-78.7L205.9,59.25L205.9,59.25z"/></svg>');
$("#newpollbtn").attr("title", "Create new poll");

// Botão de emotes personalizado
emotesbtn = $('<button id="emotes-btn" class="btn btn-sm btn-default" title="Display emotes panel"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#FFFFFF" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.507 13.941c-1.512 1.195-3.174 1.931-5.506 1.931-2.334 0-3.996-.736-5.508-1.931l-.493.493c1.127 1.72 3.2 3.566 6.001 3.566 2.8 0 4.872-1.846 5.999-3.566l-.493-.493zm-9.007-5.941c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"/></svg></button>')
    .prependTo("#leftcontrols")
    .on("click", (function() {
        toggleDiv(emotespanel);
        0 == localStorage.epIsOpen ? localStorage.epIsOpen = 1 : localStorage.epIsOpen = 0;
    }));

// Reorganiza botões na interface
$("#emotes-btn").after($("#voteskip"));
$('<li><a onclick="switchEp()" style="cursor: pointer;">Switch EP</a></li>').appendTo(".navbar-nav");
$("#newpollbtn").prependTo($("#leftcontrols"));

// Habilita arrastar para painel de emotes
dragElement(document.getElementById("emotewrap"));

// =============================================
// SISTEMA DE REPLY (RESPOSTAS) NO CHAT
// =============================================

const LOAD_IN_DELAY = 10;

// Processa mensagens de reply substituindo emotes
function processReplyMessage(e) {
    let t = e;
    return /(?<!\S)\/\S*/gim.exec(e) && (t = e.replace(/(?<!\b)\/(\w+)/g, ((e, t) => `<img class="channel-emote" src="${autocompleteArr.filter((e => e.name == `/${t}`))[0] || ""}" title="/${t}">`))), 
    t.replace(/\[r\](.+?)\[\/r\]/, "").trim();
}

// Rola para a mensagem respondida
function scrollToReply(e) {
    const t = getAllMessages().filter((t => t.pseudoId == e));
    $(t[0].element)[0].scrollIntoView({ behavior: "smooth" });
    $(t[0].element).delay(200).animate({ backgroundColor: "#696969" }, 300).animate({ backgroundColor: "transparent" }, 300);
}

// Formata timestamp
function getTimeString(e) {
    const t = new Date(e),
          n = t.getHours(),
          o = t.getMinutes(),
          l = t.getSeconds();
    return "[" + ("0" + n).slice(-2) + ":" + ("0" + o).slice(-2) + ":" + ("0" + l).slice(-2) + "]";
}

// Sanitiza mensagem para criar pseudo ID
function sanitizeMessageForPseudoID(e) {
    return e.match(/(?:.*?\[\/r\]\s+)(.+)/) ? 
        e.match(/(?:.*?\[\/r\]\s+)(.+)/)[1].split(" ")[0].substring(0, 12) : 
        e.split(" ")[0].substring(0, 12);
}

// Gera hash único para mensagens
function generateHash(e, t, n) {
    return md5(`${e.trim()}${t.replace(/\[r\](.+?)\[\/r\]/, "").trim()}${n.trim()}`).substring(0, 8);
}

// Obtém todas as mensagens do chat
function getAllMessages() {
    let e = [];
    return $("div#messagebuffer").children().each(((t, n) => {
        if (!$(n).attr("class")?.includes("chat-msg-") || $(n).attr("class")?.includes("server")) return;
        const o = $(n).find("span:not(.timestamp)").length > 1 ? 
                  $(n).find("span:not(.timestamp)").last().html() : 
                  $(n).find("span:not(.timestamp)").html(),
              l = $(n).attr("class").split("-")[2].split(" ")[0];
        e.push({ pseudoId: generateHash(l, o, $(n).find("span.timestamp").text()), message: o, username: l, element: n });
    })), e;
}

// Obtém texto selecionado
function getSelectionText() {
    var e = "";
    return window.getSelection ? e = window.getSelection().toString() : document.selection && "Control" != document.selection.type && (e = document.selection.createRange().text), e;
}

// Botão de reply para mensagens
function replyToButton(e) {
    const t = e.target;
    let n = $(t).siblings().length > 1 ? $(t).siblings().last().html() : $(t).siblings().html(),
        o = t.parentNode.className?.split("-")[2]?.split(" ")[0],
        l = generateHash(o, n, $(t).siblings(".timestamp").html());
    const s = $("#chatline").val().replace(/(?:.*?\[\/r\]\s+)/, "");
    "" != sanitizeMessageForPseudoID(n) && $("#chatline").val(`[r]${l.trim()}[/r] ${s}`).focus();
}

// Implementação MD5 para hashing
function md5(e) {
    var t = "0123456789abcdef";
    function n(e) {
        var n, o = "";
        for (n = 0; n <= 3; n++) o += t.charAt(e >> 8 * n + 4 & 15) + t.charAt(e >> 8 * n & 15);
        return o;
    }
    function o(e, t) {
        var n = (65535 & e) + (65535 & t);
        return (e >> 16) + (t >> 16) + (n >> 16) << 16 | 65535 & n;
    }
    function l(e, t, n, l, s, a) {
        return o(function(e, t) {
            return e << t | e >>> 32 - t;
        }(o(o(t, e), o(l, a)), s), n);
    }
    function s(e, t, n, o, s, a, r) {
        return l(t & n | ~t & o, e, t, s, a, r);
    }
    function a(e, t, n, o, s, a, r) {
        return l(t & o | n & ~o, e, t, s, a, r);
    }
    function r(e, t, n, o, s, a, r) {
        return l(t ^ n ^ o, e, t, s, a, r);
    }
    function i(e, t, n, o, s, a, r) {
        return l(n ^ (t | ~o), e, t, s, a, r);
    }
    var c, p, m, d, u, g = function(e) {
        var t, n = 1 + (e.length + 8 >> 6), o = new Array(16 * n);
        for (t = 0; t < 16 * n; t++) o[t] = 0;
        for (t = 0; t < e.length; t++) o[t >> 2] |= e.charCodeAt(t) << t % 4 * 8;
        return o[t >> 2] |= 128 << t % 4 * 8, o[16 * n - 2] = 8 * e.length, o;
    }("" + e), h = 1732584193, f = -271733879, v = -1732584194, $ = 271733878;
    for (c = 0; c < g.length; c += 16) p = h, m = f, d = v, u = $, h = s(h, f, v, $, g[c + 0], 7, -680876936), $ = s($, h, f, v, g[c + 1], 12, -389564586), v = s(v, $, h, f, g[c + 2], 17, 606105819), f = s(f, v, $, h, g[c + 3], 22, -1044525330), h = s(h, f, v, $, g[c + 4], 7, -176418897), $ = s($, h, f, v, g[c + 5], 12, 1200080426), v = s(v, $, h, f, g[c + 6], 17, -1473231341), f = s(f, v, $, h, g[c + 7], 22, -45705983), h = s(h, f, v, $, g[c + 8], 7, 1770035416), $ = s($, h, f, v, g[c + 9], 12, -1958414417), v = s(v, $, h, f, g[c + 10], 17, -42063), f = s(f, v, $, h, g[c + 11], 22, -1990404162), h = s(h, f, v, $, g[c + 12], 7, 1804603682), $ = s($, h, f, v, g[c + 13], 12, -40341101), v = s(v, $, h, f, g[c + 14], 17, -1502002290), h = a(h, f = s(f, v, $, h, g[c + 15], 22, 1236535329), v, $, g[c + 1], 5, -165796510), $ = a($, h, f, v, g[c + 6], 9, -1069501632), v = a(v, $, h, f, g[c + 11], 14, 643717713), f = a(f, v, $, h, g[c + 0], 20, -373897302), h = a(h, f, v, $, g[c + 5], 5, -701558691), $ = a($, h, f, v, g[c + 10], 9, 38016083), v = a(v, $, h, f, g[c + 15], 14, -660478335), f = a(f, v, $, h, g[c + 4], 20, -405537848), h = a(h, f, v, $, g[c + 9], 5, 568446438), $ = a($, h, f, v, g[c + 14], 9, -1019803690), v = a(v, $, h, f, g[c + 3], 14, -187363961), f = a(f, v, $, h, g[c + 8], 20, 1163531501), h = a(h, f, v, $, g[c + 13], 5, -1444681467), $ = a($, h, f, v, g[c + 2], 9, -51403784), v = a(v, $, h, f, g[c + 7], 14, 1735328473), h = r(h, f = a(f, v, $, h, g[c + 12], 20, -1926607734), v, $, g[c + 5], 4, -378558), $ = r($, h, f, v, g[c + 8], 11, -2022574463), v = r(v, $, h, f, g[c + 11], 16, 1839030562), f = r(f, v, $, h, g[c + 14], 23,
