// Ledger Manager - Handles posting and ledger operations
class LedgerManager {
    constructor(companyData, journalSystem) {
        this.companyData = companyData;
        this.journalSystem = journalSystem;
        this.ledgerAccounts = new Map();
        this.currentFilter = '';
        this.currentSearch = '';
        this.initializeLedger();
        this.bindEvents();
    }

    initializeLedger() {
        // Initialize ledger with starting balances
        if (window.accountingSimulator?.gameState.selectedCompany) {
            const accounts = this.companyData.getAllAccounts(
                window.accountingSimulator.gameState.selectedCompany
            );
            
            accounts.forEach(account => {
                this.ledgerAccounts.set(account.code, {
                    account: account,
                    entries: [],
                    balance: account.balance || 0
                });
            });
        }
    }

    bindEvents() {
        // Account filter dropdown
        document.addEventListener('change', (e) => {
            if (e.target.matches('#ledger-account-filter')) {
                this.currentFilter = e.target.value;
                this.updateLedgerDisplay();
            }
        });

        // Search input
        document.addEventListener('input', (e) => {
            if (e.target.matches('#ledger-search')) {
                this.currentSearch = e.target.value.toLowerCase();
                this.updateLedgerDisplay();
            }
        });
    }

    postJournalEntry(journalEntry) {
        // Post debits
        journalEntry.debits.forEach(debit => {
            this.addLedgerEntry(debit.account, {
                date: journalEntry.date,
                reference: journalEntry.reference,
                description: debit.description,
                debit: debit.amount,
                credit: 0,
                journalId: journalEntry.id
            });
        });

        // Post credits
        journalEntry.credits.forEach(credit => {
            this.addLedgerEntry(credit.account, {
                date: journalEntry.date,
                reference: journalEntry.reference,
                description: credit.description,
                debit: 0,
                credit: credit.amount,
                journalId: journalEntry.id
            });
        });

        this.updateLedgerDisplay();
    }

    populateAccountFilter() {
        const filterSelect = document.getElementById('ledger-account-filter');
        if (!filterSelect) return;

        // Clear existing options except "All Accounts"
        filterSelect.innerHTML = '<option value="">All Accounts</option>';

        // Add account options
        this.ledgerAccounts.forEach((ledgerAccount, accountCode) => {
            const option = document.createElement('option');
            option.value = accountCode;
            option.textContent = `${accountCode} - ${ledgerAccount.account.name}`;
            filterSelect.appendChild(option);
        });
    }

    addLedgerEntry(accountCode, entry) {
        const ledgerAccount = this.ledgerAccounts.get(accountCode);
        if (ledgerAccount) {
            ledgerAccount.entries.push(entry);
            // Update balance based on normal side
            if (ledgerAccount.account.normalSide === 'debit') {
                ledgerAccount.balance += entry.debit - entry.credit;
            } else {
                ledgerAccount.balance += entry.credit - entry.debit;
            }
        }
    }

