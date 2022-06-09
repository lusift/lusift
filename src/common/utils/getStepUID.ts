export type UIDElementType = 'tooltip' | 'hotspot' | 'modal' | 'backdrop' | 'beacon';

const getStepUID = (
    { guideID, index, type }: { guideID: string; index: number; type: UIDElementType }
): string => {
    return `lusift--g-${guideID}--${type}-${index}`;
};
export default getStepUID;
