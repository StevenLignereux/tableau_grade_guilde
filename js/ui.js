class GradeUIRenderer {
    constructor() {
        this.container = document.getElementById('grades-container');
        this.loading = document.getElementById('loading-indicator');
        this.error = document.getElementById('error-container');
    }

    render(grades) {
        this.hideLoading();
        this.container.innerHTML = '';

        if (!grades || grades.length === 0) {
            this.showError('Aucun grade trouvé.');
            return;
        }

        grades.forEach(grade => {
            const card = this.createGradeCard(grade);
            this.container.appendChild(card);
        });

        // Initialiser les icônes Lucide
        lucide.createIcons();
    }

    createGradeCard(grade) {
        const card = document.createElement('div');
        card.className = 'grade-card accordion';
        card.style.borderLeft = `4px solid ${grade.color || 'var(--border-color)'}`;

        // Gérer l'affichage des membres en liste verticale
        const members = Array.isArray(grade.members) ? grade.members : [];
        const membersHtml = members.length > 0 ? `
            <div class="grade-members">
                <div class="members-list-vertical">
                    ${members.map(member => `
                        <div class="member-item">
                            <span class="member-bullet">•</span>
                            <span class="member-name">${this.escapeHtml(member)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '<div class="no-members">Aucun membre assigné</div>';

        const iconName = grade.icon || 'shield';

        card.innerHTML = `
            <div class="grade-header-wrapper">
                <div class="grade-icon" style="color: ${grade.color || 'inherit'}">
                    <i data-lucide="${iconName}"></i>
                </div>
                <div class="grade-header-content">
                    <h2 class="grade-name">${this.escapeHtml(grade.name)}</h2>
                    <span class="grade-level">Niveau ${grade.level}</span>
                </div>
                <div class="accordion-icon">
                    <i data-lucide="chevron-down"></i>
                </div>
            </div>
            
            <div class="grade-details">
                <p class="grade-description">${this.escapeHtml(grade.description)}</p>
                ${membersHtml}
            </div>
        `;

        // Ajouter l'événement de clic pour l'accordéon
        card.addEventListener('click', () => {
            card.classList.toggle('active');
            const details = card.querySelector('.grade-details');
            if (card.classList.contains('active')) {
                details.style.maxHeight = details.scrollHeight + "px";
            } else {
                details.style.maxHeight = null;
            }
        });

        return card;
    }

    showLoading() {
        this.loading.classList.remove('hidden');
        this.error.classList.add('hidden');
        this.container.innerHTML = '';
    }

    hideLoading() {
        this.loading.classList.add('hidden');
    }

    showError(message) {
        this.hideLoading();
        this.error.textContent = message;
        this.error.classList.remove('hidden');
    }

    escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}