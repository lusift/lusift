export declare type UIDElementType = 'tooltip' | 'hotspot' | 'modal' | 'backdrop' | 'beacon';
declare const getStepUID: ({ guideID, index, type }: {
    guideID: string;
    index: number;
    type: UIDElementType;
}) => string;
export default getStepUID;
