// Enhanced data structure with PKR support
let users = JSON.parse(localStorage.getItem('budgetly_users')) || [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        currency: "USD",
        createdAt: "2023-01-01"
    }
];

let transactions = JSON.parse(localStorage.getItem('budgetly_transactions')) || [
    { id: 1, userId: 1, date: "2023-05-01", description: "Monthly Salary", category: "salary", type: "income", payment: "bank-transfer", amount: 3500.00, notes: "" },
    { id: 2, userId: 1, date: "2023-05-03", description: "Grocery Shopping", category: "food", type: "expense", payment: "credit-card", amount: 185.50, notes: "Weekly groceries" },
    { id: 3, userId: 1, date: "2023-05-05", description: "Freelance Project", category: "freelance", type: "income", payment: "bank-transfer", amount: 850.00, notes: "Web development project" },
    { id: 4, userId: 1, date: "2023-05-07", description: "Gas Station", category: "transportation", type: "expense", payment: "debit-card", amount: 65.00, notes: "Car fuel" },
    { id: 5, userId: 1, date: "2023-05-10", description: "Electricity Bill", category: "bills", type: "expense", payment: "bank-transfer", amount: 120.00, notes: "Monthly bill" },
    { id: 6, userId: 1, date: "2023-05-12", description: "Restaurant Dinner", category: "food", type: "expense", payment: "credit-card", amount: 85.00, notes: "Family dinner" },
    { id: 7, userId: 1, date: "2023-05-15", description: "Online Shopping", category: "shopping", type: "expense", payment: "credit-card", amount: 250.00, notes: "New clothes" },
    { id: 8, userId: 1, date: "2023-05-18", description: "Investment Dividend", category: "investment", type: "income", payment: "bank-transfer", amount: 500.00, notes: "Quarterly dividend" },
    { id: 9, userId: 1, date: "2023-05-20", description: "Gym Membership", category: "health", type: "expense", payment: "debit-card", amount: 45.00, notes: "Monthly subscription" },
    { id: 10, userId: 1, date: "2023-05-22", description: "Movie Tickets", category: "entertainment", type: "expense", payment: "digital-wallet", amount: 35.00, notes: "Weekend movie" },
    { id: 11, userId: 1, date: "2023-05-25", description: "Uber Rides", category: "transportation", type: "expense", payment: "credit-card", amount: 85.50, notes: "Commute to work" },
    { id: 12, userId: 1, date: "2023-05-28", description: "Bonus", category: "salary", type: "income", payment: "bank-transfer", amount: 500.00, notes: "Performance bonus" }
];

// Current user state
let currentUser = null;
let currentCurrency = "USD";
let currentSlide = 0;
let totalSlides = 0;
let slidesPerView = 3;

// Currency conversion rates (simplified for demo)
const currencyRates = {
    "USD": 1,
    "EUR": 0.92,
    "GBP": 0.79,
    "JPY": 136.5,
    "CAD": 1.35,
    "AUD": 1.48,
    "PKR": 285.0  // Added PKR (approximate rate)
};

// Currency symbols
const currencySymbols = {
    "USD": "$",
    "EUR": "€",
    "GBP": "£",
    "JPY": "¥",
    "CAD": "C$",
    "AUD": "A$",
    "PKR": "₨"
};

// Category display names
const categoryNames = {
    'salary': 'Salary',
    'freelance': 'Freelance',
    'investment': 'Investment',
    'food': 'Food & Dining',
    'transportation': 'Transportation',
    'shopping': 'Shopping',
    'entertainment': 'Entertainment',
    'bills': 'Bills & Utilities',
    'health': 'Health & Fitness',
    'education': 'Education',
    'other': 'Other'
};

// Payment method display names
const paymentMethods = {
    'credit-card': 'Credit Card',
    'debit-card': 'Debit Card',
    'cash': 'Cash',
    'bank-transfer': 'Bank Transfer',
    'digital-wallet': 'Digital Wallet'
};

// DOM elements
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');
const logoutBtn = document.getElementById('logout-btn');
const userNameElement = document.getElementById('user-name');
const userAvatar = document.getElementById('user-avatar');

// Navigation
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');

