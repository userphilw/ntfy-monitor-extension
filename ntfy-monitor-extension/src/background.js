const ntfyChannels = ['strangejamaican']; // Replace with user-specified channels
let unreadCount = 0;
let notifications = [];

// Function to fetch notifications from all ntfy.sh channels
async function fetchNotifications() {
    try {
        for (const channel of ntfyChannels) {
            const response = await fetch(`https://ntfy.sh/${channel}/json`);
            const data = await response.json();
            if (data && data.length > 0) {
                data.forEach(notification => {
                    if (!notifications.some(n => n.id === notification.id)) {
                        notifications.push(notification);
                        showNotification(notification, channel);
                        unreadCount++;
                        updateBadge();
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
}

// Function to show a browser notification
function showNotification(notification, channel) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: notification.title || `New Notification from ${channel}`,
        message: notification.message || 'You have a new message.',
        priority: 2
    });
}

// Function to update the extension icon badge
function updateBadge() {
    chrome.action.setBadgeText({ text: unreadCount > 0 ? String(unreadCount) : '' });
}

// Fetch notifications every minute
setInterval(fetchNotifications, 1800000);
fetchNotifications(); // Initial fetch on startup

// Listen for the extension button click to reset unread count
chrome.action.onClicked.addListener(() => {
    unreadCount = 0;
    updateBadge();
});