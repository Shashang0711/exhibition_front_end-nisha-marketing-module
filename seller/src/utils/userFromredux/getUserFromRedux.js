function getUserFromRedux(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return str;
    }
}

export {
    getUserFromRedux
}