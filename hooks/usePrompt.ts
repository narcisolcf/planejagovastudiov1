import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

/**
 * Hook to prompt the user before navigating away when there are unsaved changes.
 * @param message The message to show in the confirmation dialog.
 * @param when Boolean indicating if the prompt should be active (e.g., isDirty).
 */
export function usePrompt(message: string, when: boolean) {
    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            when && currentLocation.pathname !== nextLocation.pathname
    );

    useEffect(() => {
        if (blocker.state === "blocked") {
            const proceed = window.confirm(message);
            if (proceed) {
                blocker.proceed();
            } else {
                blocker.reset();
            }
        }
    }, [blocker, message]);
}
