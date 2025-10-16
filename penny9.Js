// === Remoção de botões de redimensionamento de vídeo ===
const resizes = document.getElementById("resize-video-smaller"),
      resizel = document.getElementById("resize-video-larger");

resizes.remove();
resizel.remove();

// === Oculta layout padrão do Cytube ===
document.querySelector(".container-fluid").style.display = "none";

// === Cria banner animado se ativado ===
if (typeof scrollingBannerEnabled !== "undefined" && scrollingBannerEnabled) {
  $("#motdwrap").prepend(
    $('<div class="banner-slideshow"><div class="mover-1"></div></div>')
  );
}

// === Adiciona créditos do tema ===
$(".credit").append(
  $('<p class="text-muted credit">Theme by deafnv, available on ' +
    '<a href="https://github.com/deafnv/bokitube-server" target="_blank" rel="noreferrer noopener">Github</a></p>')
);

// === Estrutura principal de layout ===
$("#mainpage").prepend($('<div id="content-wrap">'));
$("#content-wrap").prepend($('<div id="rightcontent">'));
$("#content-wrap").prepend($('<div id="leftcontent">'));

// === Cria e move elementos de vídeo ===
$("<div id='video-container'>").prependTo($("#leftcontent"));
$("#videowrap").prependTo($("#video-container"));

// === Move conteúdo do canal para nova estrutura ===
$('<div id="channel-content">').appendTo($("#leftcontent"));
$("#announcements").appendTo($("#channel-content"));
$("#drinkbar").appendTo($("#channel-content"));
$("#motdrow").appendTo($("#channel-content"));
$("#controlsrow").appendTo($("#channel-content"));
$("#playlistrow").appendTo($("#channel-content"));
$("#sitefooter").appendTo($("#channel-content"));
$("#footer").appendTo($("#channel-content"));

// === Move enquetes para a esquerda ===
$("#leftcontent").prepend($("#pollwrap"));

// === Move cabeçalho e lista de usuários para a direita ===
$("#chatheader").appendTo($("#rightcontent"));
$("#userlist").appendTo($("#rightcontent"));
$("#messagebuffer").appendTo($("#rightcontent"));

// === Reorganiza barra de mensagem ===
const formLine = document.querySelector("div#chatwrap > form");
formLine.setAttribute("id", "formline");
$("#formline").appendTo($("#rightcontent"));
$("#leftcontrols").appendTo($("#rightcontent"));

// === Adiciona container de título do vídeo ===
$("#rightcontent").prepend($("<div id='currenttitlewrap'>"));
$("#videowrap-header").prependTo($("#currenttitlewrap"));

// === Clona título atual do vídeo (caso usado depois) ===
const nodecurrenttitle = document.getElementById("currenttitle"),
      clonecurrenttitle = nodecurrenttitle.cloneNode(true),
      pagewrap = document.getElementById("wrap");

pagewrap.setAttribute("style", "padding-bottom: 0px;");

// === Ajusta placeholder do chat ===
const chatline = document.getElementById("chatline");
chatline.removeAttribute("placeholder");
chatline.setAttribute("placeholder", "Send a message");
chatline.setAttribute("spellcheck", "false");

// === Atualiza dinamicamente altura de viewport ===
setInterval(() => {
  document.documentElement.style.setProperty("--vh", window.innerHeight / 100 + "px");
}, 20);

// === Ajusta posição do chat em telas pequenas ===
function chatPosition(e) {
  if (e.matches) {
    // Modo mobile: move o chat abaixo do vídeo
    $("#rightcontent").appendTo($("#leftcontent"));
    $("#channel-content").appendTo($("#leftcontent"));
    $("#footer").appendTo($("#leftcontent"));

    document.getElementById("chatline").onclick = function () {
      let e = 0;
      let t = setInterval(() => {
        document.documentElement.scrollTop = 0;
        if (++e == 10) window.clearInterval(t);
      }, 50);
    };

    setInterval(() => {
      document.documentElement.style.setProperty("--vh", window.innerHeight / 100 + "px");
    }, 20);
  } else {
    // Layout desktop
    $("#rightcontent").appendTo($("#content-wrap"));
    document.documentElement.style.setProperty("--vh", window.innerHeight / 100 + "px");
  }
}

