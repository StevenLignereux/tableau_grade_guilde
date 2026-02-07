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
            
            // Initialiser le bouton de preview
            this.initPreviewGenerator();

            if (data.source === 'local_json') {
                console.info("Astuce: Configurez l'ID Google Sheet dans js/data.js pour activer la mise à jour dynamique.");
            }
        } catch (error) {
            console.error("Erreur d'initialisation:", error);
            this.uiRenderer.showError("Impossible de charger l'application. Veuillez réessayer plus tard.");
        }
    }

    initPreviewGenerator() {
        const btn = document.getElementById('btn-generate-preview');
        if (!btn) return;

        btn.addEventListener('click', async () => {
            const container = document.getElementById('grades-container');
            const originalStyle = container.style.cssText;
            
            // Ouvrir tous les accordéons pour la photo
            const cards = container.querySelectorAll('.grade-card');
            cards.forEach(card => {
                card.classList.add('active');
                const details = card.querySelector('.grade-details');
                details.style.maxHeight = 'none';
            });

            try {
                // Créer le canvas
                const canvas = await html2canvas(container, {
                    backgroundColor: '#0F001A', // Couleur de fond du thème
                    scale: 2 // Meilleure qualité
                });

                // Créer le lien de téléchargement
                const link = document.createElement('a');
                link.download = 'preview-grades.png';
                link.href = canvas.toDataURL('image/png');
                link.click();

                alert("Image générée ! Sauvegardez-la dans 'assets/images/preview-grades.png' et commitez-la sur GitHub pour mettre à jour l'aperçu Discord.");
            } catch (err) {
                console.error('Erreur lors de la génération de la preview:', err);
                alert('Erreur lors de la génération de l\'image.');
            } finally {
                // Restaurer l'état (fermer les accordéons ou laisser comme avant)
                // Ici on recharge simplement pour remettre propre
                window.location.reload();
            }
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const app = new GuildGradeApp();
    app.init();
    
    // Année dynamique footer
    document.getElementById('year').textContent = new Date().getFullYear();
});