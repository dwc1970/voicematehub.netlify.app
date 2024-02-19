// Obtener referencias a los elementos del DOM
const output = document.getElementById('output');
const fontSelect = document.getElementById('fontSelect');
const voiceSelect = document.getElementById('voiceSelect');
const languageSelect = document.getElementById('languageSelect');
const rateRange = document.getElementById('rateRange');
const volumeRange = document.getElementById('volumeRange');
const userInput = document.getElementById('userInput');
const submitButton = document.getElementById('submitButton');
const clearButton = document.getElementById('clearButton');

// Función para limpiar el campo de entrada y la salida
function clearFields() {
  userInput.value = '';
  output.innerHTML = '';
}

// Función para agregar un mensaje al chat
function addMessage(message, sender) {
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  messageElement.classList.add(sender);
  output.appendChild(messageElement);
  // Desplazar el chat hacia abajo para mostrar el último mensaje
  output.scrollTop = output.scrollHeight;
}

// Función para traducir texto usando la API de Google Translate
async function translateText(text, sourceLang, targetLang) {
  const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${text}`);
  const data = await response.json();
  return data[0][0][0]; // Obtenemos la traducción del primer resultado
}

// Manejador de eventos para el botón de enviar
submitButton.addEventListener('click', async function() {
  const text = userInput.value;
  const selectedVoice = voiceSelect.value;
  const selectedLanguage = languageSelect.value;
  const rate = rateRange.value;
  const volume = volumeRange.value;

  let translatedText = text;
  if (selectedLanguage === 'en-US') {
    translatedText = await translateText(text, 'es', 'en'); // Traducimos el texto a inglés
  }

  const utterance = new SpeechSynthesisUtterance(translatedText);
  utterance.voice = speechSynthesis.getVoices().find(voice => voice.name === selectedVoice);
  utterance.lang = selectedLanguage;
  utterance.rate = parseFloat(rate);
  utterance.volume = parseFloat(volume);

  speechSynthesis.speak(utterance);
  addMessage(text, 'user');
  userInput.value = '';
});

// Manejador de eventos para el botón de limpiar campos
clearButton.addEventListener('click', clearFields);

// Limpiar campos al cargar la página
window.addEventListener('load', clearFields);
