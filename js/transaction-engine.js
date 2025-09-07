// Transaction Engine - Generates realistic business transactions for 30-day simulation
class TransactionEngine {
    constructor(companyData) {
        this.companyData = companyData;
        this.transactionTemplates = this.initializeTransactionTemplates();
        this.sourceDocuments = this.initializeSourceDocuments();
    }

    initializeTransactionTemplates() {
        return {
            coffee: {
                week1: [
                    {
                        type: "cash_sale",
                        description: "Daily coffee and food sales",
                        accounts: ["1001", "4001", "4002"], // Cash, Coffee Sales, Food Sales
                        amount: { min: 150, max: 350 },
                        frequency: "daily"
                    },
                    {
                        type: "cash_purchase",
                        description: "Purchase coffee beans and supplies",
                        accounts: ["1020", "1021", "1001"], // Inventory, Supplies, Cash
                        amount: { min: 200, max: 500 },
                        frequency: "twice_weekly"
                    },
                    {
                        type: "expense_payment",
                        description: "Pay utilities bill",
                        accounts: ["5030", "1001"], // Utilities Expense, Cash
                        amount: { min: 75, max: 125 },
                        frequency: "weekly"
                    }
                ],
                week2: [
                    {
                        type: "credit_sale",
                        description: "Catering service on account",
                        accounts: ["1010", "4003"], // Accounts Receivable, Catering Revenue
                        amount: { min: 300, max: 800 },
                        frequency: "twice_weekly"
                    },
                    {
                        type: "collection",
                        description: "Collect payment from customer",
                        accounts: ["1001", "1010"], // Cash, Accounts Receivable
                        amount: { min: 200, max: 600 },
                        frequency: "weekly"
                    }
                ],
                week3: [
                    {
                        type: "payroll",
                        description: "Pay employee wages",
                        accounts: ["5010", "1001"], // Wages Expense, Cash
                        amount: { min: 800, max: 1200 },
                        frequency: "weekly"
                    },
                    {
                        type: "equipment_purchase",
                        description: "Purchase new espresso machine",
                        accounts: ["1100", "2001"], // Equipment, Accounts Payable
                        amount: { min: 2000, max: 3500 },
                        frequency: "once"
                    }
                ],
                week4: [
                    {
                        type: "rent_payment",
                        description: "Pay monthly rent",
                        accounts: ["5020", "1001"], // Rent Expense, Cash
                        amount: { min: 1500, max: 2000 },
                        frequency: "once"
                    },
                    {
                        type: "owner_withdrawal",
                        description: "Owner draws cash for personal use",
                        accounts: ["3002", "1001"], // Owner's Drawings, Cash
                        amount: { min: 500, max: 1000 },
                        frequency: "once"
                    }
                ]
            },
            tutoring: {
                week1: [
                    {
                        type: "cash_service",
                        description: "Tutoring sessions conducted for cash",
                        accounts: ["1001", "4001"], // Cash, Tutoring Revenue
                        amount: { min: 200, max: 400 },
                        frequency: "daily"
                    },
                    {
                        type: "supply_purchase",
                        description: "Purchase office supplies",
                        accounts: ["1020", "1001"], // Office Supplies, Cash
                        amount: { min: 50, max: 150 },
                        frequency: "weekly"
                    }
                ],
                week2: [
                    {
                        type: "credit_service",
                        description: "Tutoring services on account",
                        accounts: ["1010", "4001"], // Accounts Receivable, Tutoring Revenue
                        amount: { min: 300, max: 700 },
                        frequency: "twice_weekly"
                    },
                    {
                        type: "group_session",
                        description: "Group tutoring session",
                        accounts: ["1001", "4002"], // Cash, Group Session Revenue
                        amount: { min: 150, max: 300 },
                        frequency: "twice_weekly"
                    }
                ],
                week3: [
                    {
                        type: "tutor_payment",
                        description: "Pay tutors for services",
                        accounts: ["5010", "1001"], // Tutor Wages, Cash
                        amount: { min: 600, max: 1000 },
                        frequency: "weekly"
                    },
                    {
                        type: "rent_payment",
                        description: "Pay office rent",
                        accounts: ["5020", "1001"], // Rent Expense, Cash
                        amount: { min: 800, max: 1200 },
                        frequency: "weekly"
                    }
                ],
                week4: [
                    {
                        type: "insurance_payment",
                        description: "Pay professional liability insurance",
                        accounts: ["1040", "1001"], // Prepaid Insurance, Cash
                        amount: { min: 300, max: 500 },
                        frequency: "once"
                    }
                ]
            },
            retail: {
                week1: [
                    {
                        type: "cash_sale",
                        description: "Daily merchandise sales",
                        accounts: ["1001", "4001", "5001", "1020"], // Cash, Sales, COGS, Inventory
                        amount: { min: 400, max: 800 },
                        frequency: "daily"
                    },
                    {
                        type: "inventory_purchase",
                        description: "Purchase merchandise on account",
                        accounts: ["1020", "2001"], // Inventory, Accounts Payable
                        amount: { min: 1000, max: 2500 },
                        frequency: "twice_weekly"
                    }
                ],
                week2: [
                    {
                        type: "credit_sale",
                        description: "Sales to business customers on account",
                        accounts: ["1010", "4001", "5001", "1020"], // A/R, Sales, COGS, Inventory
                        amount: { min: 300, max: 1200 },
                        frequency: "twice_weekly"
                    },
                    {
                        type: "payment_to_vendor",
                        description: "Pay supplier for previous purchases",
                        accounts: ["2001", "1001"], // Accounts Payable, Cash
                        amount: { min: 800, max: 1500 },
                        frequency: "weekly"
                    }
                ],
                week3: [
                    {
                        type: "employee_wages",
                        description: "Pay employee salaries",
                        accounts: ["5010", "1001"], // Salaries, Cash
                        amount: { min: 1200, max: 1800 },
                        frequency: "weekly"
                    },
                    {
                        type: "sales_return",
                        description: "Customer returns merchandise",
                        accounts: ["4004", "2030", "1020", "5001"], // Returns, Cash, Inventory, COGS
                        amount: { min: 50, max: 200 },
                        frequency: "twice_weekly"
                    }
                ],
                week4: [
                    {
                        type: "rent_expense",
                        description: "Pay store rent",
                        accounts: ["5020", "1001"], // Rent Expense, Cash
                        amount: { min: 2000, max: 2500 },
                        frequency: "once"
                    },
                    {
                        type: "utilities",
                        description: "Pay store utilities",
                        accounts: ["5030", "1001"], // Utilities Expense, Cash
                        amount: { min: 200, max: 400 },
                        frequency: "once"
                    }
                ]
            }
        };
    }

