// Financial Statements Builder
class StatementsBuilder {
    constructor(companyData, ledgerManager) {
        this.companyData = companyData;
        this.ledgerManager = ledgerManager;
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.tab-btn[data-statement]')) {
                this.switchStatement(e.target.dataset.statement);
            }
            
            if (e.target.matches('#export-statements')) {
                this.exportStatements();
            }
            
            if (e.target.matches('#analyze-statements')) {
                this.analyzeStatements();
            }
        });
    }

    switchStatement(statementType) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-statement="${statementType}"]`).classList.add('active');
        
        // Update content
        document.querySelectorAll('.statement-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${statementType}-statement`).classList.add('active');
        
        // Generate the statement
        switch (statementType) {
            case 'income':
                this.generateIncomeStatement();
                break;
            case 'balance':
                this.generateBalanceSheet();
                break;
            case 'cash-flow':
                this.generateCashFlowStatement();
                break;
        }
    }

    generateIncomeStatement() {
        if (!this.ledgerManager) return;
        
        const companyType = window.accountingSimulator?.gameState.selectedCompany;
        if (!companyType) return;

        const company = this.companyData.getCompany(companyType);
        const trialBalance = this.ledgerManager.getTrialBalance();
        
        // Update company name
        document.getElementById('company-name-income').textContent = company.name;
        document.getElementById('statement-date').textContent = new Date().toLocaleDateString();
        
        // Separate revenue and expense accounts
        const revenues = trialBalance.filter(item => item.code.startsWith('4'));
        const expenses = trialBalance.filter(item => item.code.startsWith('5'));
        
        let html = '<div class="statement-section">';
        html += '<div class="statement-section-title">REVENUES</div>';
        
        let totalRevenue = 0;
        revenues.forEach(item => {
            if (item.credit > 0) {
                html += `<div class="statement-line">
                    <span>${item.name}</span>
                    <span>$${item.credit.toFixed(2)}</span>
                </div>`;
                totalRevenue += item.credit;
            }
        });
        
        html += `<div class="statement-line total">
            <span>Total Revenue</span>
            <span>$${totalRevenue.toFixed(2)}</span>
        </div>`;
        html += '</div>';
        
        html += '<div class="statement-section">';
        html += '<div class="statement-section-title">EXPENSES</div>';
        
        let totalExpenses = 0;
        expenses.forEach(item => {
            if (item.debit > 0) {
                html += `<div class="statement-line">
                    <span>${item.name}</span>
                    <span>$${item.debit.toFixed(2)}</span>
                </div>`;
                totalExpenses += item.debit;
            }
        });
        
        html += `<div class="statement-line total">
            <span>Total Expenses</span>
            <span>$${totalExpenses.toFixed(2)}</span>
        </div>`;
        html += '</div>';
        
        const netIncome = totalRevenue - totalExpenses;
        html += `<div class="statement-section">
            <div class="statement-line total" style="border-top: 3px double;">
                <span><strong>NET ${netIncome >= 0 ? 'INCOME' : 'LOSS'}</strong></span>
                <span><strong>$${Math.abs(netIncome).toFixed(2)}</strong></span>
            </div>
        </div>`;
        
        document.getElementById('income-statement-body').innerHTML = html;
    }

    generateBalanceSheet() {
        if (!this.ledgerManager) return;
        
        const companyType = window.accountingSimulator?.gameState.selectedCompany;
        if (!companyType) return;

        const company = this.companyData.getCompany(companyType);
        const trialBalance = this.ledgerManager.getTrialBalance();
        
        // Update company name
        document.getElementById('company-name-balance').textContent = company.name;
        document.getElementById('balance-date').textContent = new Date().toLocaleDateString();
        
        let html = '';
        
        // Assets
        html += '<div class="statement-section">';
        html += '<div class="statement-section-title">ASSETS</div>';
        
        const assets = trialBalance.filter(item => item.code.startsWith('1'));
        let totalAssets = 0;
        
        assets.forEach(item => {
            const amount = item.debit - item.credit; // Net debit balance for assets
            if (amount !== 0) {
                html += `<div class="statement-line">
                    <span>${item.name}</span>
                    <span>$${Math.abs(amount).toFixed(2)}</span>
                </div>`;
                totalAssets += Math.abs(amount);
            }
        });
        
        html += `<div class="statement-line total">
            <span>Total Assets</span>
            <span>$${totalAssets.toFixed(2)}</span>
        </div>`;
        html += '</div>';
        
        // Liabilities
        html += '<div class="statement-section">';
        html += '<div class="statement-section-title">LIABILITIES</div>';
        
        const liabilities = trialBalance.filter(item => item.code.startsWith('2'));
        let totalLiabilities = 0;
        
        liabilities.forEach(item => {
            if (item.credit > 0) {
                html += `<div class="statement-line">
                    <span>${item.name}</span>
                    <span>$${item.credit.toFixed(2)}</span>
                </div>`;
                totalLiabilities += item.credit;
            }
        });
        
        html += `<div class="statement-line total">
            <span>Total Liabilities</span>
            <span>$${totalLiabilities.toFixed(2)}</span>
        </div>`;
        html += '</div>';
        
        // Equity
        html += '<div class="statement-section">';
        html += '<div class="statement-section-title">OWNER\'S EQUITY</div>';
        
        const equity = trialBalance.filter(item => item.code.startsWith('3'));
        let totalEquity = 0;
        
        equity.forEach(item => {
            const amount = item.credit - item.debit; // Net credit balance for equity
            if (amount !== 0) {
                html += `<div class="statement-line">
                    <span>${item.name}</span>
                    <span>$${Math.abs(amount).toFixed(2)}</span>
                </div>`;
                totalEquity += Math.abs(amount);
            }
        });
        
        html += `<div class="statement-line total">
            <span>Total Owner's Equity</span>
            <span>$${totalEquity.toFixed(2)}</span>
        </div>`;
        html += '</div>';
        
        html += `<div class="statement-section">
            <div class="statement-line total" style="border-top: 3px double;">
                <span><strong>TOTAL LIABILITIES & EQUITY</strong></span>
                <span><strong>$${(totalLiabilities + totalEquity).toFixed(2)}</strong></span>
            </div>
        </div>`;
        
        document.getElementById('balance-sheet-body').innerHTML = html;
    }

    generateCashFlowStatement() {
        const companyType = window.accountingSimulator?.gameState.selectedCompany;
        if (!companyType) return;

        const company = this.companyData.getCompany(companyType);
        
        // Update company name
        document.getElementById('company-name-cashflow').textContent = company.name;
        document.getElementById('cashflow-date').textContent = new Date().toLocaleDateString();
        
        // Simple cash flow statement (would need more detailed transaction analysis)
        let html = `
            <div class="statement-section">
                <div class="statement-section-title">CASH FLOWS FROM OPERATING ACTIVITIES</div>
                <div class="statement-line">
                    <span>Cash received from customers</span>
                    <span>$0.00</span>
                </div>
                <div class="statement-line">
                    <span>Cash paid to suppliers</span>
                    <span>($0.00)</span>
                </div>
                <div class="statement-line total">
                    <span>Net cash from operating activities</span>
                    <span>$0.00</span>
                </div>
            </div>
            
            <div class="statement-section">
                <div class="statement-section-title">CASH FLOWS FROM INVESTING ACTIVITIES</div>
                <div class="statement-line">
                    <span>Purchase of equipment</span>
                    <span>($0.00)</span>
                </div>
                <div class="statement-line total">
                    <span>Net cash from investing activities</span>
                    <span>($0.00)</span>
                </div>
            </div>
            
            <div class="statement-section">
                <div class="statement-section-title">CASH FLOWS FROM FINANCING ACTIVITIES</div>
                <div class="statement-line">
                    <span>Owner contributions</span>
                    <span>$0.00</span>
                </div>
                <div class="statement-line">
                    <span>Owner withdrawals</span>
                    <span>($0.00)</span>
                </div>
                <div class="statement-line total">
                    <span>Net cash from financing activities</span>
                    <span>$0.00</span>
                </div>
            </div>
            
            <div class="statement-section">
                <div class="statement-line total" style="border-top: 3px double;">
                    <span><strong>NET INCREASE IN CASH</strong></span>
                    <span><strong>$0.00</strong></span>
                </div>
                <div class="statement-line">
                    <span>Cash at beginning of period</span>
                    <span>$0.00</span>
                </div>
                <div class="statement-line total">
                    <span><strong>CASH AT END OF PERIOD</strong></span>
                    <span><strong>$0.00</strong></span>
                </div>
            </div>
        `;
        
        document.getElementById('cash-flow-body').innerHTML = html;
    }

    exportStatements() {
        this.showToast('Statement export feature coming soon!', 'info');
    }

    analyzeStatements() {
        this.showToast('Financial analysis feature coming soon!', 'info');
    }

    showToast(message, type = 'info') {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                text: message,
                icon: type,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        }
    }
}

window.StatementsBuilder = StatementsBuilder;