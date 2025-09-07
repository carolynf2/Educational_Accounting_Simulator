// Main Application Controller
class AccountingSimulator {
    constructor() {
        this.companyData = new CompanyData();
        this.currentCompany = null;
        this.currentDay = 1;
        this.currentScreen = 'welcome';
        this.gameState = {
            selectedCompany: null,
            currentDay: 1,
            completedDays: 0,
            transactions: [],
            journalEntries: [],
            progress: {
                conceptsMastered: 0,
                accuracyRate: 100,
                achievements: []
            }
        };

        // Initialize subsystems
        this.journalSystem = null;
        this.transactionEngine = null;
        this.ledgerManager = null;
        this.statementsBuilder = null;
        this.progressTracker = null;
        this.documentManager = null;
        this.storageManager = new StorageManager();

        this.init();
    }

    init() {
        this.bindEvents();
        this.showLoadingScreen();
        
        // Simulate loading time for educational effect
        setTimeout(() => {
            this.hideLoadingScreen();
            this.showScreen('welcome');
        }, 2000);
    }

    bindEvents() {
        // Navigation events
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-btn')) {
                this.handleNavigation(e.target);
            }
            
            if (e.target.matches('#start-tutorial')) {
                this.startTutorial();
            }
            
            if (e.target.matches('#start-simulation')) {
                this.showScreen('company-setup');
            }
            
            if (e.target.matches('.select-company')) {
                this.selectCompany(e.target.closest('.company-card').dataset.company);
            }
            
            if (e.target.matches('#continue-to-simulation')) {
                this.startSimulation();
            }
            
            // Fallback handler for add journal row
            if (e.target.matches('#add-journal-row')) {
                if (!this.journalSystem && this.gameState.selectedCompany) {
                    this.initializeSubsystems();
                }
                if (this.journalSystem) {
                    this.journalSystem.addJournalRow();
                } else {
                    this.showToast('Please select a company first', 'warning');
                }
            }

            // Modal events
            if (e.target.matches('.modal-close') || e.target.matches('.modal-overlay')) {
                this.closeModal();
            }

            // Help system events
            if (e.target.matches('#help-toggle')) {
                this.toggleHelp();
            }
            
