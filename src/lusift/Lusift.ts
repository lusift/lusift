import Guide from "./Guide";
import { saveState, loadState, setDefaultState } from "../common/store";
import { log, error, warn } from "../common/logger";
import { doesStepMatchDisplayCriteria } from "../common/utils";
import startStepInstance from './startStepInstance';
import mergeContentWithDefaults from './defaults';

import { window, document } from "global";

import { Content, LocalState, ActiveGuide, DeepPartial } from "../common/types";
import { ContentDefaults, InputContent } from './types';

import { isOfTypeContent, isObject } from "../common/utils/isOfType";

import addDefaultCSS from "./addDefaultCSS";

// NOTE: Stop refactoring
// TODO: Add support for react 18

// TODO_: add support for angul*r

const noOp = () => {}; // no-op function

const devNavMethod = () => {
    error(`Can't run this method in dev mode`);
}

class Lusift {
    private content: Content = {};
    public render: (body: any, targetPath: string, callback?: Function) => void = noOp;
    private activeGuide: ActiveGuide | null = null;
    private isDevMode: boolean = false;
    private navigationMethods = {
        next: noOp,
        prev: noOp,
        close: noOp,
        goto: (x: number) => {},
    }

    constructor() {
        log("%c Lusift constructor! ", "background: #222; color: #bada55");

        const localData = loadState();
        // set default state
        if (!isObject(localData)) {
            setDefaultState();
        }
        addDefaultCSS(); // this line adds css to the header
    }

    public next(): void {
        return this.navigationMethods.next();
    }

    public prev(): void {
        return this.navigationMethods.prev();
    }

    public goto(newStepNum: number): void {
        return this.navigationMethods.goto(newStepNum);
    }

    public close(): void {
        this.navigationMethods.close();
    }

    private showEnabledContent(): void {
        const localData = loadState();
        const enabledGuideID = Object.keys(localData).find(key => {
            const { trackingState } = localData[key];
            if(trackingState){
                return trackingState.enabled;
            }
            return false;
        });
        if (enabledGuideID) {
            this.showContent(enabledGuideID);
        } else {
            return warn(`No content enabled.`);
        }
    }

    public getActiveGuide(): ActiveGuide | null {
        if (!this.activeGuide) return null;
        const { instance, id } = this.activeGuide;
        const {
            guideData,
            getTrackingState,
            getActiveSteps,
            getProgress,
            reRenderStepElements,
            resetTrackingState
        } = instance;

        return {
            id,
            instance: {
                guideData,
                getTrackingState,
                getProgress,
                getActiveSteps,
                reRenderStepElements,
                resetTrackingState
            }
        };
    }

    private doesGuideExist(guideID: string): boolean {
        return Object.keys(this.getContent()!)
        .some(key => key === guideID);
    }

    public enable(guideID: string, toRefresh?: boolean): void {
        let localData = this.getTrackingState();
        if(!this.doesGuideExist(guideID)) {
            return error(`Content with id '${guideID}' doesn't exist`);
        }

        // enable content with id $guideID, disable all else
        Object.keys(localData).forEach(key => {
            const { trackingState } = localData[key];
            if(trackingState){
                localData[key].trackingState.enabled = key === guideID;
            }
        });
        saveState(localData);
        if (toRefresh) {
            this.refresh();
        }
    }

    public disable(guideID: string, toRemove?: boolean): void {
        let localData = loadState();
        if(!this.doesGuideExist(guideID)) {
            return error(`Content of id '${guideID}' doesn't exist`);
        }
        localData[guideID].trackingState.enabled = false;
        saveState(localData);
    }

    public setContent(content: InputContent, defaults?: DeepPartial<ContentDefaults>): void {
        /* console.log('passed to setContent:')
        console.log(content); */
        const mergedWithDefaultsContent = mergeContentWithDefaults(content, defaults);
        /* console.log('merged with defaults:')
        console.log(mergedWithDefaultsContent) */

        // validate content
        if (!isOfTypeContent(mergedWithDefaultsContent)) {
            return error("Content data type is invalid");
        }
        this.content = mergedWithDefaultsContent;

        // for any already active guide
        if (this.activeGuide) {
            const contentIDExists = this.doesGuideExist(this.activeGuide.id);
            // if the contentID doesn't exist at all in the new content received
            if (!contentIDExists!) {
                this.activeGuide.instance.removeAllActiveSteps!();
                this.activeGuide = null;
            }
        }
    }

    public getContent(): Content {
        return this.content;
    }

