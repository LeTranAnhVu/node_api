function stringToNumber(num: string, delValue = 0): number {
    const parsedNum = Number(num.replace(/(,| )/g, ''))
    return isNaN(parsedNum) ? NaN : parsedNum
}

export default stringToNumber
