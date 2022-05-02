import Guide from "./Guide";
import { saveState, loadState } from "../common/store";
import { log, error, warn } from "../common/logger";
import isEqual from "lodash.isequal";
import { doesStepMatchDisplayCriteria, startStepInstance } from "../common/utils";

import { window, document } from "global";

import { GuideType, Content, TrackingState } from "../common/types";

import { isOfTypeContent, isObject } from "../common/utils/isOfType";

import addDefaultCSS from "./addDefaultCSS";

// TODO: Write documentation

// TODO: decide on making configuring easier, with inheritence, global levels, etc.
// -- Maybe don't have setContent take everything, seperate concerns. makes documenting easier too
// TODO: minor stuff:
// -- what is popperjs preventOverflow
// TODO_: add support for angul*r
// TODO: Buggy when the target for tooltip is sidebar link
// TODO: Reference react-modal package
// TODO: Tooltip positioning for different screen sizes
// TODO: Add type declarations for vue-demi imports
// -- how do the comercial saas handle it? automatically or end-user config?
// TODO: Why do libraries have cjs, esm, and umd bundles?
// TODO: Use different state for devShowStep (lusift_dev_state)
// NOTE: Handling versioning
// NOTE: resize observer doesn't work with svg elements
// TODO: Can we just export element classes (Tooltip, Modal, Hotspot, Backdrop) and have them be optionally loadable by the client?
// TODO: Look into more lightweight solutions for tippyjs/popperjs
// TODO: Fix all the type bugs
// -- nanopop
// NOTE: How are peerDependencies handled when the script is loaded from cdn or something?

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
        // if loadState() type is not object,
        if (!isObject(localData)) {
            saveState({});
        }
        addDefaultCSS();
    }

    private hasGuideDataChanged(guideData: GuideType): boolean {
        const localData = loadState();
        if (!localData[guideData.id]) return true;
        const localGuideData = localData[guideData.id];
        delete localGuideData.trackingState;
        const guideDataWithoutHooks = { ...guideData };
        delete guideDataWithoutHooks.onNext;
        delete guideDataWithoutHooks.onClose;
        delete guideDataWithoutHooks.onPrev;
        return !isEqual(localGuideData, guideDataWithoutHooks);
    }

    private reconcileContentWithLocalState(): void {
        // Look through each content item,
        // --clear tracking data if item data has changed, and if doNotResetTrackerOnContentChange is false
        // --conserve otherwise
        let stateToSave = {};
        let contentWithoutBodyContent = JSON.parse(JSON.stringify(this.content));

        Object.keys(this.content!).forEach(key => {
            const {
                id,
                name = "",
                description = "",
                steps,
                onNext,
                onPrev,
                onClose,
                doNotResetTrackerOnContentChange = false,
            } = contentWithoutBodyContent[key].data;

            // remove bodyContent from steps
            let stepsWithoutBodyContent = steps.map(step => {
                if (step.type === "tooltip" || step.type === "modal") {
                    delete step.data.bodyContent;
                } else if (step.type === "hotspot") {
                    delete step.tip.data.bodyContent;
                }
                return step;
            });

            contentWithoutBodyContent[key].data = {
                id,
                name,
                description,
                steps: stepsWithoutBodyContent,
                onNext,
                onPrev,
                onClose,
                doNotResetTrackerOnContentChange,
            };
        });

        Object.keys(contentWithoutBodyContent).forEach(key => {
            if (contentWithoutBodyContent[key].type === "guide") {
                const guideData = contentWithoutBodyContent[key].data; //prolly a guide
                if (
                    this.hasGuideDataChanged(guideData) &&
                    !guideData.doNotResetTrackerOnContentChange
                ) {
                    log(`guide with id '${key}' changed, tracking state reset.`);
                    // clear tracking data
                    stateToSave[guideData.id] = guideData;
                } else {
                    const localGuideData = loadState()[guideData.id];
                    stateToSave[guideData.id] = localGuideData;
                }
            }
        });
        saveState(stateToSave);
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

        let dataOfActiveGuideChanged: boolean;
        let contentIDExists: boolean;

        if (this.activeGuide) {
            dataOfActiveGuideChanged = this.hasGuideDataChanged(
                this.content[this.activeGuide.id].data,
            );
            contentIDExists = Object.keys(this.content).includes(this.activeGuide.id);
        }

        // iterate through each content item to note changes and conditionally preserve trackingState
        // and then save to localStorage
        this.reconcileContentWithLocalState();
        //content has been set to local

        // for any already active guide
        if (this.activeGuide) {
            // if the contentID doesn't exist at all in the new content received, or
            // if contentID exists but data has changed
            if (!contentIDExists! || (contentIDExists && dataOfActiveGuideChanged!)) {
                this.activeGuide.instance.removeAllActiveSteps();
                this.activeGuide = null;
            }
        }
    }

    public clearContent(): void {
        saveState({});
        this.content = {};
    }

    public refresh(): void {
        // run page elements through step display conditionals again
        if (this.activeGuide) {
            window.setTimeout(() => {
                this.activeGuide!.instance.start();
                log("Lusift refreshed");
                // log('%c page refresh ', 'background: #222; color: #bada55');
            }, 0);
        } else {
            warn("No active guide instance to refresh");
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

        window.setTimeout(() => {
            // HACK:
            // There's a noticeable delay in react component appearing as bodyContent properties
            // on page load, so we arbitrarily wait 500ms before running this section
            const newGuideInstance = new Guide(contentID);
            this.activeGuide = {
                id: contentID,
                instance: newGuideInstance,
            };
            newGuideInstance.start();
            this.prepareHooks();
        }, 500);
    }

    private prepareHooks(): void {
        // attach active content's navigation methods to Lusift instance
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
        if (typeof this.activeGuide) {
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
