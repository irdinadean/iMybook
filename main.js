const { app, BrowserWindow } = require('electron');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3210;
const appFolder = __dirname;
let localServer = null;

function startLocalServer() {
    const contentTypes = {
        '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
        '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml'
    };

    return new Promise(function(resolve, reject) {
        const server = http.createServer(function(request, response) {
            const requestedPath = decodeURIComponent(
                new URL(request.url, 'http://127.0.0.1').pathname
            );
            const relativePath = requestedPath === '/'
                ? 'index.html' : requestedPath.replace(/^\/+/, '');
            const filePath = path.resolve(appFolder, relativePath);

            if (!filePath.startsWith(path.resolve(appFolder) + path.sep)) {
                response.writeHead(403);
                response.end('Forbidden');
                return;
            }

            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(404);
                    response.end('File not found');
                    return;
                }
                response.writeHead(200, {
                    'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream'
                });
                response.end(content);
            });
        });

        server.once('error', reject);
        server.listen(PORT, '127.0.0.1', function() { resolve(server); });
    });
}

async function createWindow() {
    if (!localServer) localServer = await startLocalServer();

    const win = new BrowserWindow({
        width: 1280,
        height: 850,
        minWidth: 950,
        minHeight: 650,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    win.loadURL('http://127.0.0.1:' + PORT + '/index.html');
}

app.whenReady().then(createWindow).catch(function(error) {
    console.error('Unable to start iMybook:', error);
});

app.on('before-quit', function() {
    if (localServer) {
        localServer.close();
        localServer = null;
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
