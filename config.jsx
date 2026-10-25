const apiUrl = import.meta.env.VITE_APP_API_URL;
const localStorageUserDetails = import.meta.env.VITE_SECURE_LOCAL_STORAGE_USER_KEY;
const localStorageUserToken = import.meta.env.VITE_SECURE_LOCAL_STORAGE_TOKEN_KEY;
const localStorageUserPermission = import.meta.env.VITE_SECURE_LOCAL_STORAGE_PERMISSION_KEY;
const domainFrontend = import.meta.env.VITE_DOMAIN_FRONTEND;

const config = {
    apiUrl: apiUrl,
    localStorageUserToken: localStorageUserToken,
    localStorageUserDetails: localStorageUserDetails,
    localStorageUserPermission: localStorageUserPermission,
    domainFrontend: domainFrontend,
};
export default config;