    initializeSourceDocuments() {
        return {
            cash_sale: {
                type: "Cash Register Receipt",
                template: `
                    <div class="source-document receipt">
                        <h4>📧 CASH RECEIPT #{{receiptNumber}}</h4>
                        <div class="doc-header">
                            <strong>{{companyName}}</strong><br>
                            Date: {{date}}<br>
                            Time: {{time}}
                        </div>
                        <div class="doc-body">
                            <div class="line-items">
                                {{#items}}
                                <div class="item-line">
                                    <span>{{description}}</span>
                                    <span>${{amount}}</span>
                                </div>
                                {{/items}}
                            </div>
                            <div class="total-line">
                                <strong>Total: ${{total}}</strong>
                            </div>
                            <div class="payment-method">Payment: CASH</div>
                        </div>
                    </div>
                `
            },
            credit_sale: {
                type: "Sales Invoice",
                template: `
                    <div class="source-document invoice">
                        <h4>📄 SALES INVOICE #{{invoiceNumber}}</h4>
                        <div class="doc-header">
                            <div class="company-info">
                                <strong>{{companyName}}</strong><br>
                                {{address}}
                            </div>
                            <div class="invoice-info">
                                Date: {{date}}<br>
                                Due Date: {{dueDate}}<br>
                                Terms: {{terms}}
                            </div>
                        </div>
                        <div class="customer-info">
                            <strong>Bill To:</strong><br>
                            {{customerName}}<br>
                            {{customerAddress}}
                        </div>
                        <div class="doc-body">
                            <table class="invoice-table">
                                <tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr>
                                {{#items}}
                                <tr>
                                    <td>{{description}}</td>
                                    <td>{{quantity}}</td>
                                    <td>${{rate}}</td>
                                    <td>${{amount}}</td>
                                </tr>
                                {{/items}}
                            </table>
                            <div class="invoice-total">
                                <strong>Total Amount: ${{total}}</strong>
                            </div>
                        </div>
                    </div>
                `
            },
            cash_purchase: {
                type: "Purchase Receipt",
                template: `
                    <div class="source-document receipt">
                        <h4>🧾 PURCHASE RECEIPT</h4>
                        <div class="doc-header">
                            <strong>{{vendorName}}</strong><br>
                            {{vendorAddress}}<br>
                            Date: {{date}}<br>
                            Receipt #: {{receiptNumber}}
                        </div>
                        <div class="doc-body">
                            {{#items}}
                            <div class="item-line">
                                <span>{{description}} ({{quantity}})</span>
                                <span>${{amount}}</span>
                            </div>
                            {{/items}}
                            <div class="total-line">
                                <strong>Total Paid: ${{total}}</strong>
                            </div>
                            <div class="payment-method">Payment Method: CASH</div>
                        </div>
                    </div>
                `
            },
            expense_payment: {
                type: "Utility Bill",
                template: `
                    <div class="source-document bill">
                        <h4>⚡ UTILITY BILL</h4>
                        <div class="doc-header">
                            <strong>{{utilityCompany}}</strong><br>
                            Service Period: {{servicePeriod}}<br>
                            Bill Date: {{date}}<br>
                            Account #: {{accountNumber}}
                        </div>
                        <div class="service-address">
                            Service Address:<br>
                            {{serviceAddress}}
                        </div>
                        <div class="doc-body">
                            <div class="usage-summary">
                                <div class="charge-line">
                                    <span>{{serviceType}} Charges</span>
                                    <span>${{amount}}</span>
                                </div>
                                <div class="total-line">
                                    <strong>Total Amount Due: ${{total}}</strong>
                                </div>
                                <div class="due-date">Due Date: {{dueDate}}</div>
                            </div>
                        </div>
                    </div>
                `
            }
        };
    }

