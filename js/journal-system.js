// Journal Entry System with T-Accounts Visualization
class JournalSystem {
    constructor(companyData) {
        this.companyData = companyData;
        this.journalEntries = [];
        this.currentEntry = null;
        this.entryCounter = 1;
        this.validationRules = this.initializeValidationRules();
        
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('#add-journal-row')) {
                e.preventDefault();
                this.addJournalRow();
            }
            
            if (e.target.matches('#post-entry')) {
                this.postJournalEntry();
            }
            
            if (e.target.matches('.remove-row')) {
                this.removeJournalRow(e.target.closest('tr'));
            }
            
            if (e.target.matches('#create-journal-entry')) {
                this.startJournalEntry();
            }
        });

        // Real-time validation and T-account updates
        document.addEventListener('input', (e) => {
            if (e.target.matches('.entry-debit') || e.target.matches('.entry-credit')) {
                this.updateJournalTotals();
                this.updateTAccounts();
            }
            
            if (e.target.matches('.account-select')) {
                this.updateTAccounts();
                this.showAccountInfo(e.target);
            }
        });

        // Auto-fill opposite entry when one is filled
        document.addEventListener('input', (e) => {
            if (e.target.matches('.entry-debit')) {
                const row = e.target.closest('tr');
                const creditInput = row.querySelector('.entry-credit');
                if (e.target.value && creditInput) {
                    creditInput.value = '';
                    creditInput.disabled = true;
                }
            }
            
            if (e.target.matches('.entry-credit')) {
                const row = e.target.closest('tr');
                const debitInput = row.querySelector('.entry-debit');
                if (e.target.value && debitInput) {
                    debitInput.value = '';
                    debitInput.disabled = true;
                }
            }
        });
    }

    initializeValidationRules() {
        return {
            balanceCheck: {
                name: "Debits must equal credits",
                validate: (entry) => {
                    const totalDebits = entry.debits.reduce((sum, d) => sum + d.amount, 0);
                    const totalCredits = entry.credits.reduce((sum, c) => sum + c.amount, 0);
                    return Math.abs(totalDebits - totalCredits) < 0.01;
                }
            },
            minimumEntries: {
                name: "At least two accounts required",
                validate: (entry) => {
                    return entry.debits.length + entry.credits.length >= 2;
                }
            },
            validAccounts: {
                name: "All accounts must be valid",
                validate: (entry, companyType) => {
                    const allAccounts = this.companyData.getAllAccounts(companyType);
                    const validCodes = allAccounts.map(acc => acc.code);
                    
                    const entryAccounts = [
                        ...entry.debits.map(d => d.account),
                        ...entry.credits.map(c => c.account)
                    ];
                    
                    return entryAccounts.every(account => validCodes.includes(account));
                }
            },
            positiveAmounts: {
                name: "All amounts must be positive",
                validate: (entry) => {
                    const allAmounts = [
                        ...entry.debits.map(d => d.amount),
                        ...entry.credits.map(c => c.amount)
                    ];
                    return allAmounts.every(amount => amount > 0);
                }
            }
        };
    }

    startJournalEntry(transactionData = null) {
        this.currentEntry = {
            id: `JE${this.entryCounter.toString().padStart(3, '0')}`,
            date: new Date().toISOString().split('T')[0],
            reference: `REF${this.entryCounter}`,
            description: '',
            debits: [],
            credits: [],
            status: 'draft',
            transactionId: transactionData?.id || null
        };
        
        this.entryCounter++;
        this.clearJournalForm();
        this.setupInitialEntryData(transactionData);
        this.showJournalScreen();
    }

    setupInitialEntryData(transactionData) {
        if (!transactionData) return;
        
        // Pre-fill date and reference
        document.getElementById('entry-date').value = this.currentEntry.date;
        document.getElementById('entry-reference').value = this.currentEntry.reference;
        
        // If we have transaction data, add suggested journal entries
        if (transactionData.journalEntry) {
            this.addSuggestedEntries(transactionData.journalEntry);
        }
        
        // Show source document for reference
        this.displaySourceDocument(transactionData.sourceDocument);
    }

    addSuggestedEntries(journalEntries) {
        const tbody = document.getElementById('journal-entry-rows');
        tbody.innerHTML = ''; // Clear existing rows
        
        journalEntries.forEach(entry => {
            const row = this.createJournalRow();
            const account = this.companyData.getAccountByCode(
                window.accountingSimulator.gameState.selectedCompany, 
                entry.account
            );
            
            if (account) {
                row.querySelector('.account-select').value = entry.account;
                row.querySelector('.entry-description').value = 
                    this.generateEntryDescription(account, entry);
                
                if (entry.debit > 0) {
                    row.querySelector('.entry-debit').value = entry.debit.toFixed(2);
                } else {
                    row.querySelector('.entry-credit').value = entry.credit.toFixed(2);
                }
            }
            
            tbody.appendChild(row);
        });
        
        // Add one empty row for additional entries
        this.addJournalRow();
        this.updateJournalTotals();
        this.updateTAccounts();
    }

    generateEntryDescription(account, entry) {
        const baseDescriptions = {
            '1001': entry.debit > 0 ? 'Cash received' : 'Cash paid',
            '1010': entry.debit > 0 ? 'Sale on account' : 'Payment received',
            '1020': entry.debit > 0 ? 'Inventory purchased' : 'Inventory sold',
            '4001': 'Sales revenue earned',
            '4002': 'Service revenue earned',
            '5001': 'Cost of goods sold',
            '5010': 'Wages paid to employees',
            '5020': 'Rent expense incurred',
            '5030': 'Utilities expense incurred'
        };
        
        return baseDescriptions[account.code] || `${account.name} transaction`;
    }

    displaySourceDocument(sourceDocument) {
        const container = document.querySelector('#document-viewer');
        if (container && sourceDocument) {
            container.innerHTML = sourceDocument.html;
            container.style.border = '1px solid var(--border-color)';
            container.style.padding = '1rem';
            container.style.borderRadius = 'var(--border-radius)';
        }
    }

    clearJournalForm() {
        const tbody = document.getElementById('journal-entry-rows');
        if (tbody) {
            tbody.innerHTML = '';
        }
        
        this.addJournalRow(); // Add initial row
        this.updateJournalTotals();
        this.updateTAccounts();
    }

    showJournalScreen() {
        if (window.accountingSimulator) {
            window.accountingSimulator.showScreen('journal');
        }
    }

    addJournalRow() {
        const tbody = document.getElementById('journal-entry-rows');
        if (!tbody) return;

        const row = this.createJournalRow();
        tbody.appendChild(row);
        
        // Focus on the first input
        setTimeout(() => {
            const firstSelect = row.querySelector('.account-select');
            if (firstSelect) firstSelect.focus();
        }, 100);
    }

    createJournalRow() {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <select class="account-select" required>
                    <option value="">Select Account...</option>
                    ${this.getAccountOptionsGrouped()}
                </select>
            </td>
            <td>
                <input type="text" class="entry-description" placeholder="Description" required>
            </td>
            <td>
                <input type="number" step="0.01" min="0" class="entry-debit" placeholder="0.00">
            </td>
            <td>
                <input type="number" step="0.01" min="0" class="entry-credit" placeholder="0.00">
            </td>
            <td>
                <button type="button" class="remove-row btn btn-outline" title="Remove row">×</button>
            </td>
        `;
        
        this.bindRowEvents(row);
        return row;
    }

    getAccountOptionsGrouped() {
        const selectedCompany = window.accountingSimulator?.gameState.selectedCompany;
        if (!selectedCompany) return '';
        
        const company = this.companyData.getCompany(selectedCompany);
        if (!company) return '';
        
        const chart = company.chartOfAccounts;
        
        let optionsHtml = '';
        
        const groups = [
            { name: 'Assets', accounts: chart.assets },
            { name: 'Liabilities', accounts: chart.liabilities },
            { name: 'Equity', accounts: chart.equity },
            { name: 'Revenue', accounts: chart.revenue },
            { name: 'Expenses', accounts: chart.expenses }
        ];
        
        groups.forEach(group => {
            if (group.accounts.length > 0) {
                optionsHtml += `<optgroup label="${group.name}">`;
                group.accounts.forEach(account => {
                    optionsHtml += `<option value="${account.code}">${account.code} - ${account.name}</option>`;
                });
                optionsHtml += '</optgroup>';
            }
        });
        
        return optionsHtml;
    }

    bindRowEvents(row) {
        const debitInput = row.querySelector('.entry-debit');
        const creditInput = row.querySelector('.entry-credit');
        const accountSelect = row.querySelector('.account-select');

        // Mutual exclusivity between debit and credit
        debitInput.addEventListener('input', () => {
            if (parseFloat(debitInput.value) > 0) {
                creditInput.value = '';
                creditInput.disabled = true;
            } else {
                creditInput.disabled = false;
            }
            this.updateJournalTotals();
            this.updateTAccounts();
            this.validateEntry();
        });

        creditInput.addEventListener('input', () => {
            if (parseFloat(creditInput.value) > 0) {
                debitInput.value = '';
                debitInput.disabled = true;
            } else {
                debitInput.disabled = false;
            }
            this.updateJournalTotals();
            this.updateTAccounts();
            this.validateEntry();
        });

        // Account selection updates
        accountSelect.addEventListener('change', () => {
            this.updateTAccounts();
            this.showAccountInfo(accountSelect);
            this.validateEntry();
        });

        // Auto-generate description based on account selection
        accountSelect.addEventListener('change', () => {
            const descriptionInput = row.querySelector('.entry-description');
            if (!descriptionInput.value && accountSelect.value) {
                const account = this.companyData.getAccountByCode(
                    window.accountingSimulator.gameState.selectedCompany, 
                    accountSelect.value
                );
                if (account) {
                    descriptionInput.value = this.generateDefaultDescription(account);
                }
            }
        });
    }

    generateDefaultDescription(account) {
        const descriptions = {
            'assets': account.name.includes('Cash') ? 'Cash transaction' : 
                     account.name.includes('Receivable') ? 'Amount receivable' :
                     account.name.includes('Inventory') ? 'Inventory transaction' : account.name,
            'liabilities': account.name.includes('Payable') ? 'Amount payable' : account.name,
            'equity': account.name,
            'revenue': 'Revenue earned',
            'expenses': 'Expense incurred'
        };
        
        // Determine account category
        let category = 'assets';
        if (account.code.startsWith('2')) category = 'liabilities';
        else if (account.code.startsWith('3')) category = 'equity';
        else if (account.code.startsWith('4')) category = 'revenue';
        else if (account.code.startsWith('5')) category = 'expenses';
        
        return descriptions[category] || account.name;
    }

    removeJournalRow(row) {
        if (document.querySelectorAll('#journal-entry-rows tr').length > 1) {
            row.remove();
            this.updateJournalTotals();
            this.updateTAccounts();
            this.validateEntry();
        } else {
            this.showToast('At least one row is required', 'warning');
        }
    }

    updateJournalTotals() {
        const rows = document.querySelectorAll('#journal-entry-rows tr');
        let totalDebits = 0;
        let totalCredits = 0;

        rows.forEach(row => {
            const debit = parseFloat(row.querySelector('.entry-debit').value) || 0;
            const credit = parseFloat(row.querySelector('.entry-credit').value) || 0;
            totalDebits += debit;
            totalCredits += credit;
        });

        // Update totals display
        const totalDebitsEl = document.getElementById('total-debits');
        const totalCreditsEl = document.getElementById('total-credits');
        const balanceStatusEl = document.getElementById('balance-status');
        
        if (totalDebitsEl) totalDebitsEl.textContent = totalDebits.toFixed(2);
        if (totalCreditsEl) totalCreditsEl.textContent = totalCredits.toFixed(2);

        // Update balance status
        const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;
        if (balanceStatusEl) {
            balanceStatusEl.textContent = isBalanced ? 'Balanced ✓' : 'Not Balanced';
            balanceStatusEl.className = `balance-indicator ${isBalanced ? 'balanced' : 'not-balanced'}`;
        }

        // Enable/disable post button
        const postButton = document.getElementById('post-entry');
        if (postButton) {
            postButton.disabled = !isBalanced || totalDebits === 0;
            postButton.textContent = isBalanced && totalDebits > 0 ? 'Post to Ledger' : 'Balance Required';
        }
    }

    updateTAccounts() {
        const container = document.getElementById('t-accounts-container');
        if (!container) return;

        // Get all accounts from current journal entry
        const rows = document.querySelectorAll('#journal-entry-rows tr');
        const affectedAccounts = new Map();

        rows.forEach(row => {
            const accountCode = row.querySelector('.account-select').value;
            const debitAmount = parseFloat(row.querySelector('.entry-debit').value) || 0;
            const creditAmount = parseFloat(row.querySelector('.entry-credit').value) || 0;

            if (accountCode && (debitAmount > 0 || creditAmount > 0)) {
                const account = this.companyData.getAccountByCode(
                    window.accountingSimulator.gameState.selectedCompany, 
                    accountCode
                );
                
                if (account) {
                    affectedAccounts.set(accountCode, {
                        account: account,
                        debit: debitAmount,
                        credit: creditAmount
                    });
                }
            }
        });

        // Clear and rebuild T-accounts
        container.innerHTML = '';
        
        affectedAccounts.forEach((data, accountCode) => {
            const tAccount = this.createTAccount(data.account, data.debit, data.credit);
            container.appendChild(tAccount);
        });
    }

    createTAccount(account, debitAmount, creditAmount) {
        const tAccount = document.createElement('div');
        tAccount.className = 't-account';
        
        // Calculate current balance (simplified - would need actual ledger data for real balance)
        const currentBalance = account.balance || 0;
        const newBalance = account.normalSide === 'debit' 
            ? currentBalance + debitAmount - creditAmount
            : currentBalance + creditAmount - debitAmount;

        tAccount.innerHTML = `
            <div class="t-account-header">
                ${account.code} - ${account.name}
                <small>(${account.normalSide === 'debit' ? 'Dr' : 'Cr'} normal)</small>
            </div>
            <div class="t-account-body">
                <div class="t-account-left">
                    <div class="t-account-title">Debits</div>
                    <div class="current-balance">Bal: ${account.normalSide === 'debit' && currentBalance > 0 ? currentBalance.toFixed(2) : ''}</div>
                    ${debitAmount > 0 ? `<div class="new-entry">${debitAmount.toFixed(2)}</div>` : ''}
                </div>
                <div class="t-account-right">
                    <div class="t-account-title">Credits</div>
                    <div class="current-balance">${account.normalSide === 'credit' && currentBalance > 0 ? currentBalance.toFixed(2) : ''}</div>
                    ${creditAmount > 0 ? `<div class="new-entry">${creditAmount.toFixed(2)}</div>` : ''}
                </div>
            </div>
            <div class="t-account-footer">
                New Balance: ${Math.abs(newBalance).toFixed(2)} ${newBalance >= 0 ? account.normalSide : (account.normalSide === 'debit' ? 'Cr' : 'Dr')}
            </div>
        `;

        return tAccount;
    }

    showAccountInfo(selectElement) {
        const accountCode = selectElement.value;
        if (!accountCode) return;

        const account = this.companyData.getAccountByCode(
            window.accountingSimulator.gameState.selectedCompany, 
            accountCode
        );
        
        if (account) {
            const info = this.getAccountInfo(account);
            this.showAccountTooltip(selectElement, info);
        }
    }

    getAccountInfo(account) {
        const typeDescriptions = {
            'current': 'Current Asset - Expected to be converted to cash within one year',
            'fixed': 'Fixed Asset - Long-term asset used in business operations',
            'current-liability': 'Current Liability - Must be paid within one year',
            'long-term': 'Long-term Liability - Due after one year',
            'equity': 'Owner\'s Equity - Owner\'s claim on business assets',
            'revenue': 'Revenue - Income earned from business operations',
            'expense': 'Expense - Costs incurred in business operations'
        };

        const normalSideExplanation = account.normalSide === 'debit' 
            ? 'Increases with debits, decreases with credits'
            : 'Increases with credits, decreases with debits';

        return {
            name: account.name,
            type: typeDescriptions[account.type] || account.type,
            normalSide: normalSideExplanation,
            currentBalance: `$${account.balance?.toFixed(2) || '0.00'}`
        };
    }

    showAccountTooltip(element, info) {
        // Simple tooltip implementation
        const existingTooltip = document.querySelector('.account-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }

        const tooltip = document.createElement('div');
        tooltip.className = 'account-tooltip';
        tooltip.innerHTML = `
            <strong>${info.name}</strong><br>
            ${info.type}<br>
            ${info.normalSide}<br>
            Current Balance: ${info.currentBalance}
        `;
        
        tooltip.style.cssText = `
            position: absolute;
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 0.75rem;
            font-size: 0.875rem;
            box-shadow: var(--shadow-md);
            z-index: 1000;
            max-width: 250px;
        `;

        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.bottom + 5}px`;

        setTimeout(() => {
            if (tooltip.parentElement) {
                tooltip.remove();
            }
        }, 5000);
    }

    validateEntry() {
        if (!this.currentEntry) return { isValid: false, errors: ['No entry in progress'] };

        const entry = this.buildEntryFromForm();
        const companyType = window.accountingSimulator.gameState.selectedCompany;
        const errors = [];

        Object.values(this.validationRules).forEach(rule => {
            if (!rule.validate(entry, companyType)) {
                errors.push(rule.name);
            }
        });

        return {
            isValid: errors.length === 0,
            errors: errors,
            entry: entry
        };
    }

    buildEntryFromForm() {
        const rows = document.querySelectorAll('#journal-entry-rows tr');
        const debits = [];
        const credits = [];

        rows.forEach(row => {
            const accountCode = row.querySelector('.account-select').value;
            const description = row.querySelector('.entry-description').value;
            const debitAmount = parseFloat(row.querySelector('.entry-debit').value) || 0;
            const creditAmount = parseFloat(row.querySelector('.entry-credit').value) || 0;

            if (accountCode && debitAmount > 0) {
                debits.push({
                    account: accountCode,
                    description: description,
                    amount: debitAmount
                });
            }

            if (accountCode && creditAmount > 0) {
                credits.push({
                    account: accountCode,
                    description: description,
                    amount: creditAmount
                });
            }
        });

        return {
            debits: debits,
            credits: credits
        };
    }

    postJournalEntry() {
        const validation = this.validateEntry();
        
        if (!validation.isValid) {
            this.showValidationErrors(validation.errors);
            return;
        }

        // Update current entry with form data
        this.currentEntry.date = document.getElementById('entry-date').value;
        this.currentEntry.reference = document.getElementById('entry-reference').value;
        this.currentEntry.debits = validation.entry.debits;
        this.currentEntry.credits = validation.entry.credits;
        this.currentEntry.status = 'posted';
        this.currentEntry.postedDate = new Date().toISOString();

        // Add to journal entries list
        this.journalEntries.push(this.currentEntry);

        // Show success message
        this.showToast('Journal entry posted successfully!', 'success');

        // Update game state
        if (window.accountingSimulator) {
            window.accountingSimulator.gameState.journalEntries.push(this.currentEntry);
            window.accountingSimulator.saveGameState();
        }

        // Clear form and prepare for next entry
        this.currentEntry = null;
        this.clearJournalForm();

        // Optionally navigate to ledger to see the posting
        setTimeout(() => {
            if (window.accountingSimulator) {
                window.accountingSimulator.showScreen('ledger');
            }
        }, 2000);
    }

    showValidationErrors(errors) {
        const errorMessage = `Please fix the following issues:\n${errors.map(error => `• ${error}`).join('\n')}`;
        this.showToast(errorMessage, 'error');
    }

    showToast(message, type = 'info') {
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
            alert(message);
        }
    }

    getJournalEntries() {
        return this.journalEntries;
    }

    getEntryById(id) {
        return this.journalEntries.find(entry => entry.id === id);
    }

    getEntriesByAccount(accountCode) {
        return this.journalEntries.filter(entry => 
            entry.debits.some(d => d.account === accountCode) ||
            entry.credits.some(c => c.account === accountCode)
        );
    }
}

// Export for use in other modules
window.JournalSystem = JournalSystem;