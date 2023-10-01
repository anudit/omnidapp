import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_NOTIF_TASK = 'background-notifications-task';

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_NOTIF_TASK, async () => {
  const now = Date.now();

  console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);

  Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: `Here is the notification body  ${new Date(now).toISOString()}`,
      data: { data: 'goes here' },
    },
    trigger: null,
  });

  // Be sure to return the successful result type!
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

// 2. Register the task at some point in your app by providing the same name,
// and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function registerBackgroundNotifications() {
  console.log('registerBackgroundNotifications');
  return BackgroundFetch.registerTaskAsync(BACKGROUND_NOTIF_TASK, {
    minimumInterval: 10, // 10 secs
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background fetch calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function unregisterBackgroundNotifications() {
  console.log('unregisterBackgroundNotifications');
  await BackgroundFetch.unregisterTaskAsync(BACKGROUND_NOTIF_TASK);
}

const getNotificationStatus = async () => {
  const sysStatus = await BackgroundFetch.getStatusAsync();
  const regStatus = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIF_TASK);
  return sysStatus === BackgroundFetch.BackgroundFetchStatus.Available && regStatus;
};

const toggleNotifications = async () => {
  let current = await getNotificationStatus();
  if (current === true) {
    await unregisterBackgroundNotifications()
    return false;
  }
  else {
    await registerBackgroundNotifications();
    return true;
  }

}

export {
  getNotificationStatus, registerBackgroundNotifications, toggleNotifications
};

