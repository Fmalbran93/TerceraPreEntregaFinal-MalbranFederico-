const socketClient = io();
const nombreUsuario = document.getElementById("nombreusuario");
const formulario = document.getElementById("formulario");
const inputmensaje = document.getElementById("mensaje");
const chat = document.getElementById("chat");

let usuario = null;

if (!usuario) {
  Swal.fire({
    title: "CHAT SOCIAL",
    text: "Ingresa tu usuario",
    input: "text",
    inputValidator: (value) => {
      if (!value) return "Necesitas ingresar tu Usuario";
    },
  }).then((username) => {
    usuario = username.value;
    nombreUsuario.innerHTML = usuario;
    socketClient.emit("nuevousuario", usuario);
  });
}

function scrollToBottom() {
  try {
    const chatContainer = document.getElementById("chat-messages");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  } catch (error) {
    console.error(error);
  }
}

formulario.onsubmit = (e) => {
  try {
    e.preventDefault();
    const info = { user: usuario, message: inputmensaje.value };
    console.log(info);
    socketClient.emit("mensaje", info);
    inputmensaje.value = " ";
    scrollToBottom();
  } catch (error) {
    console.error(error);
  }
};

socketClient.on("chat", (mensajes) => {
  try {
    const chatRender = mensajes
      .map((mensaje) => {
        const fechaCreacion = new Date(mensaje.createdAt);
        const opcionesHora = { hour: "2-digit", minute: "2-digit" };
        const horaFormateada = fechaCreacion.toLocaleTimeString(
          undefined,
          opcionesHora
        );
        return `<p class="message-container"><strong>${horaFormateada}</strong> - <strong>${mensaje.user}</strong>: ${mensaje.message}</p>`;
      })
      .join("");
    chat.innerHTML = chatRender;
  } catch (error) {
    console.error(error);
  }
});

socketClient.on("broadcast", (usuario) => {
  try {
    Toastify({
      text: `Ingreso ${usuario} al chat`,
      duration: 5000,
      position: "right",
      style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
    }).showToast();
  } catch (error) {
    console.error(error);
  }
});

document.getElementById("clearChat").addEventListener("click", () => {
  try {
    document.getElementById("chat").textContent = "";
    socketClient.emit("clearchat");
  } catch (error) {
    console.error(error);
  }
});
