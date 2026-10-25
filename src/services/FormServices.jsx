import axios from "axios";
import config from "../../config";

const FormServices = {};


FormServices.inquiryForm = (formdata) => {
    return axios.post(`${config.apiUrl}/api/inquiry`, formdata);
};


FormServices.designConsultant = (formdata) => {
    return axios.post(`${config.apiUrl}/api/design-consultant`, formdata);
};
FormServices.contact = (formdata) => {
    return axios.post(`${config.apiUrl}/api/contact`, formdata);
};


export default FormServices;
