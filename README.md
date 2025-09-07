# Accounting Cycle Simulator

An interactive web-based educational application that guides introductory accounting students through a complete month of business operations. Students experience every step of the accounting cycle from analyzing source documents through preparing financial statements.

## Features

### 🏢 Virtual Company Experience
- Choose from three business types:
  - **Campus Coffee Shop** - Service business with inventory
  - **Smart Tutoring Services** - Professional service business
  - **Corner Market Store** - Retail business with complex inventory

### 📝 Interactive Learning System
- **Daily Transactions** - 30 days of realistic business scenarios
- **Source Documents** - Authentic invoices, receipts, and bills
- **Journal Entry Builder** - Guided transaction recording with validation
- **T-Accounts Visualization** - Real-time visual feedback
- **General Ledger** - Automatic posting and balance tracking

### 📊 Financial Reporting
- **Trial Balance** - Automated generation with error checking
- **Income Statement** - Multi-step format with analysis
- **Balance Sheet** - Classified format with equation verification
- **Statement of Cash Flows** - Basic cash flow categorization

### 🎯 Progress Tracking
- **Skill Mastery System** - Track learning progress across 15 concepts
- **Achievement System** - Gamified learning with badges and milestones
- **Performance Analytics** - Accuracy tracking and mistake pattern analysis
- **Adaptive Hints** - Context-sensitive help based on performance

## Getting Started

1. **Open the Application**
   - Simply open `index.html` in any modern web browser
   - No server setup required - runs entirely in the browser

2. **Take the Tutorial (Recommended)**
   - Click "Take Tutorial" on the welcome screen
   - Learn the interface and navigation system

3. **Choose Your Company**
   - Select one of three business types based on your learning goals
   - Review the chart of accounts and starting balances

4. **Begin the 30-Day Simulation**
   - Work through daily business transactions
   - Analyze source documents and create journal entries
   - Progress through the complete accounting cycle

## Educational Workflow

### Week 1: Basic Cash Transactions
- Daily cash sales and purchases
- Expense payments and owner transactions
- Focus: Understanding cash vs. accrual concepts

### Week 2: Credit Transactions
- Credit sales with accounts receivable
- Credit purchases with accounts payable
- Collections and payments to vendors
- Focus: Timing differences and credit impacts

### Week 3: Complex Operations
- Inventory management and cost of goods sold
- Payroll transactions and liabilities
- Equipment purchases and depreciation
- Focus: Matching principle and asset/liability management

### Week 4: Month-End Activities
- Adjusting entries (accruals, deferrals, depreciation)
- Trial balance preparation and error correction
- Financial statement preparation and analysis
- Focus: Complete cycle integration and reporting

## Technical Features

- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Local Storage** - Automatic progress saving
- **Accessibility** - Screen reader compatible with semantic HTML
- **Modern Web Standards** - HTML5, CSS3, ES6+ JavaScript

## Browser Compatibility

- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Mobile browsers on iOS/Android

## Learning Objectives

By completing the simulation, students will:

1. **Master the Accounting Equation** - Understand how every transaction affects Assets = Liabilities + Equity
2. **Apply Double-Entry Bookkeeping** - Record transactions with balanced debits and credits
3. **Navigate the Accounting Cycle** - Complete all steps from transaction analysis to financial statements
4. **Analyze Business Transactions** - Identify account effects and proper classification
5. **Prepare Financial Statements** - Create income statements, balance sheets, and cash flow statements
6. **Understand Accrual Accounting** - Distinguish between cash and accrual basis accounting
7. **Handle Adjusting Entries** - Record month-end adjustments for proper matching
8. **Interpret Financial Information** - Analyze business performance using financial data

## Educational Benefits

### For Students
- **Hands-on Practice** - Learn by doing real business transactions
- **Immediate Feedback** - Instant validation and error correction
- **Visual Learning** - T-accounts and animations help visualize concepts
- **Self-Paced** - Work at your own speed with automatic progress saving
- **Gamified Experience** - Achievements and progress tracking increase engagement

### For Instructors
- **Comprehensive Coverage** - All major accounting cycle topics included
- **Standardized Learning** - Consistent experience across all students
- **Progress Monitoring** - Built-in analytics for student performance
- **Flexible Implementation** - Can supplement textbook or serve as primary learning tool

## File Structure

```
accounting-simulator/
├── index.html              # Main application file
├── css/
│   └── styles.css          # Responsive styling and animations
├── js/
│   ├── app.js              # Main application controller
│   ├── company-data.js     # Chart of accounts and business data
│   ├── transaction-engine.js # Transaction generation system
│   ├── journal-system.js   # Journal entry and T-accounts
│   ├── ledger-manager.js   # General ledger operations
│   ├── statements-builder.js # Financial statement preparation
│   ├── progress-tracker.js # Learning progress and achievements
│   └── storage-manager.js  # Local storage operations
└── README.md               # This file
```

## Customization

The application is designed to be easily customizable:

1. **Add New Companies** - Modify `company-data.js` to include additional business types
2. **Extend Transactions** - Add new transaction types in `transaction-engine.js`
3. **Customize Styling** - Update CSS variables in `styles.css` for different themes
4. **Add Languages** - All text is in separate variables for easy translation

## Support and Feedback

This is an open educational resource designed to enhance accounting education. For technical issues or educational feedback, please refer to the development documentation or contact your instructor.

## Version History

- **v1.0** - Initial release with complete 30-day simulation
  - Three business types with realistic transactions
  - Complete accounting cycle from journal to statements
  - Progress tracking and achievement system
  - Responsive design for all devices

---

**Educational Use License**: This application is designed for educational purposes. Students and instructors are free to use, modify, and distribute this tool for non-commercial educational activities.