    updateLedgerDisplay() {
        const container = document.getElementById('ledger-accounts');
        if (!container) return;

        // Add sample transactions for demonstration (remove in production)
        this.addSampleTransactions();

        // Populate the account filter dropdown if not already done
        this.populateAccountFilter();

        container.innerHTML = '';
        
        // Filter accounts based on current filter and search
        const filteredAccounts = this.getFilteredAccounts();
        
        if (filteredAccounts.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <p>No accounts match your search criteria.</p>
                    <p><small>Try adjusting your filter or search terms.</small></p>
                </div>
            `;
            return;
        }
        
        filteredAccounts.forEach((ledgerAccount) => {
            const accountElement = this.createLedgerAccountElement(ledgerAccount);
            container.appendChild(accountElement);
        });
    }

    getFilteredAccounts() {
        const filteredAccounts = [];
        
        this.ledgerAccounts.forEach((ledgerAccount, accountCode) => {
            // Apply account filter
            if (this.currentFilter && accountCode !== this.currentFilter) {
                return;
            }
            
            // Apply search filter
            if (this.currentSearch) {
                const searchText = this.currentSearch;
                const accountName = ledgerAccount.account.name.toLowerCase();
                const accountCode = ledgerAccount.account.code.toLowerCase();
                
                // Search in account name, code, and transaction descriptions
                let matchFound = accountName.includes(searchText) || 
                                accountCode.includes(searchText);
                
                if (!matchFound) {
                    // Search in transaction descriptions
                    matchFound = ledgerAccount.entries.some(entry => 
                        entry.description.toLowerCase().includes(searchText)
                    );
                }
                
                if (!matchFound) {
                    return;
                }
            }
            
            filteredAccounts.push(ledgerAccount);
        });
        
        return filteredAccounts;
    }

    createLedgerAccountElement(ledgerAccount) {
        const element = document.createElement('div');
        element.className = 'ledger-account';
        
        element.innerHTML = `
            <div class="ledger-account-header">
                <span>${ledgerAccount.account.code} - ${ledgerAccount.account.name}</span>
                <span class="account-balance">$${Math.abs(ledgerAccount.balance).toFixed(2)}</span>
            </div>
            <div class="ledger-account-body">
                ${ledgerAccount.entries.map(entry => `
                    <div class="ledger-transaction">
                        <span class="transaction-date">${entry.date}</span>
                        <span class="transaction-desc">${entry.description}</span>
                        <span class="transaction-amount">
                            ${entry.debit > 0 ? `Dr: $${entry.debit.toFixed(2)}` : `Cr: $${entry.credit.toFixed(2)}`}
                        </span>
                    </div>
                `).join('')}
                <div class="ledger-transaction balance-line">
                    <span></span>
                    <span><strong>Balance:</strong></span>
                    <span><strong>$${Math.abs(ledgerAccount.balance).toFixed(2)}</strong></span>
                </div>
            </div>
        `;
        
        return element;
    }

    getAccountBalance(accountCode) {
        const ledgerAccount = this.ledgerAccounts.get(accountCode);
        return ledgerAccount ? ledgerAccount.balance : 0;
    }

    getTrialBalance() {
        const trialBalance = [];
        
        this.ledgerAccounts.forEach((ledgerAccount, accountCode) => {
            const balance = ledgerAccount.balance;
            trialBalance.push({
                code: accountCode,
                name: ledgerAccount.account.name,
                debit: ledgerAccount.account.normalSide === 'debit' && balance > 0 ? balance : 0,
                credit: ledgerAccount.account.normalSide === 'credit' && balance > 0 ? balance : 0
            });
        });
        
        return trialBalance.sort((a, b) => a.code.localeCompare(b.code));
    }

    // Helper methods for filtering and search
    clearFilters() {
        this.currentFilter = '';
        this.currentSearch = '';
        
        // Reset UI elements
        const filterSelect = document.getElementById('ledger-account-filter');
        const searchInput = document.getElementById('ledger-search');
        
        if (filterSelect) filterSelect.value = '';
        if (searchInput) searchInput.value = '';
        
        this.updateLedgerDisplay();
    }

    getAccountSummary() {
        const summary = {
            totalAccounts: this.ledgerAccounts.size,
            accountsWithActivity: 0,
            totalTransactions: 0
        };

        this.ledgerAccounts.forEach((ledgerAccount) => {
            if (ledgerAccount.entries.length > 0) {
                summary.accountsWithActivity++;
                summary.totalTransactions += ledgerAccount.entries.length;
            }
        });

        return summary;
    }

    refreshDisplay() {
        this.updateLedgerDisplay();
    }

    // Add sample transactions for testing (can be removed in production)
    addSampleTransactions() {
        // Only add if no transactions exist
        let hasTransactions = false;
        this.ledgerAccounts.forEach((account) => {
            if (account.entries.length > 0) {
                hasTransactions = true;
            }
        });

        if (hasTransactions) return;

        // Add some sample transactions
        const sampleEntries = [
            {
                date: new Date().toLocaleDateString(),
                reference: 'SAMPLE001',
                description: 'Sample cash sale',
                debit: 150.00,
                credit: 0,
                journalId: 'SAMPLE'
            },
            {
                date: new Date().toLocaleDateString(),
                reference: 'SAMPLE002',
                description: 'Sample expense payment',
                debit: 0,
                credit: 75.00,
                journalId: 'SAMPLE'
            }
        ];

        // Add to Cash account if it exists
        const cashAccount = this.ledgerAccounts.get('1001');
        if (cashAccount) {
            cashAccount.entries.push(sampleEntries[0]);
            cashAccount.entries.push(sampleEntries[1]);
            cashAccount.balance += (sampleEntries[0].debit - sampleEntries[1].credit);
        }

        // Add corresponding revenue entry
        const revenueAccount = this.ledgerAccounts.get('4001');
        if (revenueAccount) {
            revenueAccount.entries.push({
                date: new Date().toLocaleDateString(),
                reference: 'SAMPLE001',
                description: 'Sample cash sale',
                debit: 0,
                credit: 150.00,
                journalId: 'SAMPLE'
            });
            revenueAccount.balance += 150.00;
        }

        // Add corresponding expense entry
        const expenseAccount = this.ledgerAccounts.get('5030');
        if (expenseAccount) {
            expenseAccount.entries.push({
                date: new Date().toLocaleDateString(),
                reference: 'SAMPLE002',
                description: 'Sample expense payment',
                debit: 75.00,
                credit: 0,
                journalId: 'SAMPLE'
            });
            expenseAccount.balance += 75.00;
        }
    }
}

window.LedgerManager = LedgerManager;