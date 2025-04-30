
// Transaction Registration
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const statusElement = document.getElementById('registerStatus');
  
  try {
    const transactionData = {
      trackingNumber: document.getElementById('trackingNumber').value,
      personName: document.getElementById('personName').value,
      amount: parseFloat(document.getElementById('amount').value),
      company: document.getElementById('company').value
    };

    const response = await fetch('https://smart-tracker-zwnd.onrender.com/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify(transactionData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const result = await response.json();
    statusElement.textContent = `Success! Transaction registered: ${result.trackingNumber}`;
    statusElement.style.color = 'green';
    
    // Clear form
    e.target.reset();
    
  } catch (err) {
    statusElement.textContent = `Error: ${err.message}`;
    statusElement.style.color = 'red';
    console.error('Registration error:', err);
  }

  console.log('Attempting to register:', {
    trackingNumber: document.getElementById('trackingNumber').value,
    personName: document.getElementById('personName').value,
    amount: document.getElementById('amount').value,
    company: document.getElementById('company').value
  });

});


// Search Transaction
document.getElementById('searchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const trackingNumber = document.getElementById('searchTrackingNumber').value;
  const detailsElement = document.getElementById('transactionDetails');
  const historyList = document.getElementById('historyList');
  const updateForm = document.getElementById('updateForm');
  
  try {
    const response = await fetch(`https://smart-tracker-zwnd.onrender.com/api/transactions/${trackingNumber}`);
    if (!response.ok) throw new Error('Transaction not found');
    
    const transaction = await response.json();
    
    // Display transaction details
    detailsElement.classList.remove('hidden');
    historyList.innerHTML = transaction.statusUpdates.map(update => `
      <div class="status-update">
        <strong>${update.stage.toUpperCase()}</strong>
        <small>${new Date(update.updatedAt).toLocaleString()}</small>
        <p>${update.message || 'No message provided'}</p>
      </div>
    `).join('');
    
    // Set up update form
    updateForm.classList.remove('hidden');
    updateForm.onsubmit = async (e) => {
    e.preventDefault();
    const updateStatusElement = document.getElementById('updateStatus');
    updateStatusElement.textContent = '';

    try {
      const response = await fetch(`https://smart-tracker-zwnd.onrender.com/api/transactions/${transaction._id}/updates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          stage: document.getElementById('statusStage').value,
          message: document.getElementById('statusMessage').value
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.message || 'Update failed');
      
      // Show success message
      updateStatusElement.textContent = '✓ Status updated successfully!';
      updateStatusElement.style.color = 'green';
      
      // Clear form fields
      document.getElementById('statusMessage').value = '';
      
      // Refresh the transaction display
      document.getElementById('searchForm').dispatchEvent(new Event('submit'));
      
    } catch (err) {
      updateStatusElement.textContent = `Error: ${err.message}`;
      updateStatusElement.style.color = 'red';
      console.error('Update error:', err);
    }
    };
    
  } catch (err) {
    detailsElement.classList.add('hidden');
    alert('Error: ' + err.message);
  }
});


// During update
updateForm.querySelector('button').disabled = true;
updateForm.querySelector('button').textContent = 'Updating...';

// After update/failure
updateForm.querySelector('button').disabled = false;
updateForm.querySelector('button').textContent = 'Add Status Update';

