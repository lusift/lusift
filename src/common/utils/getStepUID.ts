const getStepUID = ({ guideID, index, type }) => {
    return `lusift--g-${guideID}--${type}-${index}`;
}
export default getStepUID;
