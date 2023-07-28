import { Umami } from 'utils/interfaces';

declare var umami: Umami;

/*
 * Tracks an event with umami, it runs on a loop until the
 * umami script is loaded
 */
export const umamiTrack = async (object: any, logs = false) => {
  let id = 0;
  let tracked = false;
  object.website = '3da97745-3d91-480e-be75-d8197fe71d85';

  while (!tracked) {
    id = Date.now();
    object.ipc = id;

    logs && console.log('Sleep 1s');
    await sleep(1000);

    logs && console.log('Listening', `"umami-track-[${object.ipc}]"`, 'once');
    window.electron.ipcRenderer.once(
      //@ts-ignore
      `umami-track-[${object.ipc}]`,
      () => {
        // If the event was tracked, abort tracking
        if (tracked) return;
        // erase id to avoid sending it to umami
        let newObj = { ...object };
        delete newObj.ipc;

        umami.track(newObj).then((res: string) => {
          logs && console.log('umami-track-response', res);
          // if it doesn't returns common error, set tracked to true
          if (!res.includes('nvalid website')) {
            tracked = true;
          }
        });
      }
    );
    //@ts-ignore
    window.electron.ipcRenderer.sendMessage('umami-track', object);
  }
  logs && console.log('track sent with sucess', object);
};

async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
}