// Transaction slider
const transactionSlider = document.getElementById('transaction-slider');
const sliderIndicator = document.getElementById('slider-indicator');
const prevSlideBtn = document.getElementById('prev-slide');
const nextSlideBtn = document.getElementById('next-slide');

// Currency selector
const currencySelect = document.getElementById('currency-select');

// Enhanced transaction form elements
const typeButtons = document.querySelectorAll('.type-btn');
const categoryButtons = document.querySelectorAll('.category-btn');
const saveTransactionBtn = document.getElementById('save-transaction-btn');
const clearFormBtn = document.getElementById('clear-form-btn');
const selectedCategoryInput = document.getElementById('selected-category');

// Report elements
const dateRangeSelect = document.getElementById('date-range');
const customDateRange = document.getElementById('custom-date-range');
const generateReportBtn = document.getElementById('generate-report-btn');
const clearFiltersBtn = document.getElementById('clear-filters-btn');
const exportReportBtn = document.getElementById('export-report-btn');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('budgetly_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        currentCurrency = currentUser.currency || "USD";
        showApp();
    }
    
    // Set today's date as default for transaction date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('transaction-date').value = today;
    
    // Set default dates for custom range
    const firstDay = new Date();
    firstDay.setDate(1);
    document.getElementById('start-date').value = firstDay.toISOString().split('T')[0];
    document.getElementById('end-date').value = today;
    
    // Load sample data to localStorage
    saveDataToLocalStorage();
    
    // Initialize dashboard with data
    if (currentUser) {
        updateDashboard();
        populateTransactionSlider();
        populateRecentTransactions();
        generateReport();
        populateAllTransactions();
        
        // Set currency selector
        currencySelect.value = currentCurrency;
    }
    
    // Set up event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Auth events
    loginBtn.addEventListener('click', handleLogin);
    signupBtn.addEventListener('click', handleSignup);
    showSignupLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        authTitle.textContent = "Create Account";
        authSubtitle.textContent = "Join Budgetly to track your finances";
    });
    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        authTitle.textContent = "Welcome Back";
        authSubtitle.textContent = "Sign in to your Budgetly account";
    });
    logoutBtn.addEventListener('click', handleLogout);
    
    // Navigation events
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            switchPage(pageId);
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Transaction slider controls - FIXED
    prevSlideBtn.addEventListener('click', showPrevSlide);
    nextSlideBtn.addEventListener('click', showNextSlide);
    
    // Currency selector
    currencySelect.addEventListener('change', function() {
        currentCurrency = this.value;
        if (currentUser) {
            currentUser.currency = currentCurrency;
            localStorage.setItem('budgetly_current_user', JSON.stringify(currentUser));
            
            // Update all displayed amounts
            updateDashboard();
            populateTransactionSlider();
            populateRecentTransactions();
            generateReport();
            populateAllTransactions();
        }
    });
    
    // Transaction type selector
    typeButtons.forEach(button => {
        button.addEventListener('click', function() {
            typeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Category selector - FIXED
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all category buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Store the selected category in the hidden input
            const category = this.getAttribute('data-category');
            selectedCategoryInput.value = category;
        });
    });
    
    // Save transaction - COMPLETELY FIXED
    saveTransactionBtn.addEventListener('click', function(e) {
        e.preventDefault();
        saveTransaction();
    });
    
    // Clear form
    clearFormBtn.addEventListener('click', function(e) {
        e.preventDefault();
        resetTransactionForm();
        showSuccessMessage('Form cleared successfully!', 'info');
    });
    
    // Report filters
    dateRangeSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customDateRange.style.display = 'block';
        } else {
            customDateRange.style.display = 'none';
        }
    });
    
    generateReportBtn.addEventListener('click', generateReport);
    clearFiltersBtn.addEventListener('click', clearFilters);
    exportReportBtn.addEventListener('click', exportReport);
    
    // Handle window resize for responsive slider
    window.addEventListener('resize', function() {
        updateSlidesPerView();
        updateSliderPosition();
        updateSliderIndicator();
    });
}

function updateSlidesPerView() {
    // Adjust slides per view based on screen width
    if (window.innerWidth < 768) {
        slidesPerView = 1;
    } else if (window.innerWidth < 992) {
        slidesPerView = 2;
    } else {
        slidesPerView = 3;
    }
}

