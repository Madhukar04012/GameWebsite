import { useEffect, useRef } from "react";
/**
 * Hook that tracks keyboard state for player input.
 * Returns a ref to the current InputState (stable reference, updated by event listeners).
 */
export function useInputManager() {
    const inputRef = useRef({
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false,
        sprint: false,
    });
    useEffect(() => {
        const pressed = new Set();
        function handleKey(e) {
            const key = e.key === " " ? "space" : e.key.toLowerCase();
            if (e.type === "keydown") {
                pressed.add(key);
            }
            else {
                pressed.delete(key);
            }
            const s = inputRef.current;
            s.forward = pressed.has("w");
            s.backward = pressed.has("s");
            s.left = pressed.has("a");
            s.right = pressed.has("d");
            s.sprint = pressed.has("shift");
            s.jump = pressed.has("space");
        }
        window.addEventListener("keydown", handleKey);
        window.addEventListener("keyup", handleKey);
        return () => {
            window.removeEventListener("keydown", handleKey);
            window.removeEventListener("keyup", handleKey);
        };
    }, []);
    return inputRef;
}
//# sourceMappingURL=InputManager.js.map