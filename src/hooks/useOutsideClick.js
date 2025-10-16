import { useEffect, useRef } from "react";

export function useOutsideClick(handler, listenCapturing = true) {
    const ref = useRef();
    useEffect(
        function () {
            function handleClick(evt) {
                // console.log("Clicked on document", evt.target, ref.current);

                // if ref exist ie window is opened and target click is not inside of "ref" (window)
                // ie clicked outside
                if (ref.current && !ref.current.contains(evt.target)) {
                    handler();
                }
            }
            // 3rd arguement is "useCapture" = true / false
            // false (by default), event triggered during bubbling phase
            // true, event triggered during capturing phase

            // if "useCapture" is true, then "ref.current" will be undefined as event
            // handler is triggered during capturing phase, ie before modal window is added to DOM
            // so below "if" condition will be false

            // The trick is to capture event & trigger its handler before modal window is added to DOM
            // so that "ref.current" is undefined at that time and model window will be rendered
            // otherwise if event is capured during bubbling phase then "ref.current" will not be undefined
            // so below "if" condition  will become true and this will cause modal window to be rendered
            // for split second and then close itself.
            // GROUND TRUTH: Adding Cabin / Show Table button is OUTSIDE of modal window
            document.addEventListener("click", handleClick, listenCapturing);
            // cleanup function
            return () =>
                document.removeEventListener(
                    "click",
                    handleClick,
                    listenCapturing
                );
        },
        [ref, handler, listenCapturing]
    );
    return ref;
}
