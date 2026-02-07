class GradeUIRenderer {
    constructor() {
        this.container = document.getElementById('grades-container');
        this.loading = document.getElementById('loading-indicator');
        this.error = document.getElementById('error-container');
        
        // Bibliothèque d'icônes SVG intégrée (plus besoin de librairie externe)
        this.icons = {
            'shield': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
            'chevron-down': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
            'crown': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-3-4 3-6-7zm0 0"/></svg>',
            'swords': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/></svg>',
            'star': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
            'users': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
        };
    }

    getIcon(name) {
        return this.icons[name] || this.icons['shield'];
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
        
        // Plus besoin d'initialiser Lucide
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
        const iconSvg = this.getIcon(iconName);

        card.innerHTML = `
            <div class="grade-header-wrapper">
                <div class="grade-icon" style="color: ${grade.color || 'inherit'}">
                    ${iconSvg}
                </div>
                <div class="grade-header-content">
                    <h2 class="grade-name">${this.escapeHtml(grade.name)}</h2>
                    <span class="grade-level">Niveau ${grade.level}</span>
                </div>
                <div class="accordion-icon">
                    ${this.icons['chevron-down']}
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