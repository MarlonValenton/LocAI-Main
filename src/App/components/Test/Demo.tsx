/// <reference types="vite-plugin-svgr/client" />

import {useState} from "react";
import Plus from "../../../icons/bolt.svg?react";
import Send from "../../../icons/send.svg?react";
import {Separator} from "../../shadcncomponents/Separator";
import {Input} from "../../shadcncomponents/Input";
import {Button} from "../../shadcncomponents/Button";

function Demo(): JSX.Element {
    const [isDarkMode, setDarkMode] = useState(false);

    !isDarkMode
        ? document.querySelector("html")?.classList.remove("dark")
        : document.querySelector("html")?.classList.add("dark");

    return (
        <>
            <div className="flex flex-row m-2 [&>*]:mr-2">
                <div className="flex flex-col [&>*]:mb-1 items-left border border-black w-fit">
                    <div className="flex flex-row [&>*]:mr-1">
                        <div className="flex flex-col [&>*]:mb-1 [&>*]:w-[200px] items-center">
                            <Button>Primary Button</Button>
                            <Button variant="demo_hover">Primary Button - Hover</Button>
                            <Button variant="demo_pressed">Primary Button - Pressed</Button>
                            <Button disabled>Primary Button Disabled</Button>
                        </div>
                        <div className="flex flex-col [&>*]:mb-1 [&>*]:w-[200px] items-center">
                            <Button variant="outline">Primary Button</Button>
                            <Button variant="demo_outline_hover">Primary Button - Hover</Button>
                            <Button variant="demo_outline_pressed">Primary Button - Pressed</Button>
                            <Button variant="outline" disabled>
                Primary Button Disabled
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-row [&>*]:mr-1">
                        <div className="flex flex-col [&>*]:mb-1 [&>*]:w-[200px] items-center">
                            <Button variant="positive">Positive Button</Button>
                            <Button variant="demo_positive_hover">Positive Button - Hover</Button>
                            <Button variant="demo_positive_pressed">Positive Button - Pressed</Button>
                            <Button variant="positive" disabled>
                Primary Positive Disabled
                            </Button>
                        </div>
                        <div className="flex flex-col [&>*]:mb-1 [&>*]:w-[200px] items-center">
                            <Button variant="positive_outline">Positive Button</Button>
                            <Button variant="demo_positive_outline_hover">Positive Button - Hover</Button>
                            <Button variant="demo_positive_outline_pressed">Positive Button - Pressed</Button>
                            <Button variant="positive_outline" disabled>
                Positive Button Disabled
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-row [&>*]:mr-1">
                        <div className="flex flex-col [&>*]:mb-1 [&>*]:w-[200px] items-center">
                            <Button variant="negative">Negative Button</Button>
                            <Button variant="demo_negative_hover">Negative Button - Hover</Button>
                            <Button variant="demo_negative_pressed">Negative Button - Pressed</Button>
                            <Button variant="negative" disabled>
                Negative Button Disabled
                            </Button>
                        </div>
                        <div className="flex flex-col [&>*]:mb-1 [&>*]:w-[200px] items-center">
                            <Button variant="negative_outline">Negative Button</Button>
                            <Button variant="demo_negative_outline_hover">Negative Button - Hover</Button>
                            <Button variant="demo_negative_outline_pressed">Negative Button - Pressed</Button>
                            <Button variant="negative_outline" disabled>
                Negative Button Disabled
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-row [&>*]:mr-1">
                        <div className="flex flex-col [&>*]:mb-1 [&>*]:w-[200px] items-center">
                            <Button variant="transparent">Transp. Button</Button>
                            <Button variant="demo_transparent_hover">Transp. Button - Hover</Button>
                            <Button variant="demo_transparent_pressed">Transp. Button - Pressed</Button>
                            <Button variant="transparent" disabled>
                Transp. Button Disabled
                            </Button>
                        </div>
                        {/* <div className="flex flex-col [&>*]:mb-1 [&>*]:w-[200px] items-center">
            <Button variant="gray">Gray Button</Button>
            <Button variant="demo_gray_hover">Gray Button - Hover</Button>
            <Button variant="demo_gray_pressed">Gray Button - Pressed</Button>
            <Button variant="gray" disabled>
              Gray Button Disabled
            </Button>
          </div> */}
                    </div>
                </div>
                <div className="[&>*]:mb-5">
                    <Input placeholder="Input..." />
                    <Input placeholder="Input with Icons" startIcon={Plus} endIcon={Send} />
                    <Separator />
                    <Input variant="solid" placeholder="Input..." />
                    <Input variant="solid" placeholder="Input with Icons" startIcon={Plus} endIcon={Send} />
                </div>
            </div>
            <Button onClick={() => setDarkMode((isDarkMode) => !isDarkMode)}>Switch Theme</Button>
        </>
    );
}

export default Demo;
