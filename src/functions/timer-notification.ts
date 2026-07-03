import * as Notifications from 'expo-notifications';

export async function scheduleNotification(delay: number, message: string, path: string) : Promise<string> {
    let notificationId = "";
    try {
        notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Cooking Timer Finished!",
                body: message,
                sound: true, // Uses device default alarm/notification sound
                data: { url: "myrecipebook://"+ path }
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: delay,
            },
        });
    } catch (error) {
        console.error("[nt] Failed to schedule notification: ", error);
    }

    return notificationId;
}

export async function cancelNotification(notificationId: string) {
    try {
        if(notificationId == null || notificationId ==="")
            return;

        await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
        console.error("[nt] Failed to cancel notification: ", error);
    }
}