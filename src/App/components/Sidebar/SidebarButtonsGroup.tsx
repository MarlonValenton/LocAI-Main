function SidebarButtonGroup({children}: {children: JSX.Element[]}): JSX.Element {
    return <div className="[&>*:not(:last-child)]:mb-[10px] px-[8px] pb-[8px]">{children}</div>;
}

export default SidebarButtonGroup;
