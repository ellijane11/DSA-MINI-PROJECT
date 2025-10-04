# Collaboration / Live Share

This project includes a quick guide to start a Live Share session and run the app locally so collaborators can join and test.

## Install Live Share (recommended)
1. In VS Code, install the extension: `Live Share` (publisher: ms-vsliveshare).
2. Reload VS Code if prompted.

## Start a Live Share session
1. Open the workspace folder in VS Code.
2. Click the Live Share icon in the status bar or command palette: `Live Share: Start collaboration session`.
3. Copy the join link and send it to your collaborator(s).

## How collaborators run the app
1. Clone the repository and open it in VS Code.
2. Ensure they have Node.js (v16+) and npm installed.
3. From the terminal in the workspace root run:

```powershell
npm install
npm run dev
```

4. The host will be running the dev server. If the host enables port sharing in Live Share, collaborators can preview the running app using the forwarded port. Otherwise, collaborators can run the dev server locally as well.

## Notes
- Live Share allows co-editing and shared terminals, but you might need to coordinate who runs the dev server to avoid port conflicts.
- If you need a persistent backend accessible from all collaborators, consider deploying a small server or using ngrok to expose a locally running backend.
