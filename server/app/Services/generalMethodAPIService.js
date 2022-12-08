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
exports.getPagination = async (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};
exports.getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: pagingData } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, pagingData, totalPages, currentPage };
};
exports.csvToArray=(csv)=>{
    const array = csv.split(',');
    return array
}