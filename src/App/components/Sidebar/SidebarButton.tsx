import {Button} from "../../shadcncomponents/Button";

interface SidebarButtonProps {
    Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
    display: string,
    onClick?(): void
}

function SideBarButton({Icon, display, onClick = undefined}: SidebarButtonProps): JSX.Element {
    return (
        <Button variant="transparent" onClick={onClick}>
            <Icon className="mr-[5px] size-icon text-primary" />
            {display}
        </Button>
    );
}

export default SideBarButton;
