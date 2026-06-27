import Razorpay from 'razorpay';

let razorpayInstance = null;

export const initializeRazorpay = () => {
    if (razorpayInstance) {
        return razorpayInstance;
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
        throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be defined in environment variables');
    }

    try {
        razorpayInstance = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });
        console.log('✓ Razorpay initialized successfully');
        return razorpayInstance;
    } catch (error) {
        console.error('✗ Failed to initialize Razorpay:', error.message);
        throw error;
    }
};

export const getRazorpay = () => {
    if (!razorpayInstance) {
        return initializeRazorpay();
    }
    return razorpayInstance;
};
