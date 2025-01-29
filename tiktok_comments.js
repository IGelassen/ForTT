// Селектор для коментарів
const commentElements = document.querySelectorAll('[data-e2e="chat-message"]');

// Масив для зберігання даних
const commentsData = [];

// Функція для отримання посилання з модального вікна
function getProfileLinkFromModal() {
    return new Promise(resolve => {
        const checkModal = setInterval(() => {
            const userCard = document.querySelector('[data-e2e="user-card"]');
            if (userCard) {
                clearInterval(checkModal);
                const profileLinkElement = userCard.querySelector('a[href^="/@"]');
                resolve(profileLinkElement ? `https://www.tiktok.com${profileLinkElement.getAttribute('href')}` : 'Посилання не знайдено');
            }
        }, 100); // Перевірка кожні 100 мс
    });
}

// Функція для закриття модального вікна
function closeModal() {
    const closeButton = document.querySelector('[data-e2e="user-card"] .css-orso2u-DivClose');
    if (closeButton) {
        closeButton.click();
    }
}

// Обробка кожного коментаря асинхронно
async function processComments() {
    for (const [index, comment] of commentElements.entries()) {
        const username = comment.querySelector('[data-e2e="message-owner-name"]').textContent.trim();
        const clickableElement = comment.querySelector('[data-e2e="message-owner-name"], .e11g2s301');

        if (clickableElement) {
            clickableElement.click();

            try {
                const profileLink = await getProfileLinkFromModal();
                const commentText = comment.querySelector('.css-1kue6t3-DivComment').textContent.trim();
                commentsData.push(`${username}: ${profileLink} | ${commentText}`);
            } finally {
                closeModal();
            }

            if (index === commentElements.length - 1) {
                saveToFile(commentsData);
            }
        }
    }
}

// Функція для збереження даних у файл
function saveToFile(data) {
    const content = data.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'comments_with_links.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Запускаємо обробку коментарів
processComments();
