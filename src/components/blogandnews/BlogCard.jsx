import React from 'react'
import { Link } from 'react-router-dom'
import { Col } from 'reactstrap'
import config from '../../../config'
import moment from 'moment/moment'
import parse from 'html-react-parser'

const BlogCard = ({ blog }) => {
    
    return (
        <Col key={blog.id} md="12" lg="4" className="mb-4">
            <div className="blog-card">
                <div className="blog-card-image">
                    {blog?.cover_image ? (
                        <img className='img-fluid' alt={blog.title} src={blog.cover_image.startsWith('http') ? blog.cover_image : config.apiUrl + "/" + blog.cover_image} />
                    ) : (
                        <div className="blog-placeholder-img" style={{ height: '200px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: '#999' }}>DIYPREFAB Blog</span>
                        </div>
                    )}
                </div>
                <div className='blog-card-content'>
                    <div className="blog-card-header">
                        <h2 className="blog-title">{blog.title}</h2>
                        <p className="blog-date">{blog.published_at && moment(blog.published_at).format("lll")}</p>
                    </div>
                    <div className="blog-card-body">
                        <p className="blog-excerpt">{blog.content && parse(blog.content.substring(0, 200) + '...')}</p>
                    </div>
                    <div className="blog-card-footer">
                        <Link to={"/blog/" + blog.slug} className="read-more-link">Read More</Link>
                    </div>
                </div>

            </div>
        </Col>
    )
}

export default BlogCard