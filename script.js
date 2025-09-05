// script.js
const $ = id => document.getElementById(id);

// Настройки: твой apiUrl и mediaUrl
const API_URL = "https://7105.api.greenapi.com";
const MEDIA_URL = "https://7105.media.greenapi.com";

function baseUrl(id) {
  return `${API_URL}/waInstance${id}`;
}

function showResponse(obj) {
  const el = $('response');
  try {
    el.value = JSON.stringify(obj, null, 2);
  } catch (e) {
    el.value = String(obj);
  }
}

function errorHandler(err) {
  showResponse({ error: String(err) });
}

// GET запросы (getSettings, getStateInstance)
async function callGet(endpoint) {
  const id = $('idInstance').value.trim();
  const token = $('apiToken').value.trim();
  if (!id || !token) return showResponse({ error: 'Введите idInstance и ApiTokenInstance' });
  const url = `${baseUrl(id)}/${endpoint}/${token}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    showResponse(data);
  } catch (err) {
    errorHandler(err);
  }
}

// POST запросы (sendMessage, sendFileByUrl)
async function callPost(endpoint, bodyObj) {
  const id = $('idInstance').value.trim();
  const token = $('apiToken').value.trim();
  if (!id || !token) return showResponse({ error: 'Введите idInstance и ApiTokenInstance' });
  const url = `${baseUrl(id)}/${endpoint}/${token}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyObj)
    });
    const data = await res.json();
    showResponse(data);
  } catch (err) {
    errorHandler(err);
  }
}

/* Обработчики кнопок */
$('btnGetSettings').addEventListener('click', () => callGet('getSettings'));
$('btnGetState').addEventListener('click', () => callGet('getStateInstance'));

$('btnSendMsg').addEventListener('click', () => {
  const chatId = $('chatId').value.trim();
  const message = $('messageText').value;
  if (!chatId || !message) return showResponse({ error: 'Введите chatId и message' });
  callPost('sendMessage', { chatId, message });
});

$('btnSendFile').addEventListener('click', () => {
  const chatId = $('chatId').value.trim();
  const urlFile = $('urlFile').value.trim();
  const fileName = $('fileName').value.trim();
  const caption = $('caption').value.trim();
  if (!chatId || !urlFile) return showResponse({ error: 'Введите chatId и urlFile' });

  // Важно: для файловых операций используем MEDIA_URL
  callPost('sendFileByUrl', { 
    chatId, 
    urlFile: urlFile.replace("https://", `${MEDIA_URL}/`), 
    fileName, 
    caption 
  });
});

$('btnClear').addEventListener('click', () => $('response').value = '');
$('btnCopy').addEventListener('click', () => {
  const text = $('response').value;
  navigator.clipboard?.writeText(text)
    .then(() => alert('Скопировано'))
    .catch(() => alert('Ошибка копирования'));
});
