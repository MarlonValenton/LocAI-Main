function QuickSettings({children}: { children?: JSX.Element[] | JSX.Element }): JSX.Element {
    return (
        <>
            <div className="flex flex-row items-center justify-center w-[500px] bg-foreground h-[40px] rounded-[5px] [&>*:not(:last-child)]:mr-5">
                {children}
            </div>
        </>
    );
}

export default QuickSettings;
