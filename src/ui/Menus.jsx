import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";

const Menu = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

const StyledToggle = styled.button`
    background: none;
    border: none;
    padding: 0.4rem;
    border-radius: var(--border-radius-sm);
    transform: translateX(0.8rem);
    transition: all 0.2s;

    &:hover {
        background-color: var(--color-grey-100);
    }

    & svg {
        width: 2.4rem;
        height: 2.4rem;
        color: var(--color-grey-700);
    }
`;

const StyledList = styled.ul`
    position: fixed;

    background-color: var(--color-grey-0);
    box-shadow: var(--shadow-md);
    border-radius: var(--border-radius-md);

    right: ${(props) => props.position.x}px;
    top: ${(props) => props.position.y}px;
`;

const StyledButton = styled.button`
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 1.2rem 2.4rem;
    font-size: 1.4rem;
    transition: all 0.2s;

    display: flex;
    align-items: center;
    gap: 1.6rem;

    &:hover {
        background-color: var(--color-grey-50);
    }

    & svg {
        width: 1.6rem;
        height: 1.6rem;
        color: var(--color-grey-400);
        transition: all 0.3s;
    }
`;

const MenusContext = createContext();

function Menus({ children }) {
    const [openId, setIsOpenId] = useState("");
    const [position, setPosition] = useState(null);

    const close = () => setIsOpenId("");
    const open = setIsOpenId;

    return (
        <MenusContext.Provider
            value={{ openId, close, open, position, setPosition }}
        >
            {children}
        </MenusContext.Provider>
    );
}

function Toggle({ id }) {
    const { openId, close, open, setPosition } = useContext(MenusContext);

    function handleClick(evt) {
        evt.stopPropagation();
        // DOMRect object shows the dimensions and position of the button relative to the viewport.
        const rectangle = evt.target.closest("button").getBoundingClientRect();
        // console.log(rectangle);
        setPosition({
            x: window.innerWidth - rectangle.x - rectangle.width,
            y: rectangle.y + rectangle.height + 8,
        });

        // If no menu is opened or a different menu is opnened, then open this menu when clicked
        if (openId === "" || openId !== id) open(id);
        else close(); // Else if the same menu is opened then close it, when clicked
    }

    return (
        <StyledToggle onClick={handleClick}>
            <HiEllipsisVertical />
        </StyledToggle>
    );
}

function List({ id, children }) {
    const { openId, position, close } = useContext(MenusContext);
    const ref = useOutsideClick(close, false);

    if (openId !== id) return null;
    return createPortal(
        <StyledList ref={ref} position={position}>
            {children}
        </StyledList>,
        document.body
    );
}

function Button({ icon, onClick, children }) {
    const { close } = useContext(MenusContext);
    function handleClick() {
        onClick?.();
        close();
    }
    return (
        <li>
            <StyledButton onClick={handleClick}>
                {icon}
                <span>{children}</span>
            </StyledButton>
        </li>
    );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
