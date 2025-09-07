// Progress Tracker - Handles learning progress and achievements
class ProgressTracker {
    constructor() {
        this.achievements = this.initializeAchievements();
        this.skillLevels = this.initializeSkillLevels();
    }

    initializeAchievements() {
        return [
            {
                id: 'first-entry',
                title: 'First Entry',
                description: 'Create your first journal entry',
                icon: '📝',
                earned: false,
                points: 10
            },
            {
                id: 'balanced-books',
                title: 'Balanced Books',
                description: 'Create a perfectly balanced journal entry',
                icon: '⚖️',
                earned: false,
                points: 15
            },
            {
                id: 'week-one',
                title: 'Week One Complete',
                description: 'Complete the first week of transactions',
                icon: '🎯',
                earned: false,
                points: 25
            },
            {
                id: 'accuracy-master',
                title: 'Accuracy Master',
                description: 'Maintain 95% accuracy rate',
                icon: '🎯',
                earned: false,
                points: 30
            },
            {
                id: 'speed-demon',
                title: 'Speed Demon',
                description: 'Complete 10 transactions in under 5 minutes',
                icon: '⚡',
                earned: false,
                points: 20
            },
            {
                id: 'month-complete',
                title: 'Month Complete',
                description: 'Successfully complete the entire 30-day simulation',
                icon: '🏆',
                earned: false,
                points: 100
            },
            {
                id: 'trial-balance-master',
                title: 'Trial Balance Master',
                description: 'Generate a perfect trial balance',
                icon: '📊',
                earned: false,
                points: 35
            },
            {
                id: 'statement-builder',
                title: 'Statement Builder',
                description: 'Create complete financial statements',
                icon: '📋',
                earned: false,
                points: 40
            }
        ];
    }

    initializeSkillLevels() {
        return {
            'cash-transactions': { level: 0, maxLevel: 3, xp: 0 },
            'credit-transactions': { level: 0, maxLevel: 3, xp: 0 },
            'journal-entries': { level: 0, maxLevel: 3, xp: 0 },
            'posting-ledger': { level: 0, maxLevel: 3, xp: 0 },
            'trial-balance': { level: 0, maxLevel: 3, xp: 0 },
            'adjusting-entries': { level: 0, maxLevel: 3, xp: 0 },
            'income-statement': { level: 0, maxLevel: 3, xp: 0 },
            'balance-sheet': { level: 0, maxLevel: 3, xp: 0 },
            'cash-flow': { level: 0, maxLevel: 3, xp: 0 },
            'inventory-management': { level: 0, maxLevel: 3, xp: 0 },
            'depreciation': { level: 0, maxLevel: 3, xp: 0 },
            'accruals': { level: 0, maxLevel: 3, xp: 0 },
            'deferrals': { level: 0, maxLevel: 3, xp: 0 },
            'financial-analysis': { level: 0, maxLevel: 3, xp: 0 },
            'closing-entries': { level: 0, maxLevel: 3, xp: 0 }
        };
    }

    addExperience(skillName, points) {
        if (this.skillLevels[skillName]) {
            this.skillLevels[skillName].xp += points;
            this.checkLevelUp(skillName);
        }
    }

    checkLevelUp(skillName) {
        const skill = this.skillLevels[skillName];
        if (!skill) return;

        const xpRequired = (skill.level + 1) * 100; // 100 XP per level
        
        if (skill.xp >= xpRequired && skill.level < skill.maxLevel) {
            skill.level++;
            skill.xp -= xpRequired;
            this.showLevelUpNotification(skillName, skill.level);
        }
    }

    showLevelUpNotification(skillName, newLevel) {
        const skillDisplayName = skillName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        this.showToast(`🎉 Level Up! ${skillDisplayName} is now level ${newLevel}`, 'success');
    }

    checkAchievements(gameState) {
        this.achievements.forEach(achievement => {
            if (!achievement.earned && this.checkAchievementCondition(achievement, gameState)) {
                this.earnAchievement(achievement);
            }
        });
    }

    checkAchievementCondition(achievement, gameState) {
        switch (achievement.id) {
            case 'first-entry':
                return gameState.journalEntries.length >= 1;
            
            case 'balanced-books':
                return gameState.journalEntries.some(entry => 
                    Math.abs(this.calculateDebits(entry) - this.calculateCredits(entry)) < 0.01
                );
            
            case 'week-one':
                return gameState.completedDays >= 7;
            
            case 'accuracy-master':
                return gameState.progress.accuracyRate >= 95;
            
            case 'month-complete':
                return gameState.completedDays >= 30;
            
            case 'trial-balance-master':
                // Would check if trial balance was generated successfully
                return false; // Placeholder
            
            case 'statement-builder':
                // Would check if statements were generated
                return false; // Placeholder
            
            default:
                return false;
        }
    }

    calculateDebits(entry) {
        return entry.debits ? entry.debits.reduce((sum, d) => sum + d.amount, 0) : 0;
    }

    calculateCredits(entry) {
        return entry.credits ? entry.credits.reduce((sum, c) => sum + c.amount, 0) : 0;
    }

    earnAchievement(achievement) {
        achievement.earned = true;
        this.showAchievementNotification(achievement);
        
        // Update game state if available
        if (window.accountingSimulator) {
            window.accountingSimulator.gameState.progress.achievements.push(achievement.id);
            window.accountingSimulator.saveGameState();
        }
    }

    showAchievementNotification(achievement) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Achievement Unlocked!',
                html: `
                    <div style="text-align: center;">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">${achievement.icon}</div>
                        <h3>${achievement.title}</h3>
                        <p>${achievement.description}</p>
                        <div style="color: #059669; font-weight: bold; margin-top: 1rem;">
                            +${achievement.points} points
                        </div>
                    </div>
                `,
                icon: 'success',
                confirmButtonText: 'Awesome!',
                timer: 5000,
                showClass: {
                    popup: 'animate__animated animate__bounceIn'
                }
            });
        }
    }

    recordMistake(mistakeType, context) {
        if (window.accountingSimulator) {
            const patterns = window.accountingSimulator.gameState.progress.mistakePatterns;
            if (!patterns[mistakeType]) {
                patterns[mistakeType] = 0;
            }
            patterns[mistakeType]++;
            
            // Lower accuracy rate slightly
            const currentRate = window.accountingSimulator.gameState.progress.accuracyRate;
            window.accountingSimulator.gameState.progress.accuracyRate = Math.max(0, currentRate - 1);
        }
    }

    recordCorrectAnswer(skillName) {
        // Add experience for correct answers
        this.addExperience(skillName, 10);
        
        // Slightly improve accuracy rate
        if (window.accountingSimulator) {
            const currentRate = window.accountingSimulator.gameState.progress.accuracyRate;
            window.accountingSimulator.gameState.progress.accuracyRate = Math.min(100, currentRate + 0.5);
        }
    }

    getProgressSummary() {
        const totalSkills = Object.keys(this.skillLevels).length;
        const masteredSkills = Object.values(this.skillLevels).filter(skill => skill.level === skill.maxLevel).length;
        const totalAchievements = this.achievements.length;
        const earnedAchievements = this.achievements.filter(a => a.earned).length;
        
        return {
            skillMastery: (masteredSkills / totalSkills) * 100,
            achievementProgress: (earnedAchievements / totalAchievements) * 100,
            masteredSkills,
            totalSkills,
            earnedAchievements,
            totalAchievements
        };
    }

    getMasteryLevel(skillName) {
        const skill = this.skillLevels[skillName];
        if (!skill) return { level: 0, progress: 0, status: 'locked' };
        
        if (skill.level === 0) return { level: 0, progress: 0, status: 'beginner' };
        if (skill.level === skill.maxLevel) return { level: skill.level, progress: 100, status: 'master' };
        
        const nextLevelXP = (skill.level + 1) * 100;
        const progress = (skill.xp / nextLevelXP) * 100;
        
        return {
            level: skill.level,
            progress,
            status: 'in-progress'
        };
    }

    generateProgressReport() {
        const summary = this.getProgressSummary();
        const topMistakes = this.getTopMistakes();
        const recommendations = this.generateRecommendations();
        
        return {
            summary,
            topMistakes,
            recommendations,
            skillDetails: this.skillLevels,
            achievements: this.achievements.filter(a => a.earned)
        };
    }

    getTopMistakes() {
        if (!window.accountingSimulator) return [];
        
        const mistakes = window.accountingSimulator.gameState.progress.mistakePatterns;
        return Object.entries(mistakes)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([type, count]) => ({ type, count }));
    }

    generateRecommendations() {
        const recommendations = [];
        const topMistakes = this.getTopMistakes();
        
        if (topMistakes.length > 0) {
            recommendations.push({
                type: 'improvement',
                message: `Focus on ${topMistakes[0].type} - this is your most common mistake area`
            });
        }
        
        // Find lowest level skills
        const lowestSkill = Object.entries(this.skillLevels)
            .sort(([,a], [,b]) => a.level - b.level)[0];
        
        if (lowestSkill && lowestSkill[1].level < 2) {
            recommendations.push({
                type: 'practice',
                message: `Practice ${lowestSkill[0].replace(/-/g, ' ')} to improve your overall competency`
            });
        }
        
        return recommendations;
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
        }
    }
}

window.ProgressTracker = ProgressTracker;