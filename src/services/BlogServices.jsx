import axios from "axios";
import config from "../../config";
import staticBlogs from "../data/staticBlogs";

const BlogServices = {};

BlogServices.blogList = (query) => {
    return new Promise((resolve, reject) => {
        axios.get(`${config.apiUrl}/api/blogs${query}`)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                // API failed — return static blog data formatted as the frontend expects
                const formattedResponse = {
                    data: {
                        status: true,
                        data: staticBlogs,
                        pagination: {
                            total: staticBlogs.length,
                            per_page: 10,
                            current_page: 1,
                            total_pages: 1
                        }
                    }
                };
                resolve(formattedResponse);
            });
    });
};

BlogServices.blogBySlug = (params) => {
    return new Promise((resolve, reject) => {
        if (!params?.slug) {
            return resolve({ data: { status: false, message: "No slug provided" } });
        }
        
        axios.get(`${config.apiUrl}/api/blog/${params.slug}`)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                // API failed — find static blog by slug
                const blog = staticBlogs.find(b => b.slug === params.slug);
                if (blog) {
                    resolve({
                        data: {
                            status: true,
                            data: blog
                        }
                    });
                } else {
                    resolve({
                        data: {
                            status: false,
                            message: "Blog not found"
                        }
                    });
                }
            });
    });
};

export default BlogServices;
