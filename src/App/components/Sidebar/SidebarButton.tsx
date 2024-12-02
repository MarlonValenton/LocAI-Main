import {forwardRef} from "react";
import {Button} from "../../shadcncomponents/Button";
interface SidebarButtonProps {
    Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
    display: string,
    onClick?(): void
}

const SideBarButton = forwardRef(function SideBarButton({Icon, display, onClick = undefined}: SidebarButtonProps, ref) {
    return (
        <Button variant="transparent" onClick={onClick}>
            <Icon className="mr-[5px] size-icon text-primary" />
            {display}
        </Button>
    );
});

export default SideBarButton;
