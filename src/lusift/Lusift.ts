import Guide from "./Guide";
import { saveState, loadState, setDefaultState } from "../common/store";
import { log, error, warn } from "../common/logger";
import { doesStepMatchDisplayCriteria, startStepInstance } from "../common/utils";

import { window, document } from "global";

import { GuideType, Content, TrackingState } from "../common/types";

import { isOfTypeContent, isObject } from "../common/utils/isOfType";

import addDefaultCSS from "./addDefaultCSS";

// TODO: Write documentation

// TODO: refactor Guide and Lusift
// TODO: Accessing Lusift with window.Lusift, is there a better way?
// TODO: decide on making configuring easier, with inheritence, global levels, etc.
// -- Maybe don't have setContent take everything, seperate concerns. makes documenting easier too
// NOTE_: Support for different typescript versions
// TODO_: add support for angul*r
// TODO: Buggy when the target for tooltip is sidebar link
// TODO: Tooltip positioning for different screen sizes
// -- how do the comercial saas handle it? automatically or end-user config?
// -- have the options for orientation be `auto` and `fixed` with positions being the different axis relative to
// the target. With auto, the position is only picked when there is space for the tooltip, else it moves to different position
// NOTE: Handling versioning
// TODO: lodash.isequal is 9.4kb! Replace it with something lighter
// -- https://www.google.com/search?q=check+if+2+objects+are+equal+javascript
// TODO: Can we just export element classes (Tooltip, Modal, Hotspot, Backdrop) and have them be optionally loadable by the client?
// -- something like how modifiers work in popperjs

const noOp = () => {}; // no-op function

class Lusift {
    private content: Content | undefined;
    public render: Function = noOp;
    public activeGuide: {
        instance: any;
        id: string;
    } | null = null;
    public progress: number = 0;

    private next: Function = noOp;
    private prev: Function = noOp;
    private close: Function = noOp;
    private goto: Function = noOp;
    private onNext: Function | undefined;
    private onPrev: Function | undefined;
    private onClose: Function | undefined;

    constructor() {
        log("%c Lusift constructor! ", "background: #222; color: #bada55");

        const localData = loadState();
        // set default state
        if (!isObject(localData)) {
            setDefaultState();
        }
        addDefaultCSS();
    }

    private showEnabledContent(): void {
        const localData = loadState();
        const enabledGuideID = Object.keys(localData).find(key => {
            const { trackingState } = localData[key];
            if(trackingState){
                return trackingState.enabled
            }
            return false;
        });
        if (enabledGuideID) {
            this.showContent(enabledGuideID);
        } else {
            return warn(`No content enabled.`)
        }
    }

    private doesGuideExist(guideID: string): boolean {
        let localData = this.content!;
        return Object.keys(localData)
            .some(key => key === guideID);
    }

    public enable(guideID: string): void {
        let localData = loadState();
        if(!this.doesGuideExist(guideID)) {
            return error(`Content of id '${guideID}' doesn't exist`);
        }

        // enable content of id $guideID, disable all else
        Object.keys(localData).forEach(key => {
            const { trackingState } = localData[key];
            if(trackingState){
                localData[key].trackingState.enabled = key === guideID;
            }
        });
        saveState(localData);
        this.showContent(guideID);
    }

    public disable(guideID: string): void {
        let localData = loadState();
        if(!this.doesGuideExist(guideID)) {
            return error(`Content of id '${guideID}' doesn't exist`);
        }
        localData[guideID].trackingState.enabled = false;
        saveState(localData);
    }

    public setContent(content: Content): void {
        // filter and validate content
        if (!isOfTypeContent(content)) {
            return error("Content data type is invalid");
        }

        // retrieve approriate properties from received content
        this.content = content;
        Object.keys(content).forEach(key => {
            const {
                id,
                name = "",
                description = "",
                steps,
                onNext,
                onPrev,
                onClose,
                doNotResetTrackerOnContentChange = false,
            } = content[key].data;

            this.content![key].data = {
                id,
                name,
                description,
                steps,
                onNext,
                onPrev,
                onClose,
                doNotResetTrackerOnContentChange,
            };
        });

        let contentIDExists: boolean;

        if (this.activeGuide) {
            contentIDExists = Object.keys(this.content).includes(this.activeGuide.id);
        }

        // for any already active guide
        if (this.activeGuide) {
            // if the contentID doesn't exist at all in the new content received
            if (!contentIDExists!) {
                this.activeGuide.instance.removeAllActiveSteps();
                this.activeGuide = null;
            }
        }
    }

