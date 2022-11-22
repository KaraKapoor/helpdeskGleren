class CommonUtils {

    splitStringFromCharacter(string, splitChar, isBothStringRequired) {
        const inputString = string;
        const modifiedtring = inputString.split(splitChar);
        if (isBothStringRequired) {
            return modifiedtring;
        } else {
            return modifiedtring[0];
        }
    }
    
    do_Null_Undefined_EmptyArray_Check(value){
        if (value === null || value === "null" || value === undefined || value === "undefined" || value.length === 0 || value === "") {
            return null;
          } else {
            return value;
          }
    }
}
export default new CommonUtils();