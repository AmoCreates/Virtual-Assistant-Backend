import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({path: './.env'});

const testGeminiAPI = async () => {
    const apiUrl = process.env.GEMINI_API_URL;
    const apiKey = process.env.GEMINI_API_KEY;
    
    console.log('Testing API with:');
    console.log('URL:', apiUrl);
    console.log('Key:', apiKey ? apiKey.substring(0, 10) + '...' : 'NO KEY');
    
    try {
        const response = await axios.post(`${apiUrl}?key=${apiKey}`, {
            contents: [{
                parts: [{ text: "Hello" }]
            }]
        });
        console.log('✓ Success! Response:', response.data);
    } catch (error) {
        console.error('✗ Error:', error.response?.status, error.response?.data);
    }
};

testGeminiAPI();
