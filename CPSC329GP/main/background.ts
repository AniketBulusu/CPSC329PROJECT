import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import Store from 'electron-store'
import { backendLogic } from './logic'

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

const store = new Store()

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})

ipcMain.handle('create-user', async(event, {username, masterPassword}) => {
  return backendLogic.createUser(username, masterPassword)
})

ipcMain.handle('verify-user', async (event, { username, masterPassword }) => {
  return backendLogic.verifyUser(username, masterPassword)
})

ipcMain.handle('get-entries', async (event, username) => {
  return backendLogic.getEntries(username)
})

ipcMain.handle('add-entry', async (event, { username, entry }) => {
  return backendLogic.addEntry(username, entry)
})

ipcMain.handle('update-entry', async (event, { username, entryId, updatedEntry }) => {
  return backendLogic.updateEntry(username, entryId, updatedEntry)
})

ipcMain.handle('delete-entry', async (event, { username, entryId }) => {
  return backendLogic.deleteEntry(username, entryId)
})
