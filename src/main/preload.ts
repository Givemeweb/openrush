// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type SendChannels =
  | 'get-prospect'
  | 'get-prospects'
  | 'add-prospect'
  | 'update-prospects'
  | 'update-prospect'
  | 'update-rejected'
  | 'update-in-progress';

export type ListenChannels =
  | 'updated-prospects'
  | 'updated-earned'
  | 'updated-rejected'
  | 'updated-prospect'
  | 'updated-in-progress';

export type Channels =
  | 'ipc-example'
  | 'add-prospect'
  | 'get-prospects'
  | 'set-prospects'
  | 'added-prospect'
  | 'delete-prospect'
  | 'update-prospect'
  | 'you-can-use-umami'
  | 'you-can-use-umami-error'
  | 'lbt-prospects-add'
  | 'lbt-prospects-get'
  | 'lbt-rejected-add'
  // Listen channels
  | 'prospects-updated'
  | 'in-progress-updated'
  | 'rejected-updated'
  // Send channels
  | 'update-prospect'
  | 'update-in-progress'
  | 'update-rejected'
  //
  | 'open-external';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: SendChannels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: ListenChannels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: ListenChannels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    removeListener(channel: ListenChannels) {
      ipcRenderer.removeAllListeners(channel);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