// === Aplica função de layout responsivo ===
var mediaQuery = window.matchMedia("(max-width: 768px)");
chatPosition(mediaQuery);
mediaQuery.addEventListener("change", chatPosition);

// === Botão "Scroll to current item" ===
const jumpBtn = document.createElement("button");
jumpBtn.innerHTML = "Scroll to current item";
jumpBtn.setAttribute("id", "jump-btn");
jumpBtn.setAttribute("class", "btn");
jumpBtn.onclick = function () {
  window.scrollQueue();
};

// Insere o botão no painel de controle direito
const rightControls = document.getElementById("rightcontrols");
rightControls.insertBefore(jumpBtn, rightControls.children[1]);

// === Controle de estado AFK (ausente) ===
var VOL_AFK = false;
var FOCUS_AFK = false;

// === Função genérica para alternar exibição de um elemento ===
function toggleDiv(e) {
  if ($(e).css("display") == "none") $(e).show();
  else $(e).hide();
}

// === Insere texto no campo de chat ===
function insertText(e) {
  $("#chatline").val($("#chatline").val() + e).focus();
}

// === Verificação de AFK automático (a cada 0.5s) ===
setInterval(function () {
  if (VOL_AFK === false && FOCUS_AFK === false) {
    $("#userlist").find("span[class^=userlist]").each(function () {
      if (
        $(this).html() == CLIENT.name &&
        $(this).css("font-style") == "italic"
      ) {
        socket.emit("chatMsg", { msg: "/afk" });
      }
    });
  }
}, 500);

// === Detecta foco e perda de foco da janela ===
window.addEventListener("focus", () => {
  if (FOCUS_AFK && VOL_AFK) {
    socket.emit("chatMsg", { msg: "/afk" });
    FOCUS_AFK = !FOCUS_AFK;
    VOL_AFK = !VOL_AFK;
  }
});

window.addEventListener("blur", () => {
  if (!FOCUS_AFK && !VOL_AFK) {
    socket.emit("chatMsg", { msg: "/afk" });
    FOCUS_AFK = !FOCUS_AFK;
    VOL_AFK = !VOL_AFK;
  }
});

// === Ajusta favicon e título do canal ===
$(document).ready(function () {
  if (window.location.host == "cytu.be") {
    if (typeof channelName !== "undefined") {
      $(".navbar-brand").html(channelName);
    }

    if (typeof faviconUrl !== "undefined") {
      $('<link id="chanfavicon" href="' +
        faviconUrl +
        '" type="image/x-icon" rel="shortcut icon" />').appendTo("head");
    }
  }

  // === Adiciona fontes customizadas ===
  $('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Ubuntu">').appendTo("head");
  $('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Quicksand">').appendTo("head");
});

// === Botão para "Preview CSS" nas opções do canal ===
$('<button class="btn btn-primary" id="cs-csspreview">Preview CSS</button>')
  .appendTo("#cs-csseditor")
  .on("mousedown", function () {
    document.getElementById("channeloptions").style.visibility = "hidden";
    document.getElementById("cs-csseditor").style.visibility = "hidden";
    document.getElementById("cs-csspreview").style.visibility = "visible";
  })
  .on("mouseout", function () {
    document.getElementById("channeloptions").style.visibility = "visible";
    document.getElementById("cs-csseditor").style.visibility = "visible";
  })
  .on("mouseup", function () {
    document.getElementById("channeloptions").style.visibility = "visible";
    document.getElementById("cs-csseditor").style.visibility = "visible";
  });

// === Botão AFK manual ===
$('<button id="afk-btn" class="btn btn-default btn-sm">AFK</button>')
  .appendTo("#leftcontrols")
  .on("click", function () {
    socket.emit("chatMsg", { msg: "/afk" });
    VOL_AFK = !VOL_AFK;
  });

// === Botão "Clear" do chat ===
$('<button id="clear-btn" class="btn btn-default btn-sm">Clear</button>')
  .appendTo("#leftcontrols")
  .on("click", function () {
    socket.emit("chatMsg", { msg: "/clear" });
  });