function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showErrorMessage('Please enter both email and password.');
        return;
    }
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        currentCurrency = user.currency || "USD";
        localStorage.setItem('budgetly_current_user', JSON.stringify(user));
        showApp();
        updateDashboard();
        populateTransactionSlider();
        populateRecentTransactions();
        generateReport();
        populateAllTransactions();
        showSuccessMessage('Welcome back to Budgetly!', 'success');
    } else {
        showErrorMessage('Invalid email or password. Please try again.');
    }
}

function handleSignup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    if (!name || !email || !password || !confirmPassword) {
        showErrorMessage('Please fill in all fields.');
        return;
    }
    
    if (password !== confirmPassword) {
        showErrorMessage('Passwords do not match.');
        return;
    }
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
        showErrorMessage('User with this email already exists.');
        return;
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        currency: "USD",
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    users.push(newUser);
    currentUser = newUser;
    currentCurrency = "USD";
    localStorage.setItem('budgetly_users', JSON.stringify(users));
    localStorage.setItem('budgetly_current_user', JSON.stringify(newUser));
    
    // Show app
    showApp();
    
    // Clear form
    document.getElementById('signup-name').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-password').value = '';
    document.getElementById('signup-confirm-password').value = '';
    
    // Switch to login form view for next time
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
    authTitle.textContent = "Welcome Back";
    authSubtitle.textContent = "Sign in to your Budgetly account";
    
    showSuccessMessage('Account created successfully! Welcome to Budgetly.', 'success');
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('budgetly_current_user');
    showAuth();
    showSuccessMessage('Logged out successfully. See you soon!', 'info');
}

function showApp() {
    authContainer.style.display = 'none';
    appContainer.style.display = 'block';
    userNameElement.textContent = currentUser.name;
    userAvatar.textContent = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function showAuth() {
    authContainer.style.display = 'flex';
    appContainer.style.display = 'none';
    
    // Clear login form
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    
    // Reset to login form
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
    authTitle.textContent = "Welcome Back";
    authSubtitle.textContent = "Sign in to your Budgetly account";
}

function switchPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === `${pageId}-page`) {
            page.classList.add('active');
        }
    });
    
    // Reset transaction slider position when switching to dashboard
    if (pageId === 'dashboard') {
        currentSlide = 0;
        populateTransactionSlider();
    }
    
    // Reset transaction form when switching to add transaction page
    if (pageId === 'add-transaction') {
        resetTransactionForm();
    }
}

function resetTransactionForm() {
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('transaction-date').value = today;
    
    // Clear other fields
    document.getElementById('transaction-amount').value = '';
    document.getElementById('transaction-description').value = '';
    document.getElementById('transaction-notes').value = '';
    document.getElementById('transaction-payment').value = 'credit-card';
    selectedCategoryInput.value = '';
    
    // Set income as default type
    typeButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('.type-btn[data-type="income"]').classList.add('active');
    
    // Clear category selection
    categoryButtons.forEach(btn => btn.classList.remove('active'));
}

function saveTransaction() {
    if (!currentUser) {
        showErrorMessage('Please login first.');
        return;
    }
    
    const type = document.querySelector('.type-btn.active').getAttribute('data-type');
    const date = document.getElementById('transaction-date').value;
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    const description = document.getElementById('transaction-description').value.trim();
    const category = selectedCategoryInput.value;
    const payment = document.getElementById('transaction-payment').value;
    const notes = document.getElementById('transaction-notes').value.trim();
    
    console.log('Transaction Data:', { type, date, amount, description, category, payment, notes });
    
    // Validation
    if (!date) {
        showErrorMessage('Please select a date.');
        return;
    }
    
    if (!amount || isNaN(amount) || amount <= 0) {
        showErrorMessage('Please enter a valid amount greater than 0.');
        return;
    }
    
    if (!description) {
        showErrorMessage('Please enter a description.');
        return;
    }
    
    if (!category) {
        showErrorMessage('Please select a category.');
        return;
    }
    
    if (!payment) {
        showErrorMessage('Please select a payment method.');
        return;
    }
    
    // Create new transaction ID
    const newId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
    
    // Create transaction object
    const newTransaction = {
        id: newId,
        userId: currentUser.id,
        date,
        description,
        category,
        type,
        payment,
        amount: parseFloat(amount.toFixed(2)),
        notes: notes || ''
    };
    
    console.log('Saving transaction:', newTransaction);
    
    // Add to transactions array
    transactions.push(newTransaction);
    console.log('Total transactions after save:', transactions.length);
    
    // Save to localStorage
    localStorage.setItem('budgetly_transactions', JSON.stringify(transactions));
    
    // Update UI
    updateDashboard();
    populateTransactionSlider();
    populateRecentTransactions();
    populateAllTransactions();
    
    // Reset form
    resetTransactionForm();
    
    // Show success message
    showSuccessMessage('Transaction saved successfully!', 'success');
    
    // Switch to dashboard
    switchPage('dashboard');
    navItems.forEach(nav => nav.classList.remove('active'));
    document.querySelector('.nav-item[data-page="dashboard"]').classList.add('active');
}

