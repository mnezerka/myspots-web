export function roundNumber(num, dec) {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

export function formatPos(pos) {
    if (!pos) {
        return ''
    }

    return `${roundNumber(pos[0], 7)}N, ${roundNumber(pos[1], 7)}E`
}