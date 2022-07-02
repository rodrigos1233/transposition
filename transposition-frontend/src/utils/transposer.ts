export function transposer(
    originNote: number,
    originKey: number,
    targetKey: number
) {
    let keyDifference = originKey - targetKey

    let targetNote = originNote + keyDifference

    if (targetNote > 11) {
        targetNote = targetNote - 12
    }

    if (targetNote < 0) {
        targetNote = targetNote + 12
    }

    return targetNote
}
