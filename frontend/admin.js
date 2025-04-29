document.getElementById('addTransactionForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const transactionNumber = document.getElementById('transactionNumber').value.trim();
  
    try {
      const res = await fetch('/admin/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionNumber })
      });
  
      const data = await res.json();
      
      if (data.success) {
        alert('Transaction added successfully!');
        loadTransactions();
        document.getElementById('transactionNumber').value = '';
      } else {
        alert(data.message || 'Error adding transaction');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  });
  
  // Load Transactions
  async function loadTransactions() {
    const container = document.getElementById('transactionsContainer');
    container.innerHTML = '<p>Loading...</p>';
  
    try {
      const res = await fetch('/admin/transactions');
      const data = await res.json();
  
      if (data.success) {
        container.innerHTML = '';
  
        data.transactions.forEach(transaction => {
          const card = document.createElement('div');
          card.className = 'transaction-card';
          card.innerHTML = `
            <h3>${transaction.transactionNumber}</h3>
            <div class="transaction-stages">
              ${transaction.stages.map(stage => `
                <div class="stage">
                  <strong>${stage.status}</strong> <br>
                  <small>${new Date(stage.timestamp).toLocaleString()}</small>
                </div>
              `).join('')}
            </div>
            <button onclick="addStatus('${transaction._id}')">Add New Status</button>
          `;
          container.appendChild(card);
        });
  
      } else {
        container.innerHTML = '<p>No transactions found.</p>';
      }
  
    } catch (error) {
      console.error(error);
      container.innerHTML = '<p>Error loading transactions.</p>';
    }
  }
  
  // Add New Status
  async function addStatus(transactionId) {
    const status = prompt('Enter new status name (or choose):');
  
    if (status) {
      try {
        const res = await fetch(`/admin/transaction/${transactionId}/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
  
        const data = await res.json();
        
        if (data.success) {
          alert('Status added!');
          loadTransactions();
        } else {
          alert(data.message || 'Error adding status');
        }
      } catch (error) {
        console.error(error);
        alert('Something went wrong');
      }
    }
  }
  
  // Initial load
  loadTransactions();
  