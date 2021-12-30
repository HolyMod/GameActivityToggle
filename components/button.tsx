import {Settings, Webpack} from "@Holy";
import {useMemo} from "react";
import GamePad from "./icons/gamepad";

const [
    PanelButton,
    {ShowCurrentGame} = {} as any,
    SoundModule
] = Webpack.bulk(
    "PanelButton",
    ["ShowCurrentGame"],
    ["playSound"]
);

export default function GameActivityToggleButton() {
    const showGameActivity = ShowCurrentGame.useSetting();
    const tooltipText = useMemo(() => `Turn ${showGameActivity ? "off" : "on"} game activity`, [showGameActivity]);
    
    const handleClick = function () {
        ShowCurrentGame.updateSetting(!showGameActivity);

        if (Settings.get("playSound", true)) SoundModule.playSound(!showGameActivity ? "unmute" : "mute");
    };

    return (
        <PanelButton
            icon={() => <GamePad enabled={showGameActivity} />}
            onClick={handleClick}
            tooltipText={tooltipText}
            innerClassName="GAT-disabled"
        />
    );
};