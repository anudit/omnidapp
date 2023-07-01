export const trimmed = (str: string, start = 6, end = 4) => {
    return str.slice(0, start) + '...' + str.slice(str.length - end, str.length);
}