    generateDailyTransactions(companyType, day) {
        const week = Math.ceil(day / 7);
        const weekKey = `week${week}`;
        const templates = this.transactionTemplates[companyType]?.[weekKey] || [];
        
        const dayTransactions = [];
        
        templates.forEach(template => {
            if (this.shouldGenerateTransaction(template, day)) {
                const transaction = this.createTransaction(companyType, template, day);
                if (transaction) {
                    dayTransactions.push(transaction);
                }
            }
        });

        return dayTransactions;
    }

    shouldGenerateTransaction(template, day) {
        const dayOfWeek = ((day - 1) % 7) + 1; // 1 = Monday, 7 = Sunday
        
        switch (template.frequency) {
            case 'daily':
                return dayOfWeek <= 5; // Weekdays only
            case 'twice_weekly':
                return dayOfWeek === 2 || dayOfWeek === 4; // Tuesday and Thursday
            case 'weekly':
                return dayOfWeek === 1; // Monday
            case 'once':
                return day % 7 === 1; // Once per week on Monday
            default:
                return false;
        }
    }

    createTransaction(companyType, template, day) {
        const amount = this.generateRandomAmount(template.amount.min, template.amount.max);
        const transactionId = this.generateTransactionId(day);
        const date = this.calculateTransactionDate(day);
        
        const transaction = {
            id: transactionId,
            day: day,
            date: date,
            type: template.type,
            description: template.description,
            amount: amount,
            accounts: template.accounts,
            journalEntry: this.createJournalEntry(template, amount),
            sourceDocument: this.generateSourceDocument(companyType, template, amount, date, transactionId)
        };

        return transaction;
    }

    generateRandomAmount(min, max) {
        const amount = Math.random() * (max - min) + min;
        return Math.round(amount * 100) / 100; // Round to 2 decimal places
    }

    generateTransactionId(day) {
        const dayStr = day.toString().padStart(2, '0');
        const randomId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `T${dayStr}-${randomId}`;
    }

    calculateTransactionDate(day) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30 + day);
        return startDate.toLocaleDateString();
    }

    createJournalEntry(template, amount) {
        const entries = [];
        
        switch (template.type) {
            case 'cash_sale':
                entries.push(
                    { account: template.accounts[0], debit: amount, credit: 0 }, // Cash
                    { account: template.accounts[1], debit: 0, credit: amount * 0.7 }, // Coffee Sales
                    { account: template.accounts[2], debit: 0, credit: amount * 0.3 }  // Food Sales
                );
                break;
                
            case 'credit_sale':
                entries.push(
                    { account: template.accounts[0], debit: amount, credit: 0 }, // A/R
                    { account: template.accounts[1], debit: 0, credit: amount }  // Revenue
                );
                break;
                
            case 'cash_purchase':
                entries.push(
                    { account: template.accounts[0], debit: amount * 0.6, credit: 0 }, // Inventory
                    { account: template.accounts[1], debit: amount * 0.4, credit: 0 }, // Supplies
                    { account: template.accounts[2], debit: 0, credit: amount }        // Cash
                );
                break;
                
            case 'expense_payment':
                entries.push(
                    { account: template.accounts[0], debit: amount, credit: 0 }, // Expense
                    { account: template.accounts[1], debit: 0, credit: amount }  // Cash
                );
                break;
                
            case 'collection':
                entries.push(
                    { account: template.accounts[0], debit: amount, credit: 0 }, // Cash
                    { account: template.accounts[1], debit: 0, credit: amount }  // A/R
                );
                break;
                
            default:
                // Generic two-account entry
                if (template.accounts.length >= 2) {
                    entries.push(
                        { account: template.accounts[0], debit: amount, credit: 0 },
                        { account: template.accounts[1], debit: 0, credit: amount }
                    );
                }
        }
        
        return entries;
    }

    generateSourceDocument(companyType, template, amount, date, transactionId) {
        const docTemplate = this.sourceDocuments[template.type];
        if (!docTemplate) return null;

        const company = this.companyData.getCompany(companyType);
        const documentData = this.createDocumentData(company, template, amount, date, transactionId);
        
        return {
            type: docTemplate.type,
            html: this.populateTemplate(docTemplate.template, documentData),
            data: documentData
        };
    }

    createDocumentData(company, template, amount, date, transactionId) {
        const baseData = {
            companyName: company.name,
            date: date,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            total: amount.toFixed(2)
        };

        switch (template.type) {
            case 'cash_sale':
                return {
                    ...baseData,
                    receiptNumber: transactionId,
                    items: this.generateSaleItems(company.name, amount)
                };
                
            case 'credit_sale':
                return {
                    ...baseData,
                    invoiceNumber: transactionId,
                    address: "123 Business St, City, ST 12345",
                    dueDate: this.calculateDueDate(date, 30),
                    terms: "Net 30",
                    customerName: this.generateCustomerName(),
                    customerAddress: "456 Customer Ave, City, ST 12345",
                    items: this.generateInvoiceItems(company.name, amount)
                };
                
            case 'cash_purchase':
                return {
                    ...baseData,
                    receiptNumber: transactionId,
                    vendorName: this.generateVendorName(company.name),
                    vendorAddress: "789 Supplier Blvd, City, ST 12345",
                    items: this.generatePurchaseItems(company.name, amount)
                };
                
            case 'expense_payment':
                return {
                    ...baseData,
                    utilityCompany: "City Utilities Company",
                    servicePeriod: this.generateServicePeriod(date),
                    accountNumber: "ACCT-" + Math.floor(Math.random() * 1000000),
                    serviceAddress: "123 Business St, City, ST 12345",
                    serviceType: "Electricity",
                    amount: amount.toFixed(2),
                    dueDate: this.calculateDueDate(date, 15)
                };
                
            default:
                return baseData;
        }
    }

    generateSaleItems(companyName, totalAmount) {
        const items = [];
        
        if (companyName.includes('Coffee')) {
            const coffeeAmount = totalAmount * 0.7;
            const foodAmount = totalAmount * 0.3;
            items.push(
                { description: "Coffee & Beverages", amount: coffeeAmount.toFixed(2) },
                { description: "Food Items", amount: foodAmount.toFixed(2) }
            );
        } else if (companyName.includes('Tutoring')) {
            items.push(
                { description: "Tutoring Services", amount: totalAmount.toFixed(2) }
            );
        } else if (companyName.includes('Market')) {
            items.push(
                { description: "Merchandise Sales", amount: totalAmount.toFixed(2) }
            );
        }
        
        return items;
    }

    generateInvoiceItems(companyName, totalAmount) {
        const items = [];
        
        if (companyName.includes('Coffee')) {
            items.push({
                description: "Catering Services",
                quantity: 1,
                rate: totalAmount.toFixed(2),
                amount: totalAmount.toFixed(2)
            });
        } else if (companyName.includes('Tutoring')) {
            const hours = Math.ceil(totalAmount / 50);
            const rate = (totalAmount / hours).toFixed(2);
            items.push({
                description: "Private Tutoring Sessions",
                quantity: hours,
                rate: rate,
                amount: totalAmount.toFixed(2)
            });
        } else {
            items.push({
                description: "Merchandise Sales",
                quantity: 1,
                rate: totalAmount.toFixed(2),
                amount: totalAmount.toFixed(2)
            });
        }
        
        return items;
    }

    generatePurchaseItems(companyName, totalAmount) {
        const items = [];
        
        if (companyName.includes('Coffee')) {
            const beansAmount = totalAmount * 0.6;
            const suppliesAmount = totalAmount * 0.4;
            items.push(
                { description: "Coffee Beans", quantity: "10 lbs", amount: beansAmount.toFixed(2) },
                { description: "Supplies", quantity: "Various", amount: suppliesAmount.toFixed(2) }
            );
        } else if (companyName.includes('Tutoring')) {
            items.push(
                { description: "Office Supplies", quantity: "Various", amount: totalAmount.toFixed(2) }
            );
        } else {
            items.push(
                { description: "Merchandise Inventory", quantity: "Various", amount: totalAmount.toFixed(2) }
            );
        }
        
        return items;
    }

    calculateDueDate(dateString, daysToAdd) {
        const date = new Date(dateString);
        date.setDate(date.getDate() + daysToAdd);
        return date.toLocaleDateString();
    }

    generateServicePeriod(dateString) {
        const date = new Date(dateString);
        const startDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        const endDate = new Date(date.getFullYear(), date.getMonth(), 0);
        
        return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    }

    generateCustomerName() {
        const names = [
            "Johnson & Associates", "Smith Enterprises", "Brown Company",
            "Davis Corporation", "Wilson LLC", "Miller Group",
            "Taylor Solutions", "Anderson Services", "Thomas Industries"
        ];
        return names[Math.floor(Math.random() * names.length)];
    }

    generateVendorName(companyName) {
        if (companyName.includes('Coffee')) {
            const vendors = ["Premium Coffee Supply", "Bean There Wholesale", "Roasters United"];
            return vendors[Math.floor(Math.random() * vendors.length)];
        } else if (companyName.includes('Tutoring')) {
            const vendors = ["Office Supply Plus", "Educational Resources Inc", "Study Materials Co"];
            return vendors[Math.floor(Math.random() * vendors.length)];
        } else {
            const vendors = ["Wholesale Distributors", "Merchant Supply Co", "Retail Partners LLC"];
            return vendors[Math.floor(Math.random() * vendors.length)];
        }
    }

    populateTemplate(template, data) {
        let result = template;
        
        // Simple template substitution (basic Mustache-like syntax)
        Object.keys(data).forEach(key => {
            const placeholder = new RegExp(`{{${key}}}`, 'g');
            result = result.replace(placeholder, data[key] || '');
        });
        
        // Handle arrays (items)
        if (data.items && Array.isArray(data.items)) {
            const itemsRegex = /{{#items}}([\s\S]*?){{\/items}}/g;
            result = result.replace(itemsRegex, (match, itemTemplate) => {
                return data.items.map(item => {
                    let itemHtml = itemTemplate;
                    Object.keys(item).forEach(itemKey => {
                        const itemPlaceholder = new RegExp(`{{${itemKey}}}`, 'g');
                        itemHtml = itemHtml.replace(itemPlaceholder, item[itemKey] || '');
                    });
                    return itemHtml;
                }).join('');
            });
        }
        
        return result;
    }

    getTransactionAnalysis(transaction) {
        return {
            learningPoints: this.getTransactionLearningPoints(transaction.type),
            hints: this.getTransactionHints(transaction.type),
            commonMistakes: this.getCommonMistakes(transaction.type),
            accountsAffected: transaction.accounts.length,
            difficulty: this.getTransactionDifficulty(transaction.type)
        };
    }

    getTransactionLearningPoints(type) {
        const learningPoints = {
            cash_sale: [
                "Revenue is recognized when earned, regardless of payment timing",
                "Cash transactions are recorded immediately",
                "Multiple revenue accounts can be used for different product lines"
            ],
            credit_sale: [
                "Revenue is recognized even when cash is not received",
                "Accounts Receivable represents money owed by customers",
                "Credit sales increase both assets (A/R) and revenue"
            ],
            cash_purchase: [
                "Distinguish between expenses and assets when purchasing",
                "Inventory purchases are assets until sold",
                "Cash decreases when payments are made"
            ],
            expense_payment: [
                "Expenses are recorded when incurred",
                "Payment of expenses reduces cash",
                "Some expenses may be prepaid (assets) rather than immediate expenses"
            ]
        };
        
        return learningPoints[type] || [];
    }

    getTransactionHints(type) {
        const hints = {
            cash_sale: "Remember: Cash increases (debit) and Revenue increases (credit)",
            credit_sale: "Think: What asset increases? What revenue is earned?",
            cash_purchase: "Consider: Is this an expense or an asset purchase?",
            expense_payment: "Ask: What expense is incurred? What asset decreases?"
        };
        
        return hints[type] || "Analyze the transaction carefully.";
    }

    getCommonMistakes(type) {
        const mistakes = {
            cash_sale: [
                "Forgetting to debit Cash",
                "Confusing debit/credit rules for revenue",
                "Not splitting revenue between different product types"
            ],
            credit_sale: [
                "Crediting Cash instead of Accounts Receivable",
                "Forgetting that no cash is involved in credit sales",
                "Mixing up the timing of revenue recognition"
            ],
            cash_purchase: [
                "Recording inventory purchases as immediate expenses",
                "Forgetting to credit Cash",
                "Confusing assets with expenses"
            ],
            expense_payment: [
                "Crediting the wrong account",
                "Recording prepaid expenses as immediate expenses",
                "Forgetting the dual effect of transactions"
            ]
        };
        
        return mistakes[type] || [];
    }

    getTransactionDifficulty(type) {
        const difficulty = {
            cash_sale: "beginner",
            cash_purchase: "beginner",
            expense_payment: "beginner",
            credit_sale: "intermediate",
            collection: "intermediate",
            inventory_purchase: "intermediate",
            payroll: "advanced",
            adjusting_entry: "advanced"
        };
        
        return difficulty[type] || "intermediate";
    }
}

// Export for use in other modules
window.TransactionEngine = TransactionEngine;