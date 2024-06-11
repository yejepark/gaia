export function debounce(callback, wait) {
    let timeoutId = null;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback(...args);
        }, wait);
    };
}

export function arrayRange(start, stop, step) {
    return Array.from(
        { length: (stop - start) / step + 1 },
        (value, index) => start + index * step
    );
}

export function intToUnitStr(num) {
    let value = parseInt(num);
    let numDigit = value.toString().length;

    let uckValue = 0;
    let manValue = 0;
    if (numDigit > 8) {
        uckValue = Math.floor(value / 10**8);
        value = value % 10**8;
    }

    if (numDigit > 4) {
        manValue = Math.floor(value / 10**4);
        value = value % 10**4;
    }

    let unitStr = '';

    if (uckValue > 0) {
        unitStr += uckValue.toString() + '억';
    }

    if (manValue > 0) {
        unitStr += manValue.toString() + '만';
    }

    if (!unitStr) {
        unitStr = '0';
    }

    return unitStr;
}