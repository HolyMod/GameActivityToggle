import {DOM, Injector as InjectorModule, ReactTools, Settings, Utilities, Webpack} from "@Holy";
import config from "./manifest.json";
import styles from "./components/button.scss";
import GameActivityToggleButton from "./components/button";

const Injector = InjectorModule.create(config.name);

export default class GameActivityToggle {
    onStart(): void {
        DOM.injectCSS(config.name, styles);
        this.patchAccount();

        Settings.mount();
    }

    async patchAccount() {
        const accountClasses = Webpack.findByProps("container", "godlike", "nameTag");

        const Account = await Utilities.waitUntil(() => {
            const node = document.getElementsByClassName(accountClasses.container)[0];
            if (!node) return;

            return ReactTools.getOwnerInstance(node);
        });

        if (!Account) return;

        Injector.inject({
            module: Account.constructor.prototype,
            method: "render",
            after(_, __, res) {
                const buttons = ReactTools.findInReactTree(res, e => Array.isArray(e?.children) && !e.onMouseEnter)?.children;
                if (!Array.isArray(buttons) || buttons.some(child => child?.type === GameActivityToggleButton)) return;

                buttons.unshift(
                    <GameActivityToggleButton />
                );
            }
        });

        Account.forceUpdate();
    }

    onStop(): void {
        Injector.uninject();
        DOM.clearCSS(config.name);
        Settings.unmount();
    }
}