export function isValidUrl(urlString: string): boolean {
    try {
        new URL(urlString);
        return true;
    } catch {
        return false;
    }
}

export function validateYearForPath(year?: string): boolean {
    return !!year && /^\d{4}$/.test(year);
}

export function validateMonthForPath(month?: string): boolean {
    return !!month && /^(0[1-9]|1[0-2])$/.test(month);
}

export function validateDayForPath(day?: string): boolean {
    return !!day &&/^(0[1-9]|[12]\d|3[01])$/.test(day);
}

export function validateYearMonthDayForPath(year?: string, month?: string, day?: string): boolean {
    return validateYearForPath(year) && validateMonthForPath(month) && validateDayForPath(day)
}
