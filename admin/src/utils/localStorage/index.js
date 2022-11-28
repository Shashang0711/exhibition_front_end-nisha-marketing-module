const checkJSON = (data) => {
    try {
        const jsonData =  JSON.parse(data);
        return jsonData;
    } catch (error) {
        return false;
    }
}

export {
    checkJSON
};