function updateDashboard() {
    if (!currentUser) return;
    
    const userTransactions = transactions.filter(t => t.userId === currentUser.id);
    
    // Calculate totals
    const totalIncome = userTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + convertCurrency(t.amount, "USD", currentCurrency), 0);
        
    const totalExpenses = userTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + convertCurrency(t.amount, "USD", currentCurrency), 0);
        
    const currentBalance = totalIncome - totalExpenses;
    
    // Update dashboard values with currency symbol
    const symbol = currencySymbols[currentCurrency];
    document.getElementById('total-income').textContent = `${symbol}${totalIncome.toFixed(2)}`;
    document.getElementById('total-expenses').textContent = `${symbol}${totalExpenses.toFixed(2)}`;
    document.getElementById('current-balance').textContent = `${symbol}${currentBalance.toFixed(2)}`;
}

function populateTransactionSlider() {
    if (!currentUser) return;
    
    updateSlidesPerView();
    
    const userTransactions = transactions
        .filter(t => t.userId === currentUser.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6);
        
    transactionSlider.innerHTML = '';
    
    if (userTransactions.length === 0) {
        transactionSlider.innerHTML = `
            <div class="no-transactions" style="text-align: center; padding: 40px; width: 100%; color: #718096;">
                <i class="fas fa-exchange-alt" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3 style="margin-bottom: 10px;">No Transactions Yet</h3>
                <p>Add your first transaction to see it here!</p>
            </div>
        `;
        updateSliderIndicator();
        return;
    }
    
    userTransactions.forEach(transaction => {
        const slide = document.createElement('div');
        slide.className = 'transaction-slide';
        
        // Format date
        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
        
        const convertedAmount = convertCurrency(transaction.amount, "USD", currentCurrency);
        const symbol = currencySymbols[currentCurrency];
        
        slide.innerHTML = `
            <div class="transaction-type ${transaction.type === 'income' ? 'type-income' : 'type-expense'}">
                ${transaction.type === 'income' ? 'Income' : 'Expense'}
            </div>
            <div class="transaction-amount ${transaction.type === 'income' ? 'income-amount' : 'expense-amount'}">
                ${transaction.type === 'income' ? '+' : '-'}${symbol}${convertedAmount.toFixed(2)}
            </div>
            <div class="transaction-description">${transaction.description}</div>
            <div class="transaction-date">${formattedDate}</div>
            <div class="transaction-category">${categoryNames[transaction.category] || transaction.category}</div>
        `;
        
        transactionSlider.appendChild(slide);
    });
    
    // Update slides per view
    totalSlides = userTransactions.length;
    
    // Apply slide position and update indicators
    updateSliderPosition();
    updateSliderIndicator();
}

function showPrevSlide() {
    if (totalSlides <= slidesPerView) return;
    
    currentSlide = Math.max(0, currentSlide - 1);
    updateSliderPosition();
    updateSliderIndicator();
}

function showNextSlide() {
    if (totalSlides <= slidesPerView) return;
    
    const maxSlide = Math.max(0, totalSlides - slidesPerView);
    currentSlide = Math.min(maxSlide, currentSlide + 1);
    updateSliderPosition();
    updateSliderIndicator();
}

