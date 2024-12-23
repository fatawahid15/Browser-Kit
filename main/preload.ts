import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  newTab: (url?: string) => ipcRenderer.send('new-tab', url),
  closeTab: (index: number) => ipcRenderer.send('close-tab', index),
  onUpdateTabs: (callback: (tabs: string[]) => void) => {
    const subscription = (_event: IpcRendererEvent, tabs: string[]) =>
      callback(tabs);
    ipcRenderer.on('update-tabs', subscription);

    return () => {
      ipcRenderer.removeListener('update-tabs', subscription);
    };
  },
  sendMessage: (message: string) => ipcRenderer.send('message', message),
  onReply: (callback: (reply: unknown) => void) => {
    const subscription = (_event: IpcRendererEvent, reply: unknown) =>
      callback(reply);
    ipcRenderer.on('message', subscription);

    return () => {
      ipcRenderer.removeListener('message', subscription);
    };
  },
});
