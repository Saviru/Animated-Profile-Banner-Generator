document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.getElementById('profile-form');
    const usernameInput = document.getElementById('input-username');
    const fullnameInput = document.getElementById('input-fullname');
    const descriptionInput = document.getElementById('input-description');
    const animateCheckbox = document.getElementById('animate-profile');
    
    // Get SVG image element
    const profileSvgImg = document.getElementById('profile-svg');
    
    // Reset button and generate button
    const resetButton = document.getElementById('reset-form');
    const generateButton = document.getElementById('generate-button');
    
    // Download button
    const downloadButton = document.getElementById('download-svg');
    
    // Result container
    const resultContainer = document.getElementById('result-container');
    const resultPreview = document.getElementById('result-preview');
    
    // Default values
    const defaults = {
        username: 'Saviru',
        fullname: 'Saviru Kashmira Atapattu',
        description: 'Developer | Tech Explorer | Designer',
        animate: false
    };
    
    
    // Function to show notification
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '12px 24px';
        notification.style.borderRadius = '8px';
        notification.style.zIndex = '1000';
        notification.style.backgroundColor = type === 'success' ? 'rgba(63, 185, 80, 0.9)' : 
                                            type === 'error' ? 'rgba(248, 81, 73, 0.9)' :
                                            'rgba(88, 166, 255, 0.9)';
        notification.style.color = 'white';
        notification.style.backdropFilter = 'blur(10px)';
        notification.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        notification.style.border = '1px solid rgba(48, 54, 61, 0.5)';
        notification.style.transform = 'translateY(20px)';
        notification.style.opacity = '0';
        notification.style.transition = 'all 0.3s ease';
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Initialize the form with default values
    usernameInput.value = defaults.username;
    fullnameInput.value = defaults.fullname;
    descriptionInput.value = defaults.description;
    animateCheckbox.checked = defaults.animate;
    
    // Variable to track current SVG content and blob URL
    let currentSvgContent = null;
    let currentBlobUrl = null;
    
    // Generate button click handler
    generateButton.addEventListener('click', function() {
        // Show loading state
        generateButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
        generateButton.disabled = true;
        
        // Fetch the profileBanner.svg file
        fetch('profileBanner.svg')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Could not load profileBanner.svg');
                }
                return response.text();
            })
            .then(svgContent => {
                // Get form values
                const username = usernameInput.value || defaults.username;
                const fullname = fullnameInput.value || defaults.fullname;
                const description = descriptionInput.value || defaults.description;
                
                // Create a modified version of the SVG with user data
                let modifiedSvg = svgContent;
                
                // Replace the actual text content in the SVG
                // Replace the username in the command prompt
                //modifiedSvg = modifiedSvg.replace(/saviru@github/g, username.toLowerCase() + '@github');
                //modifiedSvg = modifiedSvg.replace(/GET profile Saviru --verbose/g, `GET profile ${username} --verbose`);
                //modifiedSvg = modifiedSvg.replace(/Loading Saviru's profile\.\.\./g, `Loading ${username}'s profile...`);
                modifiedSvg = modifiedSvg.replace(/{UsernameCMD}/g, username.toLowerCase());
                modifiedSvg = modifiedSvg.replace(/{Username}/g, username);
                
                
                // Replace the full name (appears twice in the SVG)
                modifiedSvg = modifiedSvg.replace(/{Fullname}/g, fullname);
                
                // Replace the description/tagline
                modifiedSvg = modifiedSvg.replace(/{Tagline}/g, description);
                
                // Store the modified SVG content
                currentSvgContent = modifiedSvg;
                
                // Display the result
                resultPreview.innerHTML = modifiedSvg;
                resultContainer.classList.remove('hidden');
                
                // Scroll to result
                resultContainer.scrollIntoView({ behavior: 'smooth' });
                
                // Show success notification
                showNotification('Profile banner generated successfully!', 'success');
                
                // Reset button state
                generateButton.innerHTML = '<i class="fa-regular fa-image fa-beat"></i> Generate Preview';
                generateButton.disabled = false;
            })
            .catch(error => {
                console.error('Error loading SVG:', error);
                showNotification('Error loading profile banner: ' + error.message, 'error');
                
                // Reset button state
                generateButton.innerHTML = '<i class="fa-regular fa-image fa-beat"></i> Generate Preview';
                generateButton.disabled = false;
            });
    });
    
    // Download button click handler
    downloadButton.addEventListener('click', function() {
        if (!currentSvgContent) {
            showNotification('Please generate a profile banner first!', 'error');
            return;
        }
        
        try {
            // Clean up previous blob URL
            if (currentBlobUrl) {
                URL.revokeObjectURL(currentBlobUrl);
            }
            
            // Create blob from SVG content
            const blob = new Blob([currentSvgContent], { type: 'image/svg+xml' });
            currentBlobUrl = URL.createObjectURL(blob);
            
            // Get username for filename
            const username = usernameInput.value || defaults.username;
            const filename = `${username}-profile-banner.svg`;
            
            // Create download link and trigger download
            const downloadLink = document.createElement('a');
            downloadLink.href = currentBlobUrl;
            downloadLink.download = filename;
            downloadLink.style.display = 'none';
            
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            showNotification(`Downloaded ${filename} successfully!`, 'success');
        } catch (error) {
            console.error('Download error:', error);
            showNotification('Error downloading file: ' + error.message, 'error');
        }
    });
    
    // Clean up blob URLs when page unloads
    window.addEventListener('beforeunload', function() {
        if (currentBlobUrl) {
            URL.revokeObjectURL(currentBlobUrl);
        }
    });
});