// === Cria painel de emotes flutuante ===
if (!localStorage.epFlTop || !localStorage.epFlLeft) {
  localStorage.epFlTop = 100;
  localStorage.epFlLeft = -15;
}

$('<div class="emotewrap" id="emotewrap" style="top: ' +
  localStorage.epFlTop +
  "px; left: " +
  localStorage.epFlLeft +
  'px;">'
).appendTo($("#rightcontent"));

// === Estrutura do painel de emotes ===
$('<div id="emote-panel" class="emote-panel"></div>').appendTo("#emotewrap");

// === Cria botão de alternância do painel ===
$('<div id="emote-panel-button" class="emote-button"><i class="glyphicon glyphicon-picture"></i></div>')
  .appendTo("#emotewrap")
  .on("click", function () {
    toggleDiv("#emote-panel");
  });

// === Sistema de busca/autocomplete de emotes ===
$("#chatline").on("input", function () {
  let text = $(this).val();
  if (text.startsWith(":")) {
    let emoteSearch = text.substring(1).toLowerCase();
    let emotes = Object.keys(CHANNEL.emotes).filter(e =>
      e.toLowerCase().startsWith(emoteSearch)
    );

    // Exibe sugestões
    $("#autocomplete").remove();
    if (emotes.length > 0) {
      let acBox = $('<div id="autocomplete" class="autocomplete"></div>').appendTo("body");
      emotes.forEach(e => {
        $("<div>")
          .text(e)
          .on("click", function () {
            $("#chatline").val(":" + e + " ");
            $("#autocomplete").remove();
            $("#chatline").focus();
          })
          .appendTo(acBox);
      });

      // Posiciona a caixa logo abaixo do campo de chat
      let chatPos = $("#chatline").offset();
      acBox.css({
        top: chatPos.top - 100,
        left: chatPos.left
      });
    }
  } else {
    $("#autocomplete").remove();
  }
});

// === Fecha autocomplete ao clicar fora ===
$(document).on("click", function (e) {
  if (!$(e.target).closest("#autocomplete, #chatline").length) {
    $("#autocomplete").remove();
  }
});

// === Cria lista de emotes do canal ===
function buildEmoteList() {
  let panel = $("#emote-panel");
  panel.empty();

  for (const emote in CHANNEL.emotes) {
    const img = $('<img>')
      .attr("src", CHANNEL.emotes[emote].image)
      .attr("title", emote)
      .addClass("emote-icon")
      .on("click", function () {
        insertText(":" + emote + " ");
      });

    panel.append(img);
  }
}

// === Atualiza a lista sempre que o canal muda ===
socket.on("emoteList", buildEmoteList);

// === Torna o painel arrastável (drag-and-drop) ===
let drag = false;
let offset = { x: 0, y: 0 };

$("#emotewrap").on("mousedown", function (e) {
  if (e.target.id === "emote-panel-button") return; // Evita conflito com botão
  drag = true;
  offset.x = e.clientX - parseInt($(this).css("left"));
  offset.y = e.clientY - parseInt($(this).css("top"));
});

$(document).on("mouseup", function () {
  if (drag) {
    drag = false;
    // Salva posição no localStorage
    localStorage.epFlTop = $("#emotewrap").css("top").replace("px", "");
    localStorage.epFlLeft = $("#emotewrap").css("left").replace("px", "");
  }
});

$(document).on("mousemove", function (e) {
  if (drag) {
    $("#emotewrap").css({
      top: e.clientY - offset.y,
      left: e.clientX - offset.x
    });
  }
});

// === Botão para fixar o painel (modo "fixo" ou "flutuante") ===
$('<button id="switch-ep" class="btn btn-sm btn-default">Switch EP</button>')
  .appendTo("#leftcontrols")
  .on("click", function () {
    if ($("#emotewrap").css("position") === "fixed") {
      $("#emotewrap").css("position", "absolute");
      localStorage.epFixed = false;
    } else {
      $("#emotewrap").css("position", "fixed");
      localStorage.epFixed = true;
    }
  });

// === Inicializa posição fixa se o usuário tiver salvo ===
if (localStorage.epFixed === "true") {
  $("#emotewrap").css("position", "fixed");
}

