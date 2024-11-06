import {Button} from "../../shadcncomponents/Button";

interface QuickSettingsItemProps {
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
    onClick?(...args: any): void
}

function QuickSettingsItem({icon, onClick}: QuickSettingsItemProps): JSX.Element {
    const Icon = icon;
    return (
        <Button size="icon_tight" variant="transparent_full" onClick={onClick}>
            <Icon className="size-icon text-primary" />
        </Button>
    );
}

export default QuickSettingsItem;
