import { Text } from '@semcore/ui/typography';
import { useEffect, useState } from 'react';

const SideBar = () => {
  const [appVersion, setappVersion] = useState('x.x.x');

  const [updateText, setupdateText] = useState('');

  useEffect(() => {
    window.electron.ipcRenderer.once('version', (version) => {
      setappVersion(version);
    });
    window.electron.ipcRenderer.once('update-available', (version) => {
      setupdateText('Update available');
      setTimeout(() => {
        setupdateText('');
      }, 5000);
    });
    window.electron.ipcRenderer.once('update-not-available', (version) => {
      setupdateText('Update not available');
      setTimeout(() => {
        setupdateText('');
      }, 5000);
    });
    window.electron.ipcRenderer.once('update-downloaded', (version) => {
      setupdateText('Update downloaded');
      setTimeout(() => {
        setupdateText('');
      }, 5000);
    });
    window.electron.ipcRenderer.once('error', (version) => {
      setupdateText('error');
      setTimeout(() => {
        setupdateText('');
      }, 5000);
    });
  }, []);

  return (
    <div className="">
      <p className="p-2 text-gray-400 text-sm">Version {appVersion}</p>
      <p className="p-2 text-gray-400 text-sm">{updateText}</p>
      <hr />
      <div className="flex flex-col px-1 gap-1 py-4 h-screen">
        <div className="w-48 px-3">
          <Text className="text-gray-400">LINK BUILDING</Text>
        </div>
        <div className="bg-[#FFE1D6] w-48 px-3 py-1 rounded-md cursor-pointer">
          <Text className="text-[#DB2E00]">Link Building Tool</Text>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