    public clearContent(): void {
        setDefaultState();
        this.content = loadState();
    }

    public refresh(): void {
        // run page elements through step display conditionals again
        if (this.activeGuide) {
            this.activeGuide!.instance.start();
            log("Lusift refreshed");
        } else {
            warn("No active guide instance to refresh");
            // Assuming this method is called every time on page load.
            // Better than running in constructor which runs on import of Lusift
            this.showEnabledContent();
        }
    }

    public showContent<T extends string>(contentID: T extends "" ? never : T): void {
        // Forces specific Lusift content to appear for the current user by passing in the ID.
        if (!this.content) {
            return error(`Content not set, pass valid content data to setContent()`);
        }
        // see if content exists for contentID
        if (!this.content[contentID]) {
            return error(`Content with id of ${contentID} doesn't exist`);
        }
        // when there's an active guide
        if (this.activeGuide) {
            const { instance, id } = this.activeGuide;

            if (id === contentID) {
                this.activeGuide.instance.reRenderStepElements();
                return error(`${contentID} is already active`);
            } else {
                instance.close();
            }
        }

        const newGuideInstance = new Guide(contentID);
        this.activeGuide = {
            id: contentID,
            instance: newGuideInstance,
        };
        newGuideInstance.start();
        this.prepareHooks();
    }

    private prepareHooks(): void {
        // attach active content's navigation methods, and hooks to Lusift instance
        const { instance: activeGuideInstance, id: activeGuideID } = this.activeGuide!;
        this.next = activeGuideInstance.nextStep.bind(activeGuideInstance);
        this.prev = activeGuideInstance.prevStep.bind(activeGuideInstance);
        this.close = activeGuideInstance.close.bind(activeGuideInstance);
        this.goto = activeGuideInstance.setStep.bind(activeGuideInstance);

        const { onNext, onPrev, onClose } = this.content![activeGuideID].data;
        this.onNext = onNext;
        this.onPrev = onPrev;
        this.onClose = onClose;
    }

    public setGlobalStyle(styleText: string): void {
        if (typeof styleText !== "string") {
            return error("Invalid style passed to setGlobalStyle()");
        }
        let customStyle = document.querySelector("style[lusift-custom-css]");
        if (!customStyle) {
            return error(`Style tag for custom-css not found. Report to Lusift\'s github.`);
        }
        customStyle.textContent = styleText;
    }

    public getTrackingState(): TrackingState | null {
        if (this.activeGuide) {
            return loadState()[this.activeGuide.id].trackingState;
        } else {
            warn("No active guide");
            return null;
        }
    }

    public devShowStep(guideID: string, stepNumber: number): void {
        // dev mode: to be used to develop/style step elements
        // if there is some other content active already, refuse to show dev mode
        if (this.activeGuide) {
            return warn(
                `Can\'t enable dev mode because a ` + `guide is active using showContent()`,
            );
        }
        if (!this.content) {
            return warn(
                `Content not set, pass valid content object ` +
                    `to setContent() before running devShowStep()`,
            );
        }
        this.next =
            this.prev =
            this.close =
            this.showContent =
                function () {
                    error(`Can't run this method in dev mode`);
                };

        if (this.content[guideID]) {
            const { steps } = this.content[guideID].data;
            const { target, type } = steps[stepNumber];

            if (!doesStepMatchDisplayCriteria({ target, type })) {
                return warn(
                    `Display criteria for step do not match. Navigate to ` +
                        `the right target page and make sure that the target ` +
                        `element is in the visible screen, then reload page.`,
                );
            }

            if (steps[stepNumber]) {
                startStepInstance(steps[stepNumber], guideID);
                log(
                    `%c Showing step ${stepNumber} of ${guideID} in dev mode`,
                    "background: #222; color: #bada55",
                );
            } else {
                error(`Guide '${guideID}' doesn't have a step ${stepNumber}`);
            }
        } else {
            error(`Guide with id '${guideID}' doesn't exist`);
        }
    }
}

export default new Lusift();
