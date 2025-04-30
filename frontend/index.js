// Hamburger menu toggle
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.menu-toggle');
  
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('open');
  }
  
//tracking

// Tracking form functionality
document.getElementById('fundTrackingForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const trackingNumber = document.getElementById('trackingNumber').value;
  const resultsContainer = document.getElementById('trackingResults');
  
  // Clear previous results
  resultsContainer.innerHTML = '';
  
  // Validate tracking number format (12 alphanumeric characters)
  if (!/^[A-Za-z0-9]{12}$/.test(trackingNumber)) {
    resultsContainer.innerHTML = `
      <div class="error-message">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <h3>Invalid Tracking Number</h3>
        <p>Please enter a valid 12-digit alphanumeric tracking number.</p>
      </div>
    `;
    resultsContainer.style.display = 'block';
    return;
  }
  
  // Call the real API function
  fetchTrackingDetails(trackingNumber, resultsContainer);
});
  
  async function fetchTrackingDetails(trackingNumber, container) {
    // Show loading state
    container.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Looking up your transaction details...</p>
      </div>
    `;
    container.style.display = 'block';
  
    try {
      const response = await fetch(`/api/transactions/${trackingNumber}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Transaction not found');
      }
  
      const transaction = await response.json();
      displayRealTrackingResults(transaction, container);
    } catch (err) {
      container.innerHTML = `
        <div class="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <h3>Transaction Lookup Failed</h3>
          <p>${err.message}</p>
        </div>
      `;
    }
  }
  
  function displayRealTrackingResults(transaction, container) {
    const lastUpdate = transaction.statusUpdates[transaction.statusUpdates.length - 1];
    const statusClass = lastUpdate.stage.toLowerCase().replace(' ', '-');
    
    container.innerHTML = `
      <div class="results-header">
        <h3>Transaction Details</h3>
        <p class="tracking-id">Tracking Number: <span>${transaction.trackingNumber}</span></p>
      </div>
      
      <div class="status-grid">
        <div class="status-card">
          <h4>Recipient Name</h4>
          <p>${transaction.personName}</p>
        </div>
        
        <div class="status-card">
          <h4>Amount</h4>
          <p class="amount">$${transaction.amount.toFixed(2)}</p>
        </div>
        
        <div class="status-card">
          <h4>Paying Company</h4>
          <p>${transaction.company}</p>
        </div>
        
        <div class="status-card">
          <h4>Current Status</h4>
          <p class="status-badge ${statusClass}">${lastUpdate.stage}</p>
        </div>
      </div>
      
      <div class="status-history">
        <h4>Status History</h4>
        <div class="timeline">
          ${transaction.statusUpdates.map(update => {
            const updateClass = update.stage.toLowerCase().replace(' ', '-');
            return `
              <div class="update-item">
                <div class="update-date">${new Date(update.updatedAt).toLocaleString()}</div>
                <div class="update-stage">
                  <span class="status-badge ${updateClass}">${update.stage}</span>
                </div>
                <div class="update-message">${update.message || 'No additional message provided'}</div>
              </div>
            `;
          }).reverse().join('')}
        </div>
      </div>
    `;
    
    container.style.display = 'block';
  }
  
  // FAQ accordion functionality
document.querySelectorAll('.faq-list details').forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (detail.open) {
        document.querySelectorAll('.faq-list details').forEach(otherDetail => {
          if (otherDetail !== detail && otherDetail.open) {
            otherDetail.open = false;
          }
        });
      }
    });
  });
  
  // Form submission handling
  document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Here you would normally send the data to your server
    console.log('Form submitted:', { name, email, subject, message });
    
    // Show success message (in a real app, you'd want to handle errors too)
    alert(`Thanks for your message, ${name}! We'll get back to you soon.`);
    
    // Reset form
    this.reset();
  });

  // Testimonial Slider (Optional)
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');

function showTestimonial(index) {
  testimonials.forEach((testimonial, i) => {
    testimonial.style.display = i === index ? 'block' : 'none';
  });
}

// Uncomment below if you want automatic sliding
setInterval(() => {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  showTestimonial(currentTestimonial);
}, 5000);

// Initialize
showTestimonial(0);