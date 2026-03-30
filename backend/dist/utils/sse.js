"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastNotification = exports.removeClient = exports.addClient = exports.clients = void 0;
// Keeps track of active connections
exports.clients = [];
const addClient = (req, res, id, branchId, role) => {
    exports.clients.push({ id, branchId, role, res });
    // Heartbeat to keep connection alive
    const intervalId = setInterval(() => {
        res.write(':\n\n'); // SSE Comment/heartbeat
    }, 15000);
    // Remove client when connection drops
    req.on('close', () => {
        clearInterval(intervalId);
        (0, exports.removeClient)(id);
    });
};
exports.addClient = addClient;
const removeClient = (id) => {
    const index = exports.clients.findIndex(c => c.id === id);
    if (index !== -1) {
        exports.clients.splice(index, 1);
    }
};
exports.removeClient = removeClient;
const broadcastNotification = (data, filter) => {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    exports.clients.forEach(client => {
        let shouldSend = true;
        if (filter) {
            // Very basic filtering rules:
            if (filter.targetId && client.id !== filter.targetId) {
                shouldSend = false;
            }
            if (filter.branchId && client.branchId && client.branchId !== filter.branchId) {
                // If it's a branch specific notification and this client belongs to a *different* branch.
                // Note: Super admin client.branchId might be undefined, they see everything.
                shouldSend = false;
            }
        }
        if (shouldSend) {
            client.res.write(payload);
        }
    });
};
exports.broadcastNotification = broadcastNotification;
