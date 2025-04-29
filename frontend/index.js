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
    
    // Simulate API call (replace with actual API call in production)
    simulateTrackingLookup(trackingNumber, resultsContainer);
  });
  
  function simulateTrackingLookup(trackingNumber, container) {
    // Show loading state
    container.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Looking up your fund details...</p>
      </div>
    `;
    container.style.display = 'block';
    
    // Simulate network delay
    setTimeout(() => {
      // This is mock data - replace with actual API response
      const mockData = {
        status: 'Active',
        fundName: 'Global Growth Fund',
        amount: '$12,450.00',
        lastUpdated: new Date().toLocaleDateString(),
        transactions: [
          { date: '2023-05-15', description: 'Monthly Contribution', amount: '+$500.00' },
          { date: '2023-04-28', description: 'Dividend Payment', amount: '+$120.50' },
          { date: '2023-04-15', description: 'Monthly Contribution', amount: '+$500.00' }
        ]
      };
      
      displayTrackingResults(mockData, container);
    }, 1500);
  }
  
  function displayTrackingResults(data, container) {
    container.innerHTML = `
      <div class="results-header">
        <h3>Fund Tracking Results</h3>
        <p class="tracking-id">Tracking Number: <span>${document.getElementById('trackingNumber').value}</span></p>
      </div>
      
      <div class="fund-status">
        <div class="status-card">
          <h4>Fund Status</h4>
          <p class="status-badge ${data.status.toLowerCase()}">${data.status}</p>
        </div>
        
        <div class="status-card">
          <h4>Fund Name</h4>
          <p>${data.fundName}</p>
        </div>
        
        <div class="status-card">
          <h4>Current Value</h4>
          <p class="amount">${data.amount}</p>
        </div>
        
        <div class="status-card">
          <h4>Last Updated</h4>
          <p>${data.lastUpdated}</p>
        </div>
      </div>
      
      <div class="transactions">
        <h4>Recent Transactions</h4>
        <div class="transactions-list">
          ${data.transactions.map(t => `
            <div class="transaction-item">
              <div class="transaction-date">${t.date}</div>
              <div class="transaction-desc">${t.description}</div>
              <div class="transaction-amount ${t.amount.startsWith('+') ? 'credit' : 'debit'}">${t.amount}</div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="results-footer">
        <button class="print-btn">Print Statement</button>
        <button class="share-btn">Share Results</button>
      </div>
    `;
    
    // Add some additional styles for the results
    const style = document.createElement('style');
    style.textContent = `
      .results-header {
        margin-bottom: 2rem;
        border-bottom: 1px solid #eee;
        padding-bottom: 1rem;
      }
      
      .results-header h3 {
        color: #2c3e50;
        margin-bottom: 0.5rem;
      }
      
      .tracking-id {
        color: #7f8c8d;
      }
      
      .tracking-id span {
        color: #2c3e50;
        font-weight: 600;
      }
      
      .fund-status {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }
      
      .status-card {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 8px;
      }
      
      .status-card h4 {
        color: #7f8c8d;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
      }
      
      .status-card p {
        color: #2c3e50;
        font-size: 1.1rem;
        font-weight: 500;
      }
      
      .status-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;
      }
      
      .status-badge.active {
        background: #e8f5e9;
        color: #2e7d32;
      }
      
      .amount {
        font-size: 1.4rem !important;
        font-weight: 700 !important;
        color: #e74c3c !important;
      }
      
      .transactions h4 {
        margin-bottom: 1rem;
        color: #2c3e50;
      }
      
      .transactions-list {
        border: 1px solid #eee;
        border-radius: 8px;
        overflow: hidden;
      }
      
      .transaction-item {
        display: grid;
        grid-template-columns: 1fr 2fr 1fr;
        padding: 1rem;
        align-items: center;
        border-bottom: 1px solid #eee;
      }
      
      .transaction-item:last-child {
        border-bottom: none;
      }
      
      .transaction-date {
        color: #7f8c8d;
        font-size: 0.9rem;
      }
      
      .transaction-desc {
        color: #2c3e50;
      }
      
      .transaction-amount {
        text-align: right;
        font-weight: 600;
      }
      
      .credit {
        color: #2e7d32;
      }
      
      .debit {
        color: #c62828;
      }
      
      .results-footer {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
        justify-content: flex-end;
      }
      
      .print-btn, .share-btn {
        padding: 10px 20px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .print-btn {
        background: white;
        border: 1px solid #ddd;
        color: #2c3e50;
      }
      
      .print-btn:hover {
        background: #f5f5f5;
      }
      
      .share-btn {
        background: #2c3e50;
        border: 1px solid #2c3e50;
        color: white;
      }
      
      .share-btn:hover {
        background: #1a252f;
      }
      
      .error-message {
        text-align: center;
        padding: 2rem;
        color: #c62828;
      }
      
      .error-message svg {
        width: 40px;
        height: 40px;
        margin-bottom: 1rem;
      }
      
      .error-message h3 {
        margin-bottom: 0.5rem;
      }
      
      .loading-state {
        text-align: center;
        padding: 2rem;
      }
      
      .spinner {
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        border-top: 4px solid #e74c3c;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    container.appendChild(style);
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