import { ipcRenderer } from 'electron';
import { Channels } from 'main/preload';
import { NewProspect, Prospect, ProspectState } from 'utils/interfaces';

// Listens to main replies
export const listen = async (channel: Channels, query: {}, cb: Function) => {
  window.electron.ipcRenderer.on(channel, (arg: any) => {
    cb(arg);
  });

  window.electron.ipcRenderer.on('added-prospect' + responseId, (arg: any) => {
    if (!arg.ok) return;

    console.log(arg);
    getProspects(dbListenObj);
    cb('add-prospect');
  });

  window.electron.ipcRenderer.on('set-prospects' + responseId, (arg: any) => {
    console.log('set-prospects' + responseId, arg);
    cb({ action: 'set-prospects', ...arg });
  });

  return function disconnectListeners() {
    window.electron.ipcRenderer.removeListener(channel);
  };
};

// Tells main to get prospects
export const getProspects = async (query: {}, responseId: string) => {
  console.log('get-prospects', query);
  window.electron.ipcRenderer.sendMessage('get-prospects', {
    limit: 100,
    query,
    responseId,
  });
};

// Tells main to add prospects
export const addProspect = async (
  prospect: NewProspect,
  responseId: string
) => {
  console.log('fsaioef jiae', prospect);
  prospect.state = 'prospect';
  prospect.created = new Date();
  prospect.updated = new Date();
  window.electron.ipcRenderer.sendMessage('add-prospect', prospect, responseId);
};

export const updateProspect = async (
  _id: string,
  channel: Channels,
  object: {}
) => {
  window.electron.ipcRenderer.sendMessage('update-prospect', channel, {
    _id,
    object,
  });
};

// Tells main to delete prospects
export const deleteProspect = async (_id: string) => {
  window.electron.ipcRenderer.sendMessage('delete-prospect', _id);
};
