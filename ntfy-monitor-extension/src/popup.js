const notificationList = document.getElementById('notification-list');
const unreadCountElement = document.getElementById('unread-count');
let notifications = [];
let unreadCount = 0;

// Function to render notifications in the popup
function renderNotifications() {
    notificationList.innerHTML = '';
    notifications.forEach(notification => {
        const listItem = document.createElement('li');
        listItem.textContent = notification;
        notificationList.appendChild(listItem);
    });
    unreadCountElement.textContent = unreadCount;
}

// Function to fetch notifications from the background script
function fetchNotifications() {
    chrome.storage.local.get('notifications', (data) => {
        if (data.notifications) {
            notifications = data.notifications;
            unreadCount = notifications.length; // Assuming all fetched are unread
            renderNotifications();
        }
    });
}

// Event listener for the popup opening
document.addEventListener('DOMContentLoaded', fetchNotifications);

// Event listener for clearing notifications
document.getElementById('clear-notifications').addEventListener('click', () => {
    notifications = [];
    unreadCount = 0;
    chrome.storage.local.set({ notifications: [] });
    renderNotifications();
});

// Update the icon badge with unread count
chrome.runtime.sendMessage({ action: 'updateBadge', count: unreadCount });