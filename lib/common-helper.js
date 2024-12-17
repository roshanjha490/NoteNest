
export async function fileToBase64(file) {
    return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result); // Resolve the Base64 string
        reader.onerror = (error) => reject(error);   // Reject if an error occurs
        reader.readAsDataURL(file);                  // Convert file to Base64
    });
};