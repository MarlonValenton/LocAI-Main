function SidebarButtonGroup({children}: { children: JSX.Element[] }): JSX.Element {
    return <div className="[&>*:not(:last-child)]:mb-[10px]">{children}</div>;
}

export default SidebarButtonGroup;