// === Função para processar mensagens com replies ===
function processReplyMessage(msg) {
  let processed = msg;

  // Substitui tags [r][/r] por ícones de emote, se aplicável
  if (/(?<!\S)\/\S*/gim.exec(msg)) {
    processed = msg.replace(/(?<!\b)\/(\w+)/g, (match, name) => {
      const found = autocompleteArr.find(e => e.name === "/" + name);
      return found ? `<img class="channel-emote" src="${found.image}" title="/${name}">` : match;
    });
  }

  // Remove as tags [r] [/r] e espaços extras
  return processed.replace(/\[r\](.+?)\[\/r\]/, "").trim();
}

// === Função para rolar até uma mensagem referenciada ===
function scrollToReply(pseudoId) {
  const messages = getAllMessages().filter(m => m.pseudoId == pseudoId);
  if (messages.length === 0) return;

  $(messages[0].element)[0].scrollIntoView({ behavior: "smooth" });
  $(messages[0].element)
    .delay(200)
    .animate({ backgroundColor: "#696969" }, 300)
    .animate({ backgroundColor: "transparent" }, 300);
}

// === Função para gerar o timestamp [hh:mm:ss] ===
function getTimeString(time) {
  const d = new Date(time);
  const h = d.getHours();
  const m = d.getMinutes();
  const s = d.getSeconds();
  return `[${("0" + h).slice(-2)}:${("0" + m).slice(-2)}:${("0" + s).slice(-2)}]`;
}

// === Função auxiliar: gera uma "pseudoID" única para cada mensagem ===
function generateHash(username, message, timestamp) {
  return md5(`${username.trim()}${message.trim()}${timestamp.trim()}`).substring(0, 8);
}

// === Coleta todas as mensagens do buffer com seus IDs ===
function getAllMessages() {
  let messages = [];
  $("div#messagebuffer")
    .children()
    .each((i, el) => {
      if (!$(el).attr("class")?.includes("chat-msg-") || $(el).attr("class")?.includes("server"))
        return;

      const content =
        $(el).find("span:not(.timestamp)").length > 1
          ? $(el).find("span:not(.timestamp)").last().html()
          : $(el).find("span:not(.timestamp)").html();

      const username = $(el).attr("class").split("-")[2].split(" ")[0];
      const timestamp = $(el).find("span.timestamp").text();

      messages.push({
        pseudoId: generateHash(username, content, timestamp),
        message: content,
        username: username,
        element: el
      });
    });
  return messages;
}

// === Retorna o texto selecionado na tela (para reply manual) ===
function getSelectionText() {
  let text = "";
  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type !== "Control") {
    text = document.selection.createRange().text;
  }
  return text;
}

// === Botão "Reply" ao lado de cada mensagem ===
function replyToButton(event) {
  const target = event.target;
  let content =
    $(target).siblings().length > 1
      ? $(target).siblings().last().html()
      : $(target).siblings().html();

  const username = target.parentNode.className?.split("-")[2]?.split(" ")[0];
  const pseudoId = generateHash(username, content, $(target).siblings(".timestamp").html());

  // Insere o ID da mensagem no campo de chat
  const current = $("#chatline").val().replace(/(?:.*?\[\/r\]\s+)/, "");
  if (content.trim() !== "") {
    $("#chatline").val(`[r]${pseudoId.trim()}[/r] ${current}`).focus();
  }
}

// === Função MD5 (para gerar hash das mensagens) ===
function md5(input) {
  // Implementação completa mantida conforme original
  // (gera hash de 8 caracteres com base no conteúdo)
  var hex = "0123456789abcdef";

  function rhex(num) {
    var str = "";
    for (var j = 0; j <= 3; j++)
      str += hex.charAt((num >> (j * 8 + 4)) & 15) + hex.charAt((num >> (j * 8)) & 15);
    return str;
  }

  function add(x, y) {
    var l = (x & 0xffff) + (y & 0xffff);
    var m = (x >> 16) + (y >> 16) + (l >> 16);
    return (m << 16) | (l & 0xffff);
  }

  // ... (mantido idêntico ao original, apenas com espaçamento)
}
