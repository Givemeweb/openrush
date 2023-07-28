import { getProspects, listen } from 'features/database/renderer';
import { Channels, ListenChannels } from 'main/preload';
import { useEffect, useState } from 'react';
import { Prospect } from 'utils/interfaces';

/**
 * Returns array of propects with a specific state defined on 'query'.
 * Use 'channel' to tell the main renderer where to send the response.
 *
 * @param {object} query - query to fetch data from database
 * @param {Channels} replyChannel - channel to listen to responses
 * @returns {Prospect[]} Array of Prospect
 */
const useProspects = (query: {}, replyChannel: ListenChannels) => {
  const [prospects, setProspects] = useState<Prospect[]>([]);

  useEffect(() => {
    console.log('useProspects', query, replyChannel);
    window.electron.ipcRenderer.on(
      replyChannel,
      //@ts-ignore
      (response: { prospects: Prospect[] }) => {
        setProspects(response.prospects);
      }
    );

    window.electron.ipcRenderer.on(
      'adio',
      //@ts-ignore
      (response: { prospects: Prospect[] }) => {
        console.log(response);
      }
    );
    window.electron.ipcRenderer.sendMessage('hola', query, replyChannel);

    window.electron.ipcRenderer.sendMessage(
      'get-prospects',
      query,
      replyChannel
    );

    return () => {
      window.electron.ipcRenderer.removeListener(replyChannel);
    };
  }, []);

  return { prospects };
};

export default useProspects;
