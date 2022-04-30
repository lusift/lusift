const getStepUID = ({ guideID, index, type }): string => {
    return `lusift--g-${guideID}--${type}-${index}`;
};
export default getStepUID;
