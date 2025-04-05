import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'



const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value)
  },
  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args)
    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
}

contextBridge.exposeInMainWorld('electron', {
  createUser: (username: string, masterPassword: string) =>
    ipcRenderer.invoke('create-user', { username, masterPassword }),
  verifyUser: (username: string, masterPassword: string) =>
    ipcRenderer.invoke('verify-user', { username, masterPassword }),
  getEntries: (username: string, masterPassword: string) =>
    ipcRenderer.invoke('get-entries', username, masterPassword),
  addEntries: (username: string, entry: any, masterPassword: string) =>
    ipcRenderer.invoke('add-entry', { username, entry, masterPassword }),
  updateEntry: (username: string, entryId: string, updatedEntry: any, masterPassword: string) =>
    ipcRenderer.invoke('update-entry', { username, entryId, updatedEntry, masterPassword }),
  deleteEntry: (username: string, entryId: string) =>
    ipcRenderer.invoke('delete-entry', { username, entryId })
});


contextBridge.exposeInMainWorld('ipc', handler)

export type IpcHandler = typeof handler
