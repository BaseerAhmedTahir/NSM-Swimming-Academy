/**
 * A simple singleton event emitter for cross-module communication.
 * Used to signal the root layout when the session expires so it can
 * navigate to /login without needing a React context in api.ts.
 */
type Listener = () => void;

const listeners: Set<Listener> = new Set();

export const sessionEvents = {
    onExpired: (cb: Listener) => {
        listeners.add(cb);
        return () => { listeners.delete(cb); }; // Returns void-returning unsubscribe fn
    },
    emit: () => {
        listeners.forEach(cb => cb());
    },
};
