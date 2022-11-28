const toInitials = str => {
    return str
        .split(" ")
        .map(c => c.charAt(0).toUpperCase())
        .join("")
        .concat(str.charAt(1).toUpperCase())
        .substring(0, 2);

}
export {
    toInitials
}