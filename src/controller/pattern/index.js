export function unwrap(gift, properties = Object.keys(gift)) {
    for (const property of properties) {
        if (Object.hasOwnProperty.call(gift, property) && Object.hasOwnProperty.call(gift, property)) {
            return gift[property]
        }
    }
    throw gift
}


export function match(gift, args, properties = Object.keys(args)) {
    for (const property of properties) {
        if (Object.hasOwnProperty.call(gift, property) && Object.hasOwnProperty.call(args, property)) {
            return args[property](gift[property])
        }
    }
    throw gift;
}