// Importa Firebase SDK
import firebase from 'firebase/app';
import 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBeRSlzgtKuRoUn7zz11sKTPGWMRDwb95Q",
    authDomain: "chatglobal123.firebaseapp.com",
    projectId: "chatglobal123",
    storageBucket: "chatglobal123.appspot.com",
    messagingSenderId: "176815286648",
    appId: "1:176815286648:web:fc3031b31e4738d326008d"
  };
  

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Referencia a Firestore
const db = firebase.firestore();

// Referencia a la colección 'mensajes'
const messagesRef = db.collection('mensajes');

// Variables para almacenar el nombre del usuario
let userName = "";

// Referencias a elementos del DOM
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-btn");

// Evento al hacer clic en el botón de enviar
sendButton.addEventListener("click", function() {
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  if (name === "" || message === "") {
    alert("Por favor ingresa tu nombre y mensaje.");
    return;
  }

  // Si es la primera vez que se envía un mensaje, guarda el nombre
  if (userName === "") {
    userName = name;
  }

  // Guardar el mensaje en Firestore
  messagesRef.add({
    name: userName,
    message: message,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(function(docRef) {
    console.log("Mensaje guardado con ID: ", docRef.id);
  })
  .catch(function(error) {
    console.error("Error al guardar el mensaje: ", error);
  });

  // Limpiar los campos de entrada después de enviar el mensaje
  messageInput.value = "";
});

// Mostrar los mensajes guardados en tiempo real
messagesRef.orderBy('timestamp').onSnapshot(function(snapshot) {
  messageContainer.innerHTML = "";
  snapshot.forEach(function(doc) {
    const data = doc.data();
    appendMessage(data.name, data.message);
  });
});

function appendMessage(name, message) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");

  const messageInfo = document.createElement("span");
  messageInfo.classList.add("message-info");
  messageInfo.innerText = `${name}: `;

  const messageText = document.createElement("span");
  messageText.innerText = message;

  messageElement.appendChild(messageInfo);
  messageElement.appendChild(messageText);

  messageContainer.appendChild(messageElement);

  // Scroll hacia abajo para mostrar el último mensaje
  messageContainer.scrollTop = messageContainer.scrollHeight;
}