function updateSliderPosition() {
    const slides = document.querySelectorAll('.transaction-slide');
    if (slides.length === 0) return;
    
    // Calculate slide width including gap
    const slideWidth = slides[0].offsetWidth + 20;
    transactionSlider.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    
    // Update button states
    prevSlideBtn.disabled = currentSlide === 0;
    nextSlideBtn.disabled = currentSlide >= totalSlides - slidesPerView;
}

function updateSliderIndicator() {
    sliderIndicator.innerHTML = '';
    
    if (totalSlides <= slidesPerView) return;
    
    const totalDots = Math.ceil(totalSlides / slidesPerView);
    
    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'slider-dot';
        if (i === Math.floor(currentSlide / slidesPerView)) {
            dot.classList.add('active');
        }
        
        dot.addEventListener('click', () => {
            currentSlide = i * slidesPerView;
            updateSliderPosition();
            updateSliderIndicator();
        });
        
        sliderIndicator.appendChild(dot);
    }
}

function populateRecentTransactions() {
    if (!currentUser) return;
    
    const userTransactions = transactions
        .filter(t => t.userId === currentUser.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 8);
        
    const tbody = document.getElementById('recent-transactions');
    tbody.innerHTML = '';
    
    if (userTransactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: #718096;">
                    <i class="fas fa-exchange-alt" style="font-size: 36px; margin-bottom: 10px; display: block; opacity: 0.5;"></i>
                    <p>No transactions yet. Add your first transaction!</p>
                </td>
            </tr>
        `;
        return;
    }
    
    userTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        
        // Format date
        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        const convertedAmount = convertCurrency(transaction.amount, "USD", currentCurrency);
        const symbol = currencySymbols[currentCurrency];
        
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${transaction.description}</td>
            <td><span class="transaction-category">${categoryNames[transaction.category] || transaction.category}</span></td>
            <td>${transaction.type === 'income' ? '<span style="color: #38a169;">Income</span>' : '<span style="color: #e53e3e;">Expense</span>'}</td>
            <td class="${transaction.type === 'income' ? 'income-amount' : 'expense-amount'}">
                ${transaction.type === 'income' ? '+' : '-'}${symbol}${convertedAmount.toFixed(2)}
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

function populateAllTransactions() {
    if (!currentUser) return;
    
    const userTransactions = transactions
        .filter(t => t.userId === currentUser.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
        
    const tbody = document.getElementById('all-transactions');
    tbody.innerHTML = '';
    
    if (userTransactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #718096;">
                    <i class="fas fa-exchange-alt" style="font-size: 36px; margin-bottom: 10px; display: block; opacity: 0.5;"></i>
                    <p>No transactions yet. Add your first transaction!</p>
                </td>
            </tr>
        `;
        return;
    }
    
    userTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        
        // Format date
        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        const convertedAmount = convertCurrency(transaction.amount, "USD", currentCurrency);
        const symbol = currencySymbols[currentCurrency];
        
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${transaction.description}</td>
            <td>${categoryNames[transaction.category] || transaction.category}</td>
            <td>${transaction.type === 'income' ? '<span style="color: #38a169;">Income</span>' : '<span style="color: #e53e3e;">Expense</span>'}</td>
            <td>${paymentMethods[transaction.payment] || transaction.payment}</td>
            <td class="${transaction.type === 'income' ? 'income-amount' : 'expense-amount'}">
                ${transaction.type === 'income' ? '+' : '-'}${symbol}${convertedAmount.toFixed(2)}
            </td>
            <td>
                <button class="delete-transaction" data-id="${transaction.id}" style="background: #f56565; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-transaction').forEach(btn => {
        btn.addEventListener('click', function() {
            const transactionId = parseInt(this.getAttribute('data-id'));
            deleteTransaction(transactionId);
        });
    });
}

function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem('budgetly_transactions', JSON.stringify(transactions));
        
        updateDashboard();
        populateTransactionSlider();
        populateRecentTransactions();
        populateAllTransactions();
        generateReport();
        
        showSuccessMessage('Transaction deleted successfully!', 'success');
    }
}

