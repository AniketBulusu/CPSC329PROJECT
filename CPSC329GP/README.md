# Nextron App

This is a desktop application built using Nextron (Electron + Next.js). It is a Windows native application, built SPECIFICALLY FOR WINDOWS. 
However, it can be forcefully ran on Mac with some extra steps. (NOT RECOMMENDED!! VERY TEDIOUS)

Safely stores keys using AES-256-CBC algorithms, along with proper salting practices

## How to Run

### On Windows
Simply double-click the `.exe` file. No installation is required.

### On macOS
1. Find the `SafeKey Password Bank MAC.zip` in the `dist` folder.
2. Unzip the file
3. move the app to the `Applications` folder (optional).
4. Open Terminal and run the following command:

   ```bash
   xattr -c /path/to/"SafeKey Password Bank MAC.app" (Quotations necessary!)

5. Open the application as normal

