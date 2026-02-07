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
                // Petit délai pour laisser le navigateur faire le rendu
                await new Promise(r => setTimeout(r, 800));

                if (typeof html2canvas === 'undefined') {
                    throw new Error("La librairie html2canvas n'est pas chargée.");
                }

                const canvas = await html2canvas(container, {
                    backgroundColor: '#0F001A',
                    scale: 2, // Haute qualité
                    useCORS: true,
                    allowTaint: true, // Permet de capturer même si c'est un peu "sale" niveau sécurité
                    onclone: (clonedDoc) => {
                        // Astuce: on peut modifier le clone invisible avant la capture si besoin
                        const clonedContainer = clonedDoc.getElementById('grades-container');
                        clonedContainer.style.padding = "20px"; // Ajouter un peu de marge
                    }
                });

                // Téléchargement
                const link = document.createElement('a');
                link.download = 'preview-grades.png';
                link.href = canvas.toDataURL('image/png');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                console.log("Image générée avec succès !");
            } catch (err) {
                console.error("Erreur capture:", err);
                alert("Erreur: " + err.message + "\nRegardez la console (F12) pour plus de détails.");
            } finally {
                // 3. Restaurer l'état initial
                cards.forEach(card => {
                    // On ferme tout d'abord
                    card.classList.remove('active');
                    const details = card.querySelector('.grade-details');
                    details.style.maxHeight = null;
                    details.style.display = ''; // Reset display
                });

                // On rouvre ceux qui étaient ouverts
                initiallyActive.forEach(card => {
                    // Retrouver la carte correspondante dans le DOM actuel (si pas détruit)
                    // Comme on a pas touché au DOM structurellement, la référence 'card' est toujours bonne ? 
                    // Non, 'initiallyActive' contient des éléments du DOM réel.
                    card.classList.add('active');
                    const details = card.querySelector('.grade-details');
                    details.style.maxHeight = details.scrollHeight + "px";
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