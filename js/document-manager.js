// Document Manager - Handles document upload and analysis
class DocumentManager {
    constructor(companyData, transactionEngine) {
        this.companyData = companyData;
        this.transactionEngine = transactionEngine;
        this.uploadedFiles = new Map();
        this.currentDocument = null;
        this.bindEvents();
    }

    bindEvents() {
        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.matches('.upload-tab-btn')) {
                this.switchTab(e.target.dataset.tab);
            }

            // Scenario loading
            if (e.target.matches('#load-scenario')) {
                this.loadSelectedScenario();
            }

            // File upload
            if (e.target.matches('#upload-dropzone') || e.target.matches('#upload-dropzone *')) {
                document.getElementById('file-input').click();
            }

            // Analysis buttons
            if (e.target.matches('#extract-text')) {
                this.extractTextFromDocument();
            }
            
            if (e.target.matches('#identify-accounts')) {
                this.identifyAccountsInDocument();
            }
            
            if (e.target.matches('#suggest-amounts')) {
                this.suggestAmountsFromDocument();
            }

            // File actions
            if (e.target.matches('.file-action-btn.remove')) {
                const fileId = e.target.dataset.fileId;
                this.removeUploadedFile(fileId);
            }
            
            if (e.target.matches('.file-action-btn.view')) {
                const fileId = e.target.dataset.fileId;
                this.viewUploadedFile(fileId);
            }
        });

        // File input change
        document.addEventListener('change', (e) => {
            if (e.target.matches('#file-input')) {
                this.handleFileSelection(e.target.files);
            }
            
            if (e.target.matches('#scenario-select')) {
                this.previewSelectedScenario();
            }
        });

        // Drag and drop functionality
        const dropzone = document.getElementById('upload-dropzone');
        if (dropzone) {
            dropzone.addEventListener('dragover', this.handleDragOver.bind(this));
            dropzone.addEventListener('dragleave', this.handleDragLeave.bind(this));
            dropzone.addEventListener('drop', this.handleDrop.bind(this));
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.upload-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.upload-tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-documents`);
        });

        // Initialize tab-specific content
        if (tabName === 'generated') {
            this.populateScenarioSelector();
        }
    }

    populateScenarioSelector() {
        const select = document.getElementById('scenario-select');
        if (!select || !window.accountingSimulator?.gameState.selectedCompany) return;

        const companyType = window.accountingSimulator.gameState.selectedCompany;
        
        // Clear existing options
        select.innerHTML = '<option value="">Choose a scenario...</option>';

        // Generate scenarios for current day
        const currentDay = window.accountingSimulator.gameState.currentDay;
        const scenarios = this.generateScenarioOptions(companyType, currentDay);

        scenarios.forEach(scenario => {
            const option = document.createElement('option');
            option.value = JSON.stringify(scenario);
            option.textContent = `Day ${scenario.day}: ${scenario.title}`;
            select.appendChild(option);
        });
    }

    generateScenarioOptions(companyType, currentDay) {
        const scenarios = [
            {
                day: currentDay,
                title: "Daily Cash Sales",
                type: "cash_sale",
                description: "Process daily cash sales transactions"
            },
            {
                day: currentDay,
                title: "Vendor Invoice Payment", 
                type: "cash_purchase",
                description: "Pay supplier invoice with cash"
            },
            {
                day: currentDay,
                title: "Utility Bill Payment",
                type: "expense_payment", 
                description: "Pay monthly utility expenses"
            },
            {
                day: currentDay,
                title: "Customer Invoice",
                type: "credit_sale",
                description: "Invoice customer for services on account"
            },
            {
                day: currentDay,
                title: "Inventory Purchase",
                type: "inventory_purchase",
                description: "Purchase inventory on credit"
            }
        ];

        return scenarios;
    }

    previewSelectedScenario() {
        const select = document.getElementById('scenario-select');
        if (!select.value) return;

        try {
            const scenario = JSON.parse(select.value);
            this.displayScenarioPreview(scenario);
        } catch (error) {
            console.error('Failed to parse scenario:', error);
        }
    }

    loadSelectedScenario() {
        const select = document.getElementById('scenario-select');
        if (!select.value) {
            this.showToast('Please select a scenario first', 'warning');
            return;
        }

        try {
            const scenario = JSON.parse(select.value);
            this.generateScenarioDocument(scenario);
        } catch (error) {
            console.error('Failed to load scenario:', error);
            this.showToast('Failed to load scenario', 'error');
        }
    }

    displayScenarioPreview(scenario) {
        const viewer = document.getElementById('document-viewer');
        if (!viewer) return;

        viewer.innerHTML = `
            <div class="scenario-preview">
                <h4>${scenario.title}</h4>
                <p class="scenario-description">${scenario.description}</p>
                <div class="scenario-details">
                    <div class="detail-item">
                        <strong>Transaction Type:</strong> ${this.formatTransactionType(scenario.type)}
                    </div>
                    <div class="detail-item">
                        <strong>Day:</strong> ${scenario.day}
                    </div>
                    <div class="detail-item">
                        <strong>Learning Focus:</strong> ${this.getTransactionFocus(scenario.type)}
                    </div>
                </div>
                <div class="scenario-note">
                    <small><em>Click "Load Scenario" to generate a realistic source document for this transaction.</em></small>
                </div>
            </div>
        `;
    }

    formatTransactionType(type) {
        const types = {
            'cash_sale': 'Cash Sale',
            'credit_sale': 'Credit Sale', 
            'cash_purchase': 'Cash Purchase',
            'expense_payment': 'Expense Payment',
            'inventory_purchase': 'Inventory Purchase'
        };
        return types[type] || type;
    }

    getTransactionFocus(type) {
        const focuses = {
            'cash_sale': 'Revenue recognition and cash receipts',
            'credit_sale': 'Accounts receivable and revenue recognition',
            'cash_purchase': 'Asset vs. expense classification',
            'expense_payment': 'Expense recognition and cash payments',
            'inventory_purchase': 'Inventory management and accounts payable'
        };
        return focuses[type] || 'General transaction analysis';
    }

    generateScenarioDocument(scenario) {
        if (!this.transactionEngine) {
            this.showToast('Transaction engine not available', 'error');
            return;
        }

        const companyType = window.accountingSimulator?.gameState.selectedCompany;
        if (!companyType) {
            this.showToast('Please select a company first', 'error');
            return;
        }

        // Create a transaction template
        const template = {
            type: scenario.type,
            description: scenario.description,
            accounts: this.getAccountsForType(scenario.type, companyType),
            amount: { min: 50, max: 500 }
        };

        // Generate the transaction
        const transaction = this.transactionEngine.createTransaction(companyType, template, scenario.day);
        
        if (transaction && transaction.sourceDocument) {
            this.displayGeneratedDocument(transaction);
            this.currentDocument = transaction;
        } else {
            this.showToast('Failed to generate document', 'error');
        }
    }

    getAccountsForType(type, companyType) {
        // Map transaction types to account codes
        const accountMaps = {
            'cash_sale': ['1001', '4001'],
            'credit_sale': ['1010', '4001'],
            'cash_purchase': ['1020', '1001'],
            'expense_payment': ['5030', '1001'],
            'inventory_purchase': ['1020', '2001']
        };
        
        return accountMaps[type] || ['1001', '4001'];
    }

    displayGeneratedDocument(transaction) {
        const viewer = document.getElementById('document-viewer');
        if (!viewer) return;

        viewer.innerHTML = `
            <div class="generated-document">
                ${transaction.sourceDocument.html}
                <div class="document-actions">
                    <button class="btn btn-primary" onclick="window.documentManager.analyzeCurrentDocument()">
                        Analyze This Document
                    </button>
                </div>
            </div>
        `;
    }

    analyzeCurrentDocument() {
        if (!this.currentDocument) {
            this.showToast('No document to analyze', 'warning');
            return;
        }

        // Auto-populate transaction analysis
        this.populateTransactionAnalysis(this.currentDocument);
        this.showToast('Document analyzed! Check the transaction analysis section.', 'success');
    }

    populateTransactionAnalysis(transaction) {
        // Populate amount
        const amountInput = document.getElementById('transaction-amount');
        if (amountInput) {
            amountInput.value = transaction.amount.toFixed(2);
        }

        // Populate affected accounts
        const accountSelector = document.getElementById('account-selector');
        if (accountSelector) {
            accountSelector.innerHTML = '';
            transaction.accounts.forEach(accountCode => {
                const account = this.companyData.getAccountByCode(
                    window.accountingSimulator.gameState.selectedCompany, 
                    accountCode
                );
                if (account) {
                    const tag = document.createElement('span');
                    tag.className = 'account-tag';
                    tag.innerHTML = `
                        ${account.code} - ${account.name}
                        <span class="remove" onclick="this.parentElement.remove()">×</span>
                    `;
                    accountSelector.appendChild(tag);
                }
            });
        }
    }

    // File upload handling
    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        this.handleFileSelection(files);
    }

    handleFileSelection(files) {
        if (files.length === 0) return;

        Array.from(files).forEach(file => {
            if (this.isValidFileType(file)) {
                this.processUploadedFile(file);
            } else {
                this.showToast(`File type not supported: ${file.name}`, 'error');
            }
        });
    }

    isValidFileType(file) {
        const allowedTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
            'application/pdf', 'text/plain',
            'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        return allowedTypes.includes(file.type);
    }

    processUploadedFile(file) {
        const fileId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const fileData = {
            id: fileId,
            file: file,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date(),
            processed: false
        };

        this.uploadedFiles.set(fileId, fileData);
        this.displayUploadedFile(fileData);
        
        // Process the file based on type
        if (file.type.startsWith('image/')) {
            this.processImageFile(fileData);
        } else if (file.type === 'application/pdf') {
            this.processPDFFile(fileData);
        } else if (file.type === 'text/plain') {
            this.processTextFile(fileData);
        }
    }

    displayUploadedFile(fileData) {
        const container = document.getElementById('uploaded-files');
        if (!container) return;

        const fileElement = document.createElement('div');
        fileElement.className = 'uploaded-file-item';
        fileElement.dataset.fileId = fileData.id;

        fileElement.innerHTML = `
            <div class="file-info">
                <div class="file-icon">${this.getFileIcon(fileData.type)}</div>
                <div class="file-details">
                    <div class="file-name">${fileData.name}</div>
                    <div class="file-size">${this.formatFileSize(fileData.size)}</div>
                </div>
            </div>
            <div class="file-actions">
                <button class="file-action-btn view" data-file-id="${fileData.id}">View</button>
                <button class="file-action-btn remove" data-file-id="${fileData.id}">Remove</button>
            </div>
        `;

        container.appendChild(fileElement);
    }

    getFileIcon(fileType) {
        if (fileType.startsWith('image/')) return '🖼️';
        if (fileType === 'application/pdf') return '📄';
        if (fileType === 'text/plain') return '📝';
        if (fileType.includes('word')) return '📄';
        return '📎';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    processImageFile(fileData) {
        const reader = new FileReader();
        reader.onload = (e) => {
            fileData.preview = e.target.result;
            fileData.processed = true;
        };
        reader.readAsDataURL(fileData.file);
    }

    processPDFFile(fileData) {
        // For PDF processing, we'd normally use a library like PDF.js
        // For now, just mark as processed
        fileData.processed = true;
        fileData.extractedText = 'PDF text extraction would require additional libraries.';
    }

    processTextFile(fileData) {
        const reader = new FileReader();
        reader.onload = (e) => {
            fileData.extractedText = e.target.result;
            fileData.processed = true;
        };
        reader.readAsText(fileData.file);
    }

    viewUploadedFile(fileId) {
        const fileData = this.uploadedFiles.get(fileId);
        if (!fileData) return;

        const viewer = document.getElementById('document-viewer');
        if (!viewer) return;

        let content = '';
        
        if (fileData.type.startsWith('image/') && fileData.preview) {
            content = `
                <div class="document-preview">
                    <h4>${fileData.name}</h4>
                    <img src="${fileData.preview}" alt="Uploaded document">
                </div>
            `;
        } else if (fileData.extractedText) {
            content = `
                <div class="document-preview">
                    <h4>${fileData.name}</h4>
                    <div class="extracted-text">${fileData.extractedText}</div>
                </div>
            `;
        } else {
            content = `
                <div class="document-preview">
                    <h4>${fileData.name}</h4>
                    <p>File uploaded successfully. Processing may be required for analysis.</p>
                    <div class="file-details">
                        <p><strong>Type:</strong> ${fileData.type}</p>
                        <p><strong>Size:</strong> ${this.formatFileSize(fileData.size)}</p>
                        <p><strong>Uploaded:</strong> ${fileData.uploadDate.toLocaleString()}</p>
                    </div>
                </div>
            `;
        }

        viewer.innerHTML = content;
    }

    removeUploadedFile(fileId) {
        this.uploadedFiles.delete(fileId);
        const element = document.querySelector(`[data-file-id="${fileId}"]`);
        if (element) {
            element.remove();
        }
    }

    // Document analysis methods
    extractTextFromDocument() {
        const fileData = this.getCurrentSelectedFile();
        if (!fileData) {
            this.showToast('Please select a document first', 'warning');
            return;
        }

        if (fileData.extractedText) {
            this.showToast('Text extracted successfully!', 'success');
            this.displayExtractedText(fileData.extractedText);
        } else {
            this.showToast('Text extraction not available for this file type', 'info');
        }
    }

    identifyAccountsInDocument() {
        const fileData = this.getCurrentSelectedFile();
        if (!fileData) {
            this.showToast('Please select a document first', 'warning');
            return;
        }

        // Simple keyword matching for account identification
        const text = (fileData.extractedText || '').toLowerCase();
        const accounts = this.findAccountKeywords(text);
        
        if (accounts.length > 0) {
            this.populateIdentifiedAccounts(accounts);
            this.showToast(`Identified ${accounts.length} potential accounts`, 'success');
        } else {
            this.showToast('No account keywords found in document', 'info');
        }
    }

    suggestAmountsFromDocument() {
        const fileData = this.getCurrentSelectedFile();
        if (!fileData) {
            this.showToast('Please select a document first', 'warning');
            return;
        }

        const text = fileData.extractedText || '';
        const amounts = this.extractAmounts(text);
        
        if (amounts.length > 0) {
            const suggestedAmount = Math.max(...amounts);
            const amountInput = document.getElementById('transaction-amount');
            if (amountInput) {
                amountInput.value = suggestedAmount.toFixed(2);
            }
            this.showToast(`Suggested amount: $${suggestedAmount.toFixed(2)}`, 'success');
        } else {
            this.showToast('No monetary amounts found in document', 'info');
        }
    }

    getCurrentSelectedFile() {
        // For simplicity, return the most recently uploaded file
        const files = Array.from(this.uploadedFiles.values());
        return files.length > 0 ? files[files.length - 1] : null;
    }

    findAccountKeywords(text) {
        const accountKeywords = {
            '1001': ['cash', 'money', 'payment', 'receipt'],
            '1010': ['receivable', 'owe', 'invoice', 'bill'],
            '1020': ['inventory', 'stock', 'merchandise', 'goods'],
            '4001': ['sale', 'revenue', 'income', 'sold'],
            '5030': ['utility', 'electric', 'gas', 'water', 'phone']
        };

        const foundAccounts = [];
        Object.entries(accountKeywords).forEach(([code, keywords]) => {
            if (keywords.some(keyword => text.includes(keyword))) {
                foundAccounts.push(code);
            }
        });

        return foundAccounts;
    }

    extractAmounts(text) {
        // Simple regex to find dollar amounts
        const amountRegex = /\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g;
        const amounts = [];
        let match;

        while ((match = amountRegex.exec(text)) !== null) {
            const amount = parseFloat(match[1].replace(',', ''));
            if (!isNaN(amount) && amount > 0) {
                amounts.push(amount);
            }
        }

        return amounts;
    }

    displayExtractedText(text) {
        const viewer = document.getElementById('document-viewer');
        if (viewer) {
            viewer.innerHTML = `
                <div class="document-preview">
                    <h4>Extracted Text</h4>
                    <div class="extracted-text">${text}</div>
                </div>
            `;
        }
    }

    populateIdentifiedAccounts(accountCodes) {
        const selector = document.getElementById('account-selector');
        if (!selector) return;

        selector.innerHTML = '';
        accountCodes.forEach(code => {
            const account = this.companyData.getAccountByCode(
                window.accountingSimulator.gameState.selectedCompany, 
                code
            );
            if (account) {
                const tag = document.createElement('span');
                tag.className = 'account-tag';
                tag.innerHTML = `
                    ${account.code} - ${account.name}
                    <span class="remove" onclick="this.parentElement.remove()">×</span>
                `;
                selector.appendChild(tag);
            }
        });
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
}

// Export for use in other modules
window.DocumentManager = DocumentManager;