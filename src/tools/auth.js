
const isAuthenticated = (cookies, key) => {
    cookies.getCookies(key);
};


export default {
    isAuthenticated
}