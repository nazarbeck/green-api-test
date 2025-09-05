// script.js
const $ = id => document.getElementById(id);

// Основной API URL
const API_URL = "https://7105.api.greenapi.com";

function baseUrl(id) {
  return `${API_URL}/waInstance${id}`;
}

function showResponse(obj) {
  const el = $('response');
  try {
    el.value = JSON.stringify(obj, null, 2);
  } catch {
    el.value = String(obj);
  }
}

function errorHandler(err) {
  showResponse({ error: String(err) });
}

// GET-запросы (getSettings, getStateInstance)
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

// POST-запрос sendMessage
async function sendMessage() {
  const id = $('idInstance').value.trim();
  const token = $('apiToken').value.trim();
  const chatId = $('chatId').value.trim();
  const message = $('messageText').value.trim();

  if (!id || !token) return showResponse({ error: 'Введите idInstance и ApiTokenInstance' });
  if (!chatId || !message) return showResponse({ error: 'Введите chatId и message' });

  const url = `${baseUrl(id)}/sendMessage/${token}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, message })
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
$('btnSendMsg').addEventListener('click', sendMessage);
$('btnClear').addEventListener('click', () => $('response').value = '');
