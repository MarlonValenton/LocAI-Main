interface SideBarProps {
    children?: JSX.Element | JSX.Element[]
}

function Sidebar({children}: SideBarProps): JSX.Element {
    return <div className="flex flex-col w-[260px] [&>*:not(:last-child)]:mb-[12px] bg-foreground h-screen flex-none">{children}</div>;
}

export default Sidebar;
