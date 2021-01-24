const countDecimals = function (value) {
    var fValue = parseFloat(value);
    if (Math.floor(fValue) === fValue) return 0;
    return fValue.toString().split(".")[1].length || 0;
}

const stepperFloat = function (value, step) {
    var decimals = countDecimals(parseFloat(step));
    // calculate step
    var output = Math.round(parseFloat(value) * (1 / parseFloat(step))) / (1 / parseFloat(step));
    // fix decimals
    return parseFloat(output.toFixed(decimals));
}
const fixOutputFloat = function (value, decimals) {
    return parseFloat(value).toFixed(decimals);
}
const stringToBoolean = function (val) {
    if (val === null) {
        return false;
    }
    if (typeof val === "number") {
        return Boolean(val);
    }
    if (typeof val !== "string") {
        return val;
    }
    switch (val.toLowerCase().trim()) {
        case "on":
        case "true":
        case "yes":
        case "1":
            return true;
        case "off":
        case "false":
        case "no":
        case "0":
        case null:
            return false;
        default:
            return Boolean(val);
    }
}

export { countDecimals, stepperFloat, fixOutputFloat, stringToBoolean };