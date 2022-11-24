exports.do_Null_Undefined_EmptyArray_Check = async (value) => {
    if (value === null || value === "null" || value === undefined || value === "undefined" || value.length === 0 || value === "") {
        return null;
    } else {
        return value;
    }
}
exports.getDifferenceInMinutes = async (dt2, dt1) => {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}