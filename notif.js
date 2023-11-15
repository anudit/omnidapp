await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `key=<FCM-SERVER-KEY>`,
    },
    body: JSON.stringify({
        to: '<NATIVE-DEVICE-PUSH-TOKEN>',
        priority: 'normal',
        data: {
            experienceId: '@anuditnagar/omnid-app',
            scopeKey: '@anuditnagar/omnid-app',
            title: "📧 You've got mail",
            message: 'Hello world! 🌐',
        },
    }),
});