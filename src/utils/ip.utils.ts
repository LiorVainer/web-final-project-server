import os from 'os';
import axios from 'axios';

export const getCurrentIpAddress = () => {
    const networkInterfaces = os.networkInterfaces();

    for (const interfaceName in networkInterfaces) {
        const addresses = networkInterfaces[interfaceName];

        if (!addresses) {
            continue;
        }

        for (const address of addresses) {
            // Check for IPv4 and exclude internal (127.0.0.1) addresses
            if (address.family === 'IPv4' && !address.internal) {
                return address.address;
            }
        }
    }

    return 'IP address not found';
};

export const getPublicIpAddress = async () => {
    try {
        const response = await axios.get<{ ip: string }>('https://api.ipify.org?format=json');
        return response.data.ip; // Public IP address
    } catch (error) {
        console.error('Error fetching public IP:', error);
        return 'Unable to fetch public IP';
    }
};