    public resetTrackingState() {
        setDefaultState();
    }

    public refresh(): void {
        // run page elements through step display conditionals again
        if (this.activeGuide) {
            const enabled = this.activeGuide.instance.getTrackingState().enabled;
            if (enabled) {
                this.activeGuide!.instance.start!();
                log("Lusift refreshed");
            }
        } else {
            warn("No active guide instance to refresh");
            // Assuming this method is called every time on page load.
            // Better than running in constructor which runs on import of Lusift
            this.showEnabledContent();
        }
    }

    public showContent<T extends string>(contentID: T extends "" ? never : T): void {
        // Forces specific Lusift content to appear for the current user by passing in the ID.

        if (this.isDevMode){
            return devNavMethod();
        }
        this.isDevMode = false;
        const content = this.getContent();

        if (Object.keys(content).length === 0) {
            return error(`Content not set, pass valid content data to setContent()`);
        }
        // see if content exists for contentID
        if (!this.doesGuideExist(contentID)) {
            return error(`Content with id of ${contentID} doesn't exist`);
        }
        // when there's an active guide already
        if (this.activeGuide) {
            const { instance, id } = this.activeGuide;

            if (id === contentID) {
                this.activeGuide.instance.reRenderStepElements();
                return error(`${contentID} is already active`);
            } else {
                return this.close();
            }
        }

        // See if contentID, if in trackingState, isn't closed
        // if it is, don't instantiate it
        const guideTrackingState = loadState()[contentID]?.trackingState;
        if(guideTrackingState?.finished || guideTrackingState?.prematurelyClosed) {
            // even if the guide has been closed, unless it's disabled, we want it to still
            // instantiate to check for any open async steps
            if(!guideTrackingState?.enabled) {
                return warn(`Guide '${contentID}' is closed.`);
            }
        }
        const newGuideInstance = new Guide(contentID);
        this.enable(contentID);

        const {
            nextStep,
            prevStep,
            setStep,
            remove,
            getTrackingState,
            reRenderStepElements,
            start,
            getActiveSteps,
            getProgress,
            removeAllActiveSteps,
            resetTrackingState,
            guideData
        } = newGuideInstance;

        this.activeGuide = {
            id: contentID,
            instance: {
                guideData,
                getTrackingState: getTrackingState.bind(newGuideInstance),
                getProgress: getProgress.bind(newGuideInstance),
                getActiveSteps: getActiveSteps.bind(newGuideInstance),
                reRenderStepElements: reRenderStepElements.bind(newGuideInstance),
                resetTrackingState: resetTrackingState.bind(newGuideInstance),
                removeAllActiveSteps: removeAllActiveSteps.bind(newGuideInstance),
                start: start.bind(newGuideInstance)
            }
        };
        newGuideInstance.start();

        // attach active content's navigation methods, and hooks to Lusift instance
        const activeGuideID = this.activeGuide!.id;

        const close = () => {
            if (this.activeGuide) {
                remove.bind(newGuideInstance)();
                this.disable(activeGuideID);
                typeof this.onClose === "function" && this.onClose();
                this.activeGuide = null;
                log(`Closed ${activeGuideID}`);
            } else {
                return error(`No active guide to close`);
            }
        }

        this.navigationMethods = {
            next: nextStep.bind(newGuideInstance),
            prev: prevStep.bind(newGuideInstance),
            goto: setStep.bind(newGuideInstance),
            close,
        }
    }
    public onNext(): void {
        const activeGuideID = this.activeGuide!.id;
        if (activeGuideID){
            return this.content[activeGuideID].data.onNext!();
        }
    }

    public onPrev(): void {
        const activeGuideID = this.activeGuide!.id;
        if (activeGuideID){
            return this.content[activeGuideID].data.onPrev!();
        }
    }

    public onClose(): void {
        const activeGuideID = this.activeGuide!.id;
        if (activeGuideID){
            return this.content[activeGuideID].data.onClose!();
        }
    }

    public setGlobalStyle(styleText: string): void {
        let customStyle = document.querySelector("style[lusift-custom-css]");
        customStyle.textContent = styleText;
    }

    public getTrackingState(): LocalState {
        return loadState();
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
        this.navigationMethods = {
            next: devNavMethod,
            prev: devNavMethod,
            goto: devNavMethod,
            close: devNavMethod,
        };
        this.isDevMode = true;

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
                startStepInstance(
                    steps[stepNumber],
                    guideID,
                    () => {}
                );
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

export default Lusift;
