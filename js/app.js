document.addEventListener('DOMContentLoaded', () => {
    const app = new GuildGradeApp();
    app.init();
});

class GuildGradeApp {
    constructor() {
        this.dataManager = new GradeDataManager();
        this.uiRenderer = new GradeUIRenderer();
    }

    async init() {
        this.updateYear();
        
        try {
            this.uiRenderer.showLoading();
            const { grades, source } = await this.dataManager.loadGrades();
            
            console.log(`Application initialisée. Source des données: ${source}`);
            
            this.uiRenderer.render(grades);
            
            if (source === 'local_json') {
                console.info('Astuce: Configurez l\'ID Google Sheet dans js/data.js pour activer la mise à jour dynamique.');
            }
        } catch (error) {
            console.error('Erreur lors de l\'initialisation:', error);
            this.uiRenderer.showError('Impossible de charger les données des grades. Veuillez réessayer plus tard.');
        }
    }

    updateYear() {
        const yearSpan = document.getElementById('year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }
}