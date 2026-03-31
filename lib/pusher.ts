import Pusher from "pusher";

const hasPusherConfig =
  Boolean(process.env.PUSHER_APP_ID) &&
  Boolean(process.env.PUSHER_KEY) &&
  Boolean(process.env.PUSHER_SECRET) &&
  Boolean(process.env.PUSHER_CLUSTER);

export const pusherServer = hasPusherConfig
  ? new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER!,
      useTLS: true
    })
  : null;

export async function emitEvent(channel: string, event: string, payload: unknown) {
  if (!pusherServer) {
    return;
  }

  await pusherServer.trigger(channel, event, payload);
}
