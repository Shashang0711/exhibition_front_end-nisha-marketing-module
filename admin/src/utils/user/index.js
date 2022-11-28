import { checkJSON } from "../localStorage";

const isAdmin = () => {
    const user = checkJSON(localStorage.getItem('user'));
    if(user && (user.role === "Admin" || user.role === "admin")) {
        return true;
    }
    return false;
}

const isSeller = () => {
    const user = checkJSON(localStorage.getItem('user'));
    if(user && (user.role === 'Seller' || user.role === 'seller')) {
        return true;
    }
    return false;
}

const isAdminAsSeller = () => {
    const user = checkJSON(localStorage.getItem('user'));
    const sellerId = localStorage.getItem('sellerId');
    if(sellerId && user && (user.role === 'Admin' || user.role === 'admin')) {
        return true;
    }
    return false;
}

export {
    isAdmin,
    isSeller,
    isAdminAsSeller
};
