class GradeDataManager {
    constructor() {
        // ID de la Google Sheet (à remplacer par le vôtre)
        // Format attendu: 2PACX-... (c'est l'ID long qu'on obtient en publiant sur le web)
        this.sheetId = '2PACX-1vQca1-Uv_iOvJCWreJmwC_CJy9KcnVnvnsyRzjV5g4pcDi9ZwVgLa9JR5TZ_iKxTrVSKaLH8aGoyaZW'; 
        
        // URL complète pour l'export CSV
        this.googleSheetUrl = `https://docs.google.com/spreadsheets/d/e/${this.sheetId}/pub?output=csv`;
        
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
        // Nettoyer et normaliser les en-têtes (minuscules, sans espaces)
        const headers = this.parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());
        
        return lines.slice(1)
            .filter(line => line.trim() !== '')
            .map(line => {
                const values = this.parseCSVLine(line);
                const entry = {};
                
                // Initialiser les permissions et membres par défaut
                entry.permissions = [];
                entry.members = [];
                
                headers.forEach((header, index) => {
                    const value = values[index]?.trim();
                    if (header === 'level') {
                        entry[header] = parseInt(value, 10);
                    } else if (header === 'permissions') {
                        // Gérer les permissions séparées par des virgules ou points-virgules
                        entry[header] = value ? value.split(/[,;]/).map(p => p.trim()).filter(p => p) : [];
                    } else if (header === 'members' || header === 'membres') {
                        // Gérer les membres séparés par des virgules
                        entry['members'] = value ? value.split(/[,;]/).map(m => m.trim()).filter(m => m) : [];
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