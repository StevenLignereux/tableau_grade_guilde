class GuildGradeApp {
    constructor() {
        this.dataManager = new GradeDataManager();
        this.uiRenderer = new GradeUIRenderer();
    }

    async init() {
        try {
            const data = await this.dataManager.loadGrades();
            this.uiRenderer.render(data.grades);
            console.log(`Application initialisée. Source des données: ${data.source}`);
            
            if (data.source === 'local_json') {
                console.info("Astuce: Configurez l'ID Google Sheet dans js/data.js pour activer la mise à jour dynamique.");
            }
        } catch (error) {
            console.error("Erreur d'initialisation:", error);
            this.uiRenderer.showError("Impossible de charger l'application. Veuillez réessayer plus tard.");
        }
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const app = new GuildGradeApp();
    app.init();
    
    // Année dynamique footer
    document.getElementById('year').textContent = new Date().getFullYear();
});