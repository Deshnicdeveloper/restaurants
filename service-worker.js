importScripts("https://js.pusher.com/beams/service-worker.js");


{/* <script src="https://js.pusher.com/beams/2.1.0/push-notifications-cdn.js"></script> */}

const beamsClient = new PusherPushNotifications.Client({
    instanceId: '8ca2a1ea-846d-46a7-8cdf-c271fe4df3e3',
  });

  beamsClient.start()
    .then(() => beamsClient.addDeviceInterest('hello'))
    .then(() => console.log('Successfully registered and subscribed!'))
    .catch(console.error);