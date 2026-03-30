import { Request, Response } from 'express';

// Keeps track of active connections
export const clients: { id: string; branchId?: string; role: string; res: Response }[] = [];

export const addClient = (req: Request, res: Response, id: string, branchId: string | undefined, role: string) => {
    clients.push({ id, branchId, role, res });
    
    // Heartbeat to keep connection alive
    const intervalId = setInterval(() => {
        res.write(':\n\n'); // SSE Comment/heartbeat
    }, 15000);

    // Remove client when connection drops
    req.on('close', () => {
        clearInterval(intervalId);
        removeClient(id);
    });
};

export const removeClient = (id: string) => {
    const index = clients.findIndex(c => c.id === id);
    if (index !== -1) {
        clients.splice(index, 1);
    }
};

export const broadcastNotification = (data: any, filter?: { branchId?: string, targetId?: string, sendTo?: string }) => {
    const payload = `data: ${JSON.stringify(data)}\n\n`;

    clients.forEach(client => {
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
