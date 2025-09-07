// Storage Manager - Handles local storage operations
class StorageManager {
    constructor() {
        this.storageKey = 'accountingSimulator';
        this.defaultGameState = {
            selectedCompany: null,
            currentDay: 1,
            completedDays: 0,
            transactions: [],
            journalEntries: [],
            ledgerEntries: [],
            progress: {
                conceptsMastered: 0,
                accuracyRate: 100,
                achievements: [],
                timeSpent: 0,
                mistakePatterns: {}
            },
            settings: {
                showHints: true,
                autoSave: true,
                difficulty: 'intermediate'
            }
        };
    }

    saveGameState(gameState) {
        try {
            const dataToSave = {
                ...gameState,
                lastSaved: new Date().toISOString(),
                version: '1.0'
            };
            
            localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
            return { success: true };
        } catch (error) {
            console.error('Failed to save game state:', error);
            return { success: false, error: error.message };
        }
    }

    loadGameState() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const gameState = JSON.parse(saved);
                // Merge with default state to handle new properties
                return {
                    success: true,
                    gameState: { ...this.defaultGameState, ...gameState }
                };
            }
            return { success: false, error: 'No saved data found' };
        } catch (error) {
            console.error('Failed to load game state:', error);
            return { success: false, error: error.message };
        }
    }

    clearGameState() {
        try {
            localStorage.removeItem(this.storageKey);
            return { success: true };
        } catch (error) {
            console.error('Failed to clear game state:', error);
            return { success: false, error: error.message };
        }
    }

    exportGameState() {
        const result = this.loadGameState();
        if (result.success) {
            const dataStr = JSON.stringify(result.gameState, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `accounting-simulator-save-${new Date().toISOString().slice(0, 10)}.json`;
            link.click();
            
            return { success: true };
        }
        return result;
    }

    importGameState(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const gameState = JSON.parse(e.target.result);
                    const saveResult = this.saveGameState(gameState);
                    resolve(saveResult);
                } catch (error) {
                    reject({ success: false, error: 'Invalid file format' });
                }
            };
            reader.onerror = () => reject({ success: false, error: 'Failed to read file' });
            reader.readAsText(file);
        });
    }
}

// Export for use in other modules
window.StorageManager = StorageManager;