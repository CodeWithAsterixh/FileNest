export async function copyToClipBoard(content) {
    // Modern clipboard API
    if (navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(content);
            return true;  // Text was successfully copied
        } catch (error) {
            console.error('Failed to copy text with Clipboard API:', error.message || error);
            return false; // Failed to copy text
        }
    } 
    // Fallback to older method
    else {
        const textarea = document.createElement('textarea');
        textarea.value = content;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);
            
            return successful;
        } catch (error) {
            console.error('Failed to copy text with execCommand:', error.message || error);
            document.body.removeChild(textarea);
            return false; // Failed to copy text
        }
    }
}