            if (e.target.matches('#help-close')) {
                this.closeHelp();
            }
        });

        // Company card selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.company-card')) {
                const cards = document.querySelectorAll('.company-card');
                cards.forEach(card => card.classList.remove('selected'));
                e.target.closest('.company-card').classList.add('selected');
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeHelp();
            }
            
            if (e.key === 'F1') {
                e.preventDefault();
                this.toggleHelp();
            }
        });
    }

    showLoadingScreen() {
        document.getElementById('loading-screen').style.display = 'flex';
    }

    hideLoadingScreen() {
        const loading = document.getElementById('loading-screen');
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(screenId + '-screen');
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
            this.updateNavigation();
            
            // Screen-specific initialization
            this.initializeScreen(screenId);
        }
    }

    initializeScreen(screenId) {
        switch (screenId) {
            case 'company-setup':
                this.initializeCompanySetup();
                break;
            case 'chart-accounts':
                this.initializeChartOfAccounts();
                break;
            case 'transaction':
                this.initializeTransactionScreen();
                break;
            case 'journal':
                this.initializeJournalScreen();
                break;
            case 'ledger':
                this.initializeLedgerScreen();
                break;
            case 'trial-balance':
                this.initializeTrialBalanceScreen();
                break;
            case 'statements':
                this.initializeStatementsScreen();
                break;
            case 'progress':
                this.initializeProgressScreen();
                break;
        }
    }

    updateNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.id === `nav-${this.currentScreen}` || 
                (this.currentScreen === 'company-setup' && btn.id === 'nav-company') ||
                (this.currentScreen === 'chart-accounts' && btn.id === 'nav-company')) {
                btn.classList.add('active');
            }
        });
    }

    handleNavigation(button) {
        const screenMap = {
            'nav-company': 'company-setup',
            'nav-transactions': 'transaction',
            'nav-journal': 'journal',
            'nav-ledger': 'ledger',
            'nav-trial-balance': 'trial-balance',
            'nav-statements': 'statements',
            'nav-progress': 'progress'
        };

        const screenId = screenMap[button.id];
        if (screenId && this.gameState.selectedCompany) {
            this.showScreen(screenId);
        } else if (screenId === 'company-setup') {
            this.showScreen('company-setup');
        }
    }

    selectCompany(companyType) {
        this.currentCompany = this.companyData.getCompany(companyType);
        this.gameState.selectedCompany = companyType;
        
        // Enable the continue button
        document.getElementById('continue-to-simulation').style.display = 'block';
        
        // Show success message
        this.showToast(`Selected: ${this.currentCompany.name}`, 'success');
    }

    initializeCompanySetup() {
        const companies = this.companyData.getAllCompanies();
        
        // Company cards are already in HTML, just need to update continue button visibility
        const continueBtn = document.getElementById('continue-to-simulation');
        if (this.gameState.selectedCompany) {
            continueBtn.style.display = 'block';
        } else {
            continueBtn.style.display = 'none';
        }
    }

    initializeChartOfAccounts() {
        if (!this.gameState.selectedCompany) {
            this.showScreen('company-setup');
            return;
        }

        const company = this.companyData.getCompany(this.gameState.selectedCompany);
        const chart = company.chartOfAccounts;

        // Populate account sections
        this.populateAccountSection('assets', chart.assets);
        this.populateAccountSection('liabilities', chart.liabilities);
        this.populateAccountSection('equity', chart.equity);
        this.populateAccountSection('revenue', chart.revenue);
        this.populateAccountSection('expenses', chart.expenses);

        // Create balance sheet preview
        this.createBalanceSheetPreview();
    }

    populateAccountSection(sectionId, accounts) {
        const container = document.getElementById(`${sectionId}-accounts`);
        if (!container) return;

        container.innerHTML = '';
        
        accounts.forEach(account => {
            const accountItem = document.createElement('div');
            accountItem.className = 'account-item';
            accountItem.innerHTML = `
                <span class="account-code">${account.code}</span>
                <span class="account-name">${account.name}</span>
                <span class="account-balance">$${account.balance.toLocaleString()}</span>
            `;
            container.appendChild(accountItem);
        });
    }

    createBalanceSheetPreview() {
        const company = this.companyData.getCompany(this.gameState.selectedCompany);
        const summary = document.getElementById('balance-sheet-summary');
        if (!summary) return;

        let totalAssets = 0;
        let totalLiabilities = 0;
        let totalEquity = 0;

        // Calculate totals
        company.chartOfAccounts.assets.forEach(account => {
            totalAssets += account.balance;
        });
        
        company.chartOfAccounts.liabilities.forEach(account => {
            totalLiabilities += account.balance;
        });
        
        company.chartOfAccounts.equity.forEach(account => {
            totalEquity += account.balance;
        });

        summary.innerHTML = `
            <div class="summary-item">
                <div class="summary-label">Total Assets</div>
                <div class="summary-value">$${totalAssets.toLocaleString()}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Total Liabilities</div>
                <div class="summary-value">$${totalLiabilities.toLocaleString()}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Total Equity</div>
                <div class="summary-value">$${totalEquity.toLocaleString()}</div>
            </div>
            <div class="summary-item ${totalAssets === (totalLiabilities + totalEquity) ? 'balanced' : 'unbalanced'}">
                <div class="summary-label">Equation Check</div>
                <div class="summary-value">${totalAssets === (totalLiabilities + totalEquity) ? '✓ Balanced' : '✗ Unbalanced'}</div>
            </div>
        `;
    }

    startSimulation() {
        if (!this.gameState.selectedCompany) {
            this.showToast('Please select a company first', 'error');
            return;
        }

        // Initialize subsystems now that we have a company selected
        this.initializeSubsystems();
        
        this.showScreen('chart-accounts');
        this.updateProgress();
    }

    initializeSubsystems() {
        // Initialize journal system
        this.journalSystem = new JournalSystem(this.companyData);
        
        // Initialize other subsystems
        this.transactionEngine = new TransactionEngine(this.companyData);
        this.progressTracker = new ProgressTracker();
        
        // Initialize ledger manager after journal system
        this.ledgerManager = new LedgerManager(this.companyData, this.journalSystem);
        
        // Initialize statements builder
        this.statementsBuilder = new StatementsBuilder(this.companyData, this.ledgerManager);
        
        // Initialize document manager
        this.documentManager = new DocumentManager(this.companyData, this.transactionEngine);
        
        // Make document manager globally available
        window.documentManager = this.documentManager;
    }

    initializeTransactionScreen() {
        // Ensure document manager is initialized
        if (!this.documentManager && this.gameState.selectedCompany) {
            this.initializeSubsystems();
        }
        
        // Update display elements
        const dayNumber = document.getElementById('current-day-number');
        const weekPhase = document.getElementById('current-week-phase');
        
        if (dayNumber) {
            dayNumber.textContent = this.gameState.currentDay;
        }
        
        if (weekPhase) {
            weekPhase.textContent = this.getWeekPhase();
        }

        this.loadDailyObjectives();
        
        // Initialize document upload functionality
        if (this.documentManager) {
            this.documentManager.populateScenarioSelector();
        }
    }

    getWeekPhase() {
        const day = this.gameState.currentDay;
        if (day <= 7) return "Basic Cash Transactions";
        if (day <= 14) return "Credit Transactions";
        if (day <= 21) return "Complex Operations";
        return "Month-End Activities";
    }

    loadDailyObjectives() {
        const objectivesList = document.getElementById('daily-objectives');
        if (!objectivesList) return;

        const objectives = this.getDailyObjectives();
        objectivesList.innerHTML = '';
        
        objectives.forEach(objective => {
            const li = document.createElement('li');
            li.textContent = objective;
            objectivesList.appendChild(li);
        });
    }

    getDailyObjectives() {
        // This would be expanded with actual daily objectives
        const day = this.gameState.currentDay;
        const baseObjectives = [
            "Analyze source documents carefully",
            "Identify affected accounts",
            "Determine debit and credit amounts",
            "Create balanced journal entries"
        ];

        return baseObjectives;
    }

    initializeJournalScreen() {
        // Ensure journal system is initialized
        if (!this.journalSystem && this.gameState.selectedCompany) {
            this.initializeSubsystems();
        }
        
        // Initialize journal entry interface
        this.setupJournalEntryForm();
    }

    initializeLedgerScreen() {
        // Ensure ledger manager is initialized
        if (!this.ledgerManager && this.gameState.selectedCompany) {
            this.initializeSubsystems();
        }
        
        // Initialize ledger view
        if (this.ledgerManager) {
            this.ledgerManager.updateLedgerDisplay();
        }
    }

    initializeTrialBalanceScreen() {
        // Initialize trial balance
        this.generateTrialBalance();
    }

    initializeStatementsScreen() {
        // Initialize financial statements
        this.generateFinancialStatements();
    }

    initializeProgressScreen() {
        this.updateProgressDisplay();
    }

    setupJournalEntryForm() {
        // Add initial journal entry row through the journal system
        if (this.journalSystem) {
            this.journalSystem.clearJournalForm();
        }
    }



    updateProgress() {
        const currentDaySpan = document.getElementById('current-day');
        const progressFill = document.getElementById('progress-fill');
        const progressPercentage = document.getElementById('progress-percentage');

        if (currentDaySpan) {
            currentDaySpan.textContent = `Day ${this.gameState.currentDay}`;
        }

        const progress = (this.gameState.completedDays / 30) * 100;
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        if (progressPercentage) {
            progressPercentage.textContent = `${Math.round(progress)}%`;
        }
    }

    updateProgressDisplay() {
        const stats = {
            daysCompleted: this.gameState.completedDays,
            accuracyRate: this.gameState.progress.accuracyRate,
            conceptsMastered: this.gameState.progress.conceptsMastered
        };

        document.getElementById('days-completed').textContent = stats.daysCompleted;
        document.getElementById('accuracy-rate').textContent = stats.accuracyRate;
        document.getElementById('concepts-mastered').textContent = stats.conceptsMastered;

        this.updateMasteryIndicators();
        this.updateAchievements();
    }

    updateMasteryIndicators() {
        const container = document.getElementById('mastery-indicators');
        if (!container) return;

        const concepts = [
            'Cash Transactions', 'Credit Transactions', 'Journal Entries',
            'Posting to Ledger', 'Trial Balance', 'Adjusting Entries',
            'Income Statement', 'Balance Sheet', 'Cash Flow Statement',
            'Inventory Management', 'Depreciation', 'Accruals',
            'Deferrals', 'Financial Analysis', 'Closing Entries'
        ];

        container.innerHTML = '';
        concepts.forEach((concept, index) => {
            const item = document.createElement('div');
            item.className = 'mastery-item';
            
            const status = index < this.gameState.progress.conceptsMastered ? 'completed' : 
                          index === this.gameState.progress.conceptsMastered ? 'in-progress' : '';
            
            item.innerHTML = `
                <div class="mastery-indicator ${status}">
                    ${status === 'completed' ? '✓' : status === 'in-progress' ? '⟳' : '○'}
                </div>
                <span>${concept}</span>
            `;
            container.appendChild(item);
        });
    }

    updateAchievements() {
        const container = document.getElementById('achievement-badges');
        if (!container) return;

        const achievements = [
            { id: 'first-entry', title: 'First Entry', icon: '📝', earned: this.gameState.journalEntries.length > 0 },
            { id: 'balanced-books', title: 'Balanced Books', icon: '⚖️', earned: false },
            { id: 'week-one', title: 'Week One Complete', icon: '🎯', earned: this.gameState.completedDays >= 7 },
            { id: 'accuracy-master', title: 'Accuracy Master', icon: '🎯', earned: this.gameState.progress.accuracyRate >= 95 },
            { id: 'speed-demon', title: 'Speed Demon', icon: '⚡', earned: false },
            { id: 'month-complete', title: 'Month Complete', icon: '🏆', earned: this.gameState.completedDays >= 30 }
        ];

        container.innerHTML = '';
        achievements.forEach(achievement => {
            const badge = document.createElement('div');
            badge.className = `achievement-badge ${achievement.earned ? 'earned' : ''}`;
            badge.innerHTML = `
                <div class="badge-icon">${achievement.icon}</div>
                <div class="badge-title">${achievement.title}</div>
            `;
            container.appendChild(badge);
        });
    }

    updateLedgerDisplay() {
        // This will be implemented with ledger manager
    }

    generateTrialBalance() {
        // This will be implemented with trial balance module
    }

    generateFinancialStatements() {
        // This will be implemented with statements builder
    }

    showModal(title, content) {
        const modal = document.getElementById('modal-overlay');
        const modalBody = document.getElementById('modal-body');
        
        modalBody.innerHTML = `
            <h2>${title}</h2>
            <div>${content}</div>
        `;
        
        modal.classList.add('active');
    }

    closeModal() {
        document.getElementById('modal-overlay').classList.remove('active');
    }

    toggleHelp() {
        const helpPanel = document.getElementById('help-content');
        helpPanel.classList.toggle('active');
    }

    closeHelp() {
        document.getElementById('help-content').classList.remove('active');
    }

    showToast(message, type = 'info') {
        // Simple toast implementation using SweetAlert2
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                text: message,
                icon: type,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        } else {
            // Fallback to alert
            alert(message);
        }
    }

    startTutorial() {
        if (typeof introJs !== 'undefined') {
            introJs().setOptions({
                showProgress: true,
                showBullets: false,
                exitOnOverlayClick: false,
                steps: [
                    {
                        intro: "Welcome to the Accounting Cycle Simulator! Let's take a quick tour to get you started."
                    },
                    {
                        element: '.logo-section',
                        intro: "This is your accounting simulator dashboard. Here you'll spend a month learning the complete accounting cycle."
                    },
                    {
                        element: '.main-navigation',
                        intro: "Use these navigation buttons to move between different sections of the accounting cycle."
                    },
                    {
                        element: '.progress-indicator',
                        intro: "Track your progress through the 30-day business simulation here."
                    },
                    {
                        element: '#start-simulation',
                        intro: "Ready to begin? Click 'Start Simulation' to choose your virtual company and begin learning!"
                    }
                ]
            }).start();
        } else {
            this.showToast('Tutorial system not loaded. Proceeding to company selection.', 'info');
            this.showScreen('company-setup');
        }
    }

    // Save game state to localStorage
    saveGameState() {
        try {
            localStorage.setItem('accountingSimulator', JSON.stringify(this.gameState));
        } catch (error) {
            console.warn('Could not save game state:', error);
        }
    }

    // Load game state from localStorage
    loadGameState() {
        try {
            const saved = localStorage.getItem('accountingSimulator');
            if (saved) {
                this.gameState = { ...this.gameState, ...JSON.parse(saved) };
                return true;
            }
        } catch (error) {
            console.warn('Could not load game state:', error);
        }
        return false;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.accountingSimulator = new AccountingSimulator();
});