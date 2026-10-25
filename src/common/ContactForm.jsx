import React, { useState, useCallback, useEffect } from 'react';
import { Button, Col, Row, Spinner } from 'reactstrap';
import FormServices from '../services/FormServices';
// Import your FormServices
// import { FormServices } from '../services/FormServices';

const ContactForm = () => {
    // State to hold form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        interest_of_services: '',
    });

    // State for error messages
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        message: '',
        interest_of_services: '',
    });

    // Loading state
    const [isLoading, setIsLoading] = useState(false);

    // Simple toast notification function
    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.textContent = message;

        // Toast styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            font-weight: 500;
            max-width: 350px;
            animation: slideIn 0.3s ease-out;
            line-height: 1.4;
        `;

        document.body.appendChild(toast);

        // Remove toast after 4 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 4000);
    };

    // Add CSS animation styles to document head if not already added
    useEffect(() => {
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    // Handle form input changes with useCallback to memoize the function
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [errors]);

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Interest validation
        if (!formData.interest_of_services.trim()) {
            newErrors.interest_of_services = 'Interest of service is required';
        } else if (formData.interest_of_services.trim().length < 3) {
            newErrors.interest_of_services = 'Please specify your interest_of_services (at least 3 characters)';
        }

        // Message validation
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submit with useCallback to memoize the function
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showToast('Please correct the errors above', 'error');
            return;
        }

        setIsLoading(true);

        try {
            // Call the API
            const response = await FormServices.inquiryForm(formData);

            // Show success message
            showToast('Thank you for your inquiry! We\'ll get back to you soon.', 'success');

            // Reset form
            setFormData({
                name: '',
                email: '',
                message: '',
                interest_of_services: '',
            });

            console.log('Inquiry form submitted successfully:', response.data);

        } catch (error) {
            console.error('Form submission error:', error);

            if (error.response?.status === 429) {
                const errorData = error.response.data;

                if (errorData.code === "FORM_RATE_LIMIT_EXCEEDED" ||
                    errorData.code === "CONTACT_RATE_LIMIT_EXCEEDED") {

                    // Use toast but with longer duration and special styling
                    showToast(`${errorData.error} Please wait ${errorData.retryAfter}.`, 'warning', {
                        duration: 8000, // Show for 8 seconds
                        persistent: true // Don't auto-hide
                    });
                    return;
                }
            }

            // Handle other errors
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Something went wrong. Please try again.";
            showToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [formData]);

    const renderError = (fieldName) => {
        if (errors[fieldName]) {
            return (
                <span className="error" style={{
                    color: '#dc3545',
                    fontSize: '0.875rem',
                    display: 'block',
                    marginTop: '0.25rem',
                    fontWeight: '400'
                }}>
                    {errors[fieldName]}
                </span>
            );
        }
        return null;
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        marginTop: '5px',
        outline: 'none',
        transition: 'border-color 0.2s ease',
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '5px',
        fontWeight: '500',
        // color: '#333',
    };

    const formGroupStyle = {
        marginBottom: '20px',
    };

    return (
        <div className="contact-form">
            <h2>Send us a message</h2>
            <p>If you have any questions or would like to book a session please contact us.</p>
            <form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>
                                Name <span >*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                style={{
                                    ...inputStyle,
                                    borderColor: errors.name ? '#dc3545' : '#ddd',
                                    opacity: isLoading ? 0.7 : 1,
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                                onBlur={(e) => e.target.style.borderColor = errors.name ? '#dc3545' : '#ddd'}
                            />
                            {renderError('name')}
                        </div>
                    </Col>
                    <Col md={6}>
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>
                                Email <span >*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                style={{
                                    ...inputStyle,
                                    borderColor: errors.email ? '#dc3545' : '#ddd',
                                    opacity: isLoading ? 0.7 : 1,
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                                onBlur={(e) => e.target.style.borderColor = errors.email ? '#dc3545' : '#ddd'}
                            />
                            {renderError('email')}
                        </div>
                    </Col>
                    <Col md={12}>
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>
                                Interest of Service <span >*</span>
                            </label>
                            <input
                                type="text"
                                name="interest_of_services"
                                value={formData.interest_of_services}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                placeholder="e.g., Interior Design, Architecture, Consultation..."
                                style={{
                                    ...inputStyle,
                                    borderColor: errors.interest_of_services ? '#dc3545' : '#ddd',
                                    opacity: isLoading ? 0.7 : 1,
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                                onBlur={(e) => e.target.style.borderColor = errors.interest_of_services ? '#dc3545' : '#ddd'}
                            />
                            {renderError('interest_of_services')}
                        </div>
                    </Col>
                    <Col md={12}>
                        <div style={formGroupStyle}>
                            <label style={labelStyle}>
                                Message <span >*</span>
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                rows={4}
                                placeholder="Tell us more about your project or requirements..."
                                style={{
                                    ...inputStyle,
                                    borderColor: errors.message ? '#dc3545' : '#ddd',
                                    opacity: isLoading ? 0.7 : 1,
                                    resize: 'vertical',
                                    minHeight: '100px',
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                                onBlur={(e) => e.target.style.borderColor = errors.message ? '#dc3545' : '#ddd'}
                            />
                            {renderError('message')}
                        </div>
                    </Col>
                </Row>

                <div>
                    <Button
                        type="submit"
                        className="btn common-btn"
                        disabled={isLoading}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            opacity: isLoading ? 0.7 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            minWidth: '140px',
                        }}
                    >
                        {isLoading && <Spinner size="sm" />}
                        {isLoading ? 'Sending...' : 'Send Message'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default React.memo(ContactForm);