import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaGoogle, FaApple, FaTimes, FaEnvelope, FaChevronDown, FaUser } from 'react-icons/fa';
import './AuthPage.css';

const AuthPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine initial mode based on path
    const isInitialLogin = location.pathname === '/login';
    const [isLogin, setIsLogin] = useState(isInitialLogin);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { authAPI } = await import('../utils/api');
            let data;

            if (isLogin) {
                data = await authAPI.login(formData.email, formData.password);
            } else {
                const fullName = `${formData.firstName} ${formData.lastName}`;
                data = await authAPI.register(fullName, formData.email, formData.password);
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-v2">
            {/* Abstract Background Glows */}
            <div className="bg-glow blue"></div>
            <div className="bg-glow purple"></div>
            <div className="bg-glow accent"></div>

            <div className="auth-card-v2 glass-card-v2">
                {/* Close Button */}
                <button className="close-btn" onClick={() => navigate('/')}>
                    <FaTimes />
                </button>

                {/* Mode Toggle */}
                <div className="mode-toggle">
                    <button
                        className={`toggle-btn ${!isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Sign up
                    </button>
                    <button
                        className={`toggle-btn ${isLogin ? 'active' : ''}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Sign in
                    </button>
                </div>

                <h1 className="auth-title">
                    {isLogin ? 'Welcome back' : 'Create an account'}
                </h1>

                <form className="auth-form-v2" onSubmit={handleSubmit}>
                    {error && <div className="error-msg">{error}</div>}

                    {!isLogin && (
                        <div className="input-row">
                            <div className="input-field">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required={!isLogin}
                                />
                            </div>
                            <div className="input-field">
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required={!isLogin}
                                />
                            </div>
                        </div>
                    )}

                    <div className="input-field">
                        <FaEnvelope className="field-icon" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="input-field phone-field">
                            <div className="country-selector">
                                <span className="flag">🇺🇸</span>
                                <FaChevronDown size={10} />
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="(775) 351-6501"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    <div className="input-field">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Create an account')}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>OR SIGN IN WITH</span>
                </div>

                <div className="social-btns">
                    <button className="social-btn">
                        <FaGoogle className="google-icon" />
                    </button>
                    <button className="social-btn">
                        <FaApple className="apple-icon" />
                    </button>
                </div>

                <p className="auth-terms">
                    By creating an account, you agree to our <a href="#">Terms & Service</a>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