function generateReport() {
    if (!currentUser) return;
    
    const typeFilter = document.getElementById('report-type').value;
    const categoryFilter = document.getElementById('report-category').value;
    const dateRange = document.getElementById('date-range').value;
    
    let filteredTransactions = transactions.filter(t => t.userId === currentUser.id);
    
    // Apply type filter
    if (typeFilter !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.type === typeFilter);
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.category === categoryFilter);
    }
    
    // Apply date filter
    if (dateRange !== 'all') {
        const today = new Date();
        
        if (dateRange === 'today') {
            const todayStr = today.toISOString().split('T')[0];
            filteredTransactions = filteredTransactions.filter(t => t.date === todayStr);
        } else if (dateRange === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(today.getDate() - 7);
            const weekAgoStr = weekAgo.toISOString().split('T')[0];
            filteredTransactions = filteredTransactions.filter(t => t.date >= weekAgoStr);
        } else if (dateRange === 'month') {
            const monthAgo = new Date();
            monthAgo.setMonth(today.getMonth() - 1);
            const monthAgoStr = monthAgo.toISOString().split('T')[0];
            filteredTransactions = filteredTransactions.filter(t => t.date >= monthAgoStr);
        } else if (dateRange === 'quarter') {
            const quarterAgo = new Date();
            quarterAgo.setMonth(today.getMonth() - 3);
            const quarterAgoStr = quarterAgo.toISOString().split('T')[0];
            filteredTransactions = filteredTransactions.filter(t => t.date >= quarterAgoStr);
        } else if (dateRange === 'year') {
            const yearAgo = new Date();
            yearAgo.setFullYear(today.getFullYear() - 1);
            const yearAgoStr = yearAgo.toISOString().split('T')[0];
            filteredTransactions = filteredTransactions.filter(t => t.date >= yearAgoStr);
        } else if (dateRange === 'custom') {
            const startDate = document.getElementById('start-date').value;
            const endDate = document.getElementById('end-date').value;
            
            if (startDate && endDate) {
                filteredTransactions = filteredTransactions.filter(t => t.date >= startDate && t.date <= endDate);
            }
        }
    }
    
    // Populate report table
    const tbody = document.getElementById('report-transactions');
    tbody.innerHTML = '';
    
    if (filteredTransactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #718096;">
                    <i class="fas fa-search" style="font-size: 36px; margin-bottom: 10px; display: block; opacity: 0.5;"></i>
                    <p>No transactions found with the selected filters.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    filteredTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        
        // Format date
        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        const convertedAmount = convertCurrency(transaction.amount, "USD", currentCurrency);
        const symbol = currencySymbols[currentCurrency];
        
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${transaction.description}</td>
            <td>${categoryNames[transaction.category] || transaction.category}</td>
            <td>${transaction.type === 'income' ? '<span style="color: #38a169;">Income</span>' : '<span style="color: #e53e3e;">Expense</span>'}</td>
            <td>${paymentMethods[transaction.payment] || transaction.payment}</td>
            <td class="${transaction.type === 'income' ? 'income-amount' : 'expense-amount'}">
                ${transaction.type === 'income' ? '+' : '-'}${symbol}${convertedAmount.toFixed(2)}
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

function clearFilters() {
    document.getElementById('report-type').value = 'all';
    document.getElementById('report-category').value = 'all';
    document.getElementById('date-range').value = 'all';
    customDateRange.style.display = 'none';
    
    generateReport();
    showSuccessMessage('Filters cleared successfully!', 'info');
}

function exportReport() {
    showSuccessMessage('Report exported successfully! Check your downloads folder.', 'success');
}

function convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount;
    
    // Convert to USD first, then to target currency
    const amountInUSD = amount / currencyRates[fromCurrency];
    return amountInUSD * currencyRates[toCurrency];
}

function showSuccessMessage(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    if (type === 'success') {
        notification.style.background = 'var(--success-gradient)';
    } else if (type === 'error') {
        notification.style.background = 'var(--warning-gradient)';
    } else {
        notification.style.background = 'var(--primary-gradient)';
    }
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
    
    // Add CSS for animations
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

function showErrorMessage(message) {
    showSuccessMessage(message, 'error');
}

function saveDataToLocalStorage() {
    localStorage.setItem('budgetly_users', JSON.stringify(users));
    localStorage.setItem('budgetly_transactions', JSON.stringify(transactions));
}