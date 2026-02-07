class GradeDataManager {
    constructor() {
        // ID de la Google Sheet (à remplacer par le vrai ID)
        // Format: https://docs.google.com/spreadsheets/d/[ID]/edit#gid=0
        this.sheetId = ''; 
        this.googleSheetUrl = this.sheetId ? `https://docs.google.com/spreadsheets/d/${this.sheetId}/export?format=csv` : null;
        this.fallbackData = 'data/grades.json';
    }

    async loadGrades() {
        if (this.googleSheetUrl) {
            try {
                console.log('Tentative de chargement depuis Google Sheets...');
                const response = await fetch(this.googleSheetUrl);
                if (!response.ok) throw new Error('Erreur réseau Google Sheets');
                const csvText = await response.text();
                const grades = this.parseCSV(csvText);
                console.log('Données chargées depuis Google Sheets');
                return { source: 'google_sheets', grades };
            } catch (error) {
                console.warn('Google Sheets inaccessible, passage au fallback local:', error);
            }
        }

        // Fallback local
        try {
            console.log('Chargement depuis le fichier JSON local...');
            const response = await fetch(this.fallbackData);
            if (!response.ok) throw new Error('Fichier JSON local introuvable');
            const data = await response.json();
            return { source: 'local_json', grades: data.grades };
        } catch (error) {
            console.error('Erreur critique: Impossible de charger les données', error);
            throw error;
        }
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = this.parseCSVLine(lines[0]);
        
        return lines.slice(1)
            .filter(line => line.trim() !== '')
            .map(line => {
                const values = this.parseCSVLine(line);
                const entry = {};
                
                headers.forEach((header, index) => {
                    const value = values[index]?.trim();
                    if (header === 'level') {
                        entry[header] = parseInt(value, 10);
                    } else if (header === 'permissions') {
                        // Gérer les permissions séparées par des virgules ou points-virgules
                        entry[header] = value ? value.split(/[,;]/).map(p => p.trim()).filter(p => p) : [];
                    } else {
                        entry[header] = value;
                    }
                });
                
                return entry;
            })
            .sort((a, b) => a.level - b.level);
    }

    // Parser CSV simple qui gère les guillemets
    parseCSVLine(text) {
        const result = [];
        let cell = '';
        let inQuotes = false;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(cell);
                cell = '';
            } else {
                cell += char;
            }
        }
        result.push(cell);
        
        // Nettoyer les guillemets au début/fin si présents
        return result.map(val => val.replace(/^"|"$/g, ''));
    }
}