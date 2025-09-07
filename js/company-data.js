// Company Data - Chart of Accounts and Business Information
class CompanyData {
    constructor() {
        this.companies = {
            coffee: {
                name: "Campus Coffee Shop",
                description: "A cozy coffee shop serving students and faculty on campus",
                industry: "Food Service",
                startingBalances: {
                    cash: 15000,
                    inventory: 3500,
                    equipment: 25000,
                    accountsPayable: 2500,
                    ownerEquity: 41000
                },
                chartOfAccounts: {
                    assets: [
                        { code: "1001", name: "Cash", type: "current", normalSide: "debit", balance: 15000 },
                        { code: "1010", name: "Accounts Receivable", type: "current", normalSide: "debit", balance: 0 },
                        { code: "1020", name: "Inventory - Coffee Beans", type: "current", normalSide: "debit", balance: 2000 },
                        { code: "1021", name: "Inventory - Supplies", type: "current", normalSide: "debit", balance: 1500 },
                        { code: "1030", name: "Prepaid Rent", type: "current", normalSide: "debit", balance: 0 },
                        { code: "1040", name: "Prepaid Insurance", type: "current", normalSide: "debit", balance: 0 },
                        { code: "1100", name: "Equipment", type: "fixed", normalSide: "debit", balance: 25000 },
                        { code: "1101", name: "Accumulated Depreciation - Equipment", type: "fixed", normalSide: "credit", balance: 0 }
                    ],
                    liabilities: [
                        { code: "2001", name: "Accounts Payable", type: "current", normalSide: "credit", balance: 2500 },
                        { code: "2010", name: "Wages Payable", type: "current", normalSide: "credit", balance: 0 },
                        { code: "2020", name: "Interest Payable", type: "current", normalSide: "credit", balance: 0 },
                        { code: "2030", name: "Unearned Revenue", type: "current", normalSide: "credit", balance: 0 },
                        { code: "2100", name: "Notes Payable", type: "long-term", normalSide: "credit", balance: 0 }
                    ],
                    equity: [
                        { code: "3001", name: "Owner's Capital", type: "equity", normalSide: "credit", balance: 41000 },
                        { code: "3002", name: "Owner's Drawings", type: "equity", normalSide: "debit", balance: 0 },
                        { code: "3003", name: "Retained Earnings", type: "equity", normalSide: "credit", balance: 0 }
                    ],
                    revenue: [
                        { code: "4001", name: "Coffee Sales", type: "revenue", normalSide: "credit", balance: 0 },
                        { code: "4002", name: "Food Sales", type: "revenue", normalSide: "credit", balance: 0 },
                        { code: "4003", name: "Catering Revenue", type: "revenue", normalSide: "credit", balance: 0 }
                    ],
                    expenses: [
                        { code: "5001", name: "Cost of Goods Sold", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5010", name: "Wages Expense", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5020", name: "Rent Expense", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5030", name: "Utilities Expense", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5040", name: "Insurance Expense", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5050", name: "Depreciation Expense", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5060", name: "Supplies Expense", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5070", name: "Advertising Expense", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5080", name: "Interest Expense", type: "expense", normalSide: "debit", balance: 0 }
                    ]
                }
            },
            tutoring: {
                name: "Smart Tutoring Services",
                description: "Educational tutoring service providing personalized academic support",
                industry: "Education Services",
                startingBalances: {
                    cash: 8000,
                    accountsReceivable: 2500,
                    equipment: 12000,
                    accountsPayable: 1500,
                    ownerEquity: 21000
                },
                chartOfAccounts: {
                    assets: [
                        { code: "1001", name: "Cash", type: "current", normalSide: "debit", balance: 8000 },
                        { code: "1010", name: "Accounts Receivable", type: "current", normalSide: "debit", balance: 2500 },
                        { code: "1020", name: "Office Supplies", type: "current", normalSide: "debit", balance: 800 },
                        { code: "1030", name: "Prepaid Rent", type: "current", normalSide: "debit", balance: 0 },
                        { code: "1040", name: "Prepaid Insurance", type: "current", normalSide: "debit", balance: 0 },
                        { code: "1100", name: "Computer Equipment", type: "fixed", normalSide: "debit", balance: 8000 },
                        { code: "1101", name: "Accumulated Depreciation - Equipment", type: "fixed", normalSide: "credit", balance: 0 },
                        { code: "1110", name: "Furniture & Fixtures", type: "fixed", normalSide: "debit", balance: 4000 },
                        { code: "1111", name: "Accumulated Depreciation - Furniture", type: "fixed", normalSide: "credit", balance: 0 }
                    ],
                    liabilities: [
                        { code: "2001", name: "Accounts Payable", type: "current", normalSide: "credit", balance: 1500 },
                        { code: "2010", name: "Wages Payable", type: "current", normalSide: "credit", balance: 0 },
                        { code: "2020", name: "Interest Payable", type: "current", normalSide: "credit", balance: 0 },
                        { code: "2030", name: "Unearned Tutoring Revenue", type: "current", normalSide: "credit", balance: 0 },
                        { code: "2040", name: "Payroll Taxes Payable", type: "current", normalSide: "credit", balance: 0 }
                    ],
                    equity: [
                        { code: "3001", name: "Owner's Capital", type: "equity", normalSide: "credit", balance: 21000 },
                        { code: "3002", name: "Owner's Drawings", type: "equity", normalSide: "debit", balance: 0 },
                        { code: "3003", name: "Retained Earnings", type: "equity", normalSide: "credit", balance: 0 }
                    ],
                    revenue: [
                        { code: "4001", name: "Tutoring Revenue", type: "revenue", normalSide: "credit", balance: 0 },
                        { code: "4002", name: "Group Session Revenue", type: "revenue", normalSide: "credit", balance: 0 },
                        { code: "4003", name: "Online Course Revenue", type: "revenue", normalSide: "credit", balance: 0 }
                    ],
                    expenses: [
                        { code: "5010", name: "Tutor Wages", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5020", name: "Rent Expense", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5030", name: "Utilities Expense", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5040", name: "Insurance Expense", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5050", name: "Depreciation Expense", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5060", name: "Office Supplies Expense", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5070", name: "Marketing Expense", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5080", name: "Professional Development", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5090", name: "Payroll Tax Expense", type: "expense", normalSide: "debit", balance: 0 }
                    ]
                }
            },
            retail: {
                name: "Corner Market Store",
                description: "Local retail store offering everyday essentials and convenience items",
                industry: "Retail Trade",
                startingBalances: {
                    cash: 12000,
                    inventory: 18000,
                    equipment: 35000,
                    accountsPayable: 8500,
                    ownerEquity: 56500
                },
                chartOfAccounts: {
                    assets: [
                        { code: "1001", name: "Cash", type: "current", normalSide: "debit", balance: 12000 },
                        { code: "1010", name: "Accounts Receivable", type: "current", normalSide: "debit", balance: 0 },
                        { code: "1020", name: "Merchandise Inventory", type: "current", normalSide: "debit", balance: 18000 },
                        { code: "1030", name: "Store Supplies", type: "current", normalSide: "debit", balance: 1200 },
                        { code: "1040", name: "Prepaid Rent", type: "current", normalSide: "debit", balance: 0 },
                        { code: "1050", name: "Prepaid Insurance", type: "current", normalSide: "debit", balance: 0 },
                        { code: "1100", name: "Store Equipment", type: "fixed", normalSide: "debit", balance: 20000 },
                        { code: "1101", name: "Accumulated Depreciation - Store Equipment", type: "fixed", normalSide: "credit", balance: 0 },
                        { code: "1110", name: "Point of Sale System", type: "fixed", normalSide: "debit", balance: 8000 },
                        { code: "1111", name: "Accumulated Depreciation - POS System", type: "fixed", normalSide: "credit", balance: 0 },
                        { code: "1120", name: "Store Fixtures", type: "fixed", normalSide: "debit", balance: 7000 },
                        { code: "1121", name: "Accumulated Depreciation - Fixtures", type: "fixed", normalSide: "credit", balance: 0 }
                    ],
                    liabilities: [
                        { code: "2001", name: "Accounts Payable", type: "current", normalSide: "credit", balance: 8500 },
                        { code: "2010", name: "Wages Payable", type: "current", normalSide: "credit", balance: 0 },
                        { code: "2020", name: "Interest Payable", type: "current", normalSide: "credit", balance: 0 },
                        { code: "2030", name: "Sales Tax Payable", type: "current", normalSide: "credit", balance: 0 },
                        { code: "2040", name: "Customer Deposits", type: "current", normalSide: "credit", balance: 0 },
                        { code: "2100", name: "Notes Payable", type: "long-term", normalSide: "credit", balance: 0 }
                    ],
                    equity: [
                        { code: "3001", name: "Owner's Capital", type: "equity", normalSide: "credit", balance: 56500 },
                        { code: "3002", name: "Owner's Drawings", type: "equity", normalSide: "debit", balance: 0 },
                        { code: "3003", name: "Retained Earnings", type: "equity", normalSide: "credit", balance: 0 }
                    ],
                    revenue: [
                        { code: "4001", name: "Merchandise Sales", type: "revenue", normalSide: "credit", balance: 0 },
                        { code: "4002", name: "Service Revenue", type: "revenue", normalSide: "credit", balance: 0 },
                        { code: "4003", name: "Sales Discounts", type: "contra-revenue", normalSide: "debit", balance: 0 },
                        { code: "4004", name: "Sales Returns and Allowances", type: "contra-revenue", normalSide: "debit", balance: 0 }
                    ],
                    expenses: [
                        { code: "5001", name: "Cost of Goods Sold", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5010", name: "Salaries and Wages", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5020", name: "Rent Expense", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5030", name: "Utilities Expense", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5040", name: "Insurance Expense", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5050", name: "Depreciation Expense", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5060", name: "Store Supplies Expense", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5070", name: "Advertising Expense", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5080", name: "Interest Expense", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5090", name: "Bad Debt Expense", type: "expense", normalSide: "debit", balance: 0 },
                        { code: "5100", name: "Miscellaneous Expense", type: "expense", normalSide: "debit", balance: 0 }
                    ]
                }
            }
        };
    }

    getCompany(type) {
        return this.companies[type] || null;
    }

    getAllCompanies() {
        return Object.keys(this.companies).map(key => ({
            type: key,
            ...this.companies[key]
        }));
    }

    getChartOfAccounts(companyType) {
        const company = this.getCompany(companyType);
        if (!company) return null;
        
        return company.chartOfAccounts;
    }

    getAllAccounts(companyType) {
        const chart = this.getChartOfAccounts(companyType);
        if (!chart) return [];

        const allAccounts = [];
        Object.values(chart).forEach(category => {
            allAccounts.push(...category);
        });

        return allAccounts.sort((a, b) => a.code.localeCompare(b.code));
    }

    getAccountByCode(companyType, code) {
        const accounts = this.getAllAccounts(companyType);
        return accounts.find(account => account.code === code) || null;
    }

    getAccountsByType(companyType, type) {
        const chart = this.getChartOfAccounts(companyType);
        if (!chart || !chart[type]) return [];
        
        return chart[type];
    }

    calculateAccountBalance(account, transactions = []) {
        let balance = account.balance || 0;
        
        transactions.forEach(transaction => {
            if (transaction.account === account.code) {
                if (account.normalSide === 'debit') {
                    balance += transaction.debit - transaction.credit;
                } else {
                    balance += transaction.credit - transaction.debit;
                }
            }
        });

        return balance;
    }

    validateAccountingEquation(companyType, transactions = []) {
        const accounts = this.getAllAccounts(companyType);
        let assets = 0, liabilities = 0, equity = 0;

        accounts.forEach(account => {
            const balance = this.calculateAccountBalance(account, transactions);
            
            if (account.type === 'current' || account.type === 'fixed') {
                assets += (account.normalSide === 'debit') ? balance : -balance;
            } else if (account.type === 'current' && (account.code.startsWith('2'))) {
                liabilities += (account.normalSide === 'credit') ? balance : -balance;
            } else if (account.type === 'equity') {
                equity += (account.normalSide === 'credit') ? balance : -balance;
            }
        });

        return {
            assets,
            liabilities,
            equity,
            balanced: Math.abs(assets - (liabilities + equity)) < 0.01
        };
    }

    createInitialBalanceSheet(companyType) {
        const company = this.getCompany(companyType);
        if (!company) return null;

        const chart = company.chartOfAccounts;
        
        return {
            companyName: company.name,
            date: new Date().toLocaleDateString(),
            assets: {
                current: chart.assets.filter(a => a.type === 'current'),
                fixed: chart.assets.filter(a => a.type === 'fixed')
            },
            liabilities: {
                current: chart.liabilities.filter(l => l.type === 'current'),
                longTerm: chart.liabilities.filter(l => l.type === 'long-term')
            },
            equity: chart.equity
        };
    }

    getBusinessScenarios(companyType) {
        const scenarios = {
            coffee: {
                week1: [
                    {
                        day: 1,
                        title: "Opening Day Sales",
                        description: "First day of business with cash sales",
                        objectives: ["Record cash sales transactions", "Understand revenue recognition"]
                    },
                    {
                        day: 2,
                        title: "Supply Purchase",
                        description: "Purchase coffee beans and supplies with cash",
                        objectives: ["Record cash purchases", "Understand expense vs. asset classification"]
                    }
                ],
                week2: [
                    {
                        day: 8,
                        title: "Credit Sales Introduction",
                        description: "Start offering credit to regular customers",
                        objectives: ["Record credit sales", "Understand accounts receivable"]
                    }
                ]
            },
            tutoring: {
                week1: [
                    {
                        day: 1,
                        title: "First Tutoring Sessions",
                        description: "Conducted multiple tutoring sessions for cash",
                        objectives: ["Record service revenue", "Understand cash basis transactions"]
                    }
                ]
            },
            retail: {
                week1: [
                    {
                        day: 1,
                        title: "Store Opening",
                        description: "Grand opening with merchandise sales",
                        objectives: ["Record retail sales", "Understand cost of goods sold"]
                    }
                ]
            }
        };

        return scenarios[companyType] || {};
    }

    getLearningObjectives(companyType) {
        const objectives = {
            coffee: [
                "Understanding cash vs. accrual accounting in a service business",
                "Recording inventory purchases and usage",
                "Managing simple payroll transactions",
                "Calculating and recording depreciation",
                "Preparing basic financial statements"
            ],
            tutoring: [
                "Recording service revenue and accounts receivable",
                "Managing prepaid and accrued expenses",
                "Understanding payroll and payroll taxes",
                "Recording professional service transactions",
                "Analyzing service business profitability"
            ],
            retail: [
                "Understanding perpetual inventory systems",
                "Recording cost of goods sold transactions",
                "Managing accounts receivable and payable",
                "Understanding sales tax collection and remittance",
                "Preparing retail financial statements"
            ]
        };

        return objectives[companyType] || [];
    }
}

// Export for use in other modules
window.CompanyData = CompanyData;