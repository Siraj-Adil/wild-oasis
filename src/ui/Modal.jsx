import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";

const StyledModal = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--color-grey-0);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);
    padding: 3.2rem 4rem;
    transition: all 0.5s;
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: var(--backdrop-color);
    backdrop-filter: blur(4px);
    z-index: 1000;
    transition: all 0.5s;
`;

const Button = styled.button`
    background: none;
    border: none;
    padding: 0.4rem;
    border-radius: var(--border-radius-sm);
    transform: translateX(0.8rem);
    transition: all 0.2s;
    position: absolute;
    top: 1.2rem;
    right: 1.9rem;

    &:hover {
        background-color: var(--color-grey-100);
    }

    & svg {
        width: 2.4rem;
        height: 2.4rem;
        /* Sometimes we need both */
        /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
        color: var(--color-grey-500);
    }
`;

const ModalContext = createContext();

function Modal({ children }) {
    const [openName, setOpenName] = useState("");

    function close() {
        setOpenName("");
    }
    const open = setOpenName; // just renaming setOpenName, so "open" is a setter function

    return (
        <ModalContext.Provider value={{ openName, open, close }}>
            {children}
        </ModalContext.Provider>
    );
}

function Open({ opens: opensWindowName, children }) {
    const { open } = useContext(ModalContext);

    // cloneElement returns a React element based on the element ("children" in our case),
    // but with different props and children.
    // So in a way we are rendering "children" element here but with attaching our custom props
    // and other "children" to it if we want
    return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({ name, children }) {
    // We need to check if the name of window is same as currently opened / requested window
    // which we get from context, then only we will render it
    const { openName, close } = useContext(ModalContext);
    const ref = useOutsideClick(close, true);

    if (name !== openName) return null;

    // In create portal, we specified to place the below JSX as the child of "document.body"
    return createPortal(
        <Overlay>
            <StyledModal ref={ref}>
                <Button onClick={close}>
                    <HiXMark />
                </Button>
                {/* Render the children after injecting it with onCloseModal prop */}
                <div>{cloneElement(children, { onCloseModal: close })}</div>
            </StyledModal>
        </Overlay>,
        document.body
    );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
