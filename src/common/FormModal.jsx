import React, { useState } from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    Button,
    Input,
    Label,
    FormGroup,
    Spinner,
} from "reactstrap";
import FormServices from "../services/FormServices";
const LeadFormModal = ({ open, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Phone validation (optional but if provided, should be valid)
        if (formData.phone && !/^[\+]?[\d\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = "Please enter a valid phone number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

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
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    };

    // Add CSS animation styles to document head if not already added
    React.useEffect(() => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Call the API
            const response = await FormServices.designConsultant(formData);

            // Show success message
            showToast("Thank you! We'll get back to you soon.", 'success');

            // Call parent onSubmit if provided
            if (onSubmit) {
                onSubmit(formData);
            }

            // Reset form
            setFormData({
                name: "",
                phone: "",
                email: "",
            });

            // Close modal after a short delay
            setTimeout(() => {
                onClose();
            }, 1000);

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
    };

    return (
        <Modal isOpen={open} toggle={onClose} centered>
            <ModalHeader toggle={onClose}>Get a Callback</ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit}>
                    <div className="quote-input-box">
                        <FormGroup>
                            <Label for="name" style={{ color: "#001524" }}>
                                Name <span style={{ color: 'red' }}>*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter Name"
                                type="text"
                                invalid={!!errors.name}
                                disabled={isLoading}
                            />
                            {errors.name && (
                                <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                    {errors.name}
                                </div>
                            )}
                        </FormGroup>
                    </div>

                    <div className="quote-input-box">
                        <FormGroup>
                            <Label for="email" style={{ color: "#001524" }}>
                                Email <span style={{ color: 'red' }}>*</span>
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter Email"
                                type="email"
                                invalid={!!errors.email}
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                    {errors.email}
                                </div>
                            )}
                        </FormGroup>
                    </div>

                    <div className="quote-input-box">
                        <FormGroup>
                            <Label for="phone" style={{ color: "#001524" }}>
                                Phone <span style={{ color: '#6c757d', fontSize: '0.875rem' }}>(Optional)</span>
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter Phone Number"
                                type="tel"
                                invalid={!!errors.phone}
                                disabled={isLoading}
                            />
                            {errors.phone && (
                                <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                    {errors.phone}
                                </div>
                            )}
                        </FormGroup>
                    </div>

                    <div style={{ width: "100%" }}>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                background: isLoading ? "#6c757d" : "#001524",
                                color: "#fff",
                                width: "100%",
                                border: "none",
                                padding: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px"
                            }}
                        >
                            {isLoading && <Spinner size="sm" />}
                            {isLoading ? "Submitting..." : "Submit"}
                        </Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    );
};

export default React.memo(LeadFormModal);