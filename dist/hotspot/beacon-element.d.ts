export declare function div(): HTMLDivElement;
export declare const positionBeacon: (beaconElement: HTMLDivElement, targetPosition: any, beaconPlacement: {
    top: number;
    left: number;
}) => void;
export declare const createBeaconElement: ({ beaconData, beaconID, toggleTooltip }: {
    beaconData: any;
    beaconID: any;
    toggleTooltip: any;
}) => HTMLDivElement;
