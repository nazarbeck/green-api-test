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
async function sendFileByUrl() {
  const id = $('idInstance').value.trim();
  const token = $('apiToken').value.trim();
  const chatId = $('chatId').value.trim();
  const urlFile = $('urlFile').value.trim();
  const fileName = $('fileName').value.trim();
  const caption = $('caption').value.trim();

  if (!id || !token) return showResponse({ error: 'Введите idInstance и ApiTokenInstance' });
  if (!chatId || !urlFile) return showResponse({ error: 'Введите chatId и urlFile' });

  const url = `${baseUrl(id)}/sendFileByUrl/${token}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, urlFile, fileName, caption })
    });
    const data = await res.json();
    showResponse(data);
  } catch (err) {
    errorHandler(err);
  }
}

async function getQrCode() {
  const id = "7105315582";
  const token = "a46dcf1cf9a54175b344bc55d18d2767788364475ca14f0899";
  const url = `https://7105.api.greenapi.com/waInstance${id}/qr/${token}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data?.message) {
    const img = document.createElement("img");
    img.src = "data:image/png;base64," + data.message;
    document.body.appendChild(img);
  } else {
    console.log("Ошибка или инстанс уже авторизован:", data);
  }
}

async function getQrCode() {
  const id = $('idInstance').value.trim();
  const token = $('apiToken').value.trim();

  if (!id || !token) return showResponse({ error: 'Введите idInstance и ApiTokenInstance' });

  const url = `${baseUrl(id)}/qr/${token}`;
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data?.message) {
      // Очистим контейнер и добавим картинку
      const qrContainer = $('qrContainer');
      qrContainer.innerHTML = "";
      const img = document.createElement("img");
      img.src = "data:image/png;base64," + data.message;
      img.alt = "QR code";
      img.style.maxWidth = "300px";
      qrContainer.appendChild(img);

      showResponse({ status: "QR получен, отсканируйте в WhatsApp" });
    } else {
      showResponse(data);
    }
  } catch (err) {
    errorHandler(err);
  }
}


/* Обработчики кнопок */
$('btnGetSettings').addEventListener('click', () => callGet('getSettings'));
$('btnGetState').addEventListener('click', () => callGet('getStateInstance'));
$('btnSendMsg').addEventListener('click', sendMessage);
$('btnSendFile').addEventListener('click', sendFileByUrl);
$('btnGetQr').addEventListener('click', getQrCode);
$('btnClear').addEventListener('click', () => $('response').value = '');

