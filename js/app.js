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
            console.log("Bouton cliqué, début de la génération...");
            const container = document.getElementById('grades-container');
            
            // 1. Sauvegarder l'état actuel (quels sont ouverts ?)
            const initiallyActive = Array.from(container.querySelectorAll('.grade-card.active'));

            // 2. Tout ouvrir pour la photo
            const cards = container.querySelectorAll('.grade-card');
            cards.forEach(card => {
                card.classList.add('active');
                const details = card.querySelector('.grade-details');
                details.style.maxHeight = 'none'; // Force l'affichage complet sans animation
                details.style.display = 'block'; // Force l'affichage
            });

            try {
                // Attendre un peu que le DOM se mette à jour
                await new Promise(resolve => setTimeout(resolve, 500));

                // Utiliser dom-to-image pour une meilleure fidélité CSS
                const dataUrl = await domtoimage.toPng(container, {
                    bgcolor: '#0F001A', // Force le fond sombre
                    style: {
                        'transform': 'scale(1)', // Évite les bugs de zoom
                        'transform-origin': 'top left'
                    }
                });

                // Créer le lien de téléchargement
                const link = document.createElement('a');
                link.download = 'preview-grades.png';
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                alert("Image générée ! Sauvegardez-la dans 'assets/images/preview-grades.png' et commitez-la sur GitHub.");
            } catch (err) {
                console.error('Erreur lors de la génération de la preview:', err);
                alert('Erreur lors de la génération de l\'image: ' + err.message);
            } finally {
                // Restaurer l'état
                cards.forEach(card => {
                    card.classList.remove('active');
                    const details = card.querySelector('.grade-details');
                    details.style.maxHeight = null;
                });
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