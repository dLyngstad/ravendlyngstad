document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DATA STRUCTURE ---
    const gestureData = [
        {
            id: 'p1',
            category: 'physics',
            categoryName: 'Physics',
            title: 'Magnet Felt',
            model: '<br><img src="images/magnetic Field.JPG">',
            concept: 'Håndmodellen viser retningen av kraften hvis to magnetfelt / partikler møter hverandre',
            extraInfo: ''
        },
        {
            id: 'p2',
            category: 'physics',
            categoryName: 'Physics',
            title: '',
            model: '',
            concept: '',
            extraInfo: ''
        },
        {
            id: 'p3',
            category: 'physics',
            categoryName: 'Physics',
            title: '',
            model: '',
            concept: '',
            extraInfo: ''
        },
        {
            id: 'c1',
            category: 'chemistry',
            categoryName: 'Chemistry',
            title: 'Fast Form',
            model: '<br><img src="images/Fast_Form.png">',
            concept: 'Nevene illustrerer hvodan i fast form så er partiklene rigide.',
            extraInfo: 'Husk at i fast form er det fortsatt bevegelse i partiklene.'
        },
        {
            id: 'c2',
            category: 'chemistry',
            categoryName: 'Chemistry',
            title: 'Vannform',
            model: '<br><img src="images/Water_form.png">',
            concept: 'Nevene glir innom hverandre for å illustrere den dynamiske formen til vann.',
            extraInfo: ''
        },
        {
            id: 'c3',
            category: 'chemistry',
            categoryName: 'Chemistry',
            title: 'Gassform',
            model: '<br><img src="images/Water_form.png">',
            concept: 'Nevene beveger seg raskt og sporadisk i store bevegelser',
            extraInfo: ''
        },
         {
            id: 'c4',
            category: 'chemistry',
            categoryName: 'Chemistry',
            title: '',
            model: '<br><img src="images/Water_form.png">',
            concept: 'Nevene beveger seg raskt og sporadisk i store bevegelser',
            extraInfo: ''
        },
        {
            id: 'b1',
            category: 'biology',
            categoryName: 'Biology',
            title: 'Eggstokker',
            model: 'Image',
            concept: 'Stå baklengs mot elevene, hold opp hendene på hver side. Høyre og venstre arm er eggledere mens hendene helt utstrakt er eggstokkene. ',
            extraInfo: ''
        },
        {
            id: 'b2',
            category: 'biology',
            categoryName: 'Biology',
            title: 'Dendritt',
            model: '',
            concept: 'Hold ut armen og åpne hånden. Fingrene er dendritter som mottar signaler. Mens armen er aksonet.',
            extraInfo: ''
        },
          {
            id: 'b3',
            category: 'biology',
            categoryName: 'Biology',
            title: 'Hjerte',
            model: '',
            concept: 'Lag to "kopper" med nevene. Sett håndflatene sammen og la det være hulrom mellom hendene. ',
            extraInfo: 'Man kan simulere "pump" med hjerte ved å klemme sammen hendene i rytmiske puls.'
        },
        {
            id: 'e1',
            category: 'earth',
            categoryName: 'Earth Science',
            title: '',
            model: '',
            concept: '',
            extraInfo: ''
        }
    ];

    // --- 2. DOM ELEMENTS ---
    const grid = document.getElementById('gesture-grid');
    const searchBar = document.getElementById('search-bar');
    const searchClear = document.getElementById('search-clear');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const noResultsMsg = document.getElementById('no-results');
    const resultCount = document.getElementById('result-count');
    const backToTopBtn = document.getElementById('back-to-top');

    // Modal Elements
    const modal = document.getElementById('gesture-modal');
    const closeModalBtn = document.getElementById('close-modal');

    let currentCategory = 'all';
    let searchQuery = '';

    // --- 3. RENDERING CARDS DYNAMICALLY ---
    function renderCards() {
        grid.innerHTML = '';

        const filteredData = gestureData.filter(item => {
            const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
            const matchesSearch = item.title.toLowerCase().includes(searchQuery) ||
                                  item.concept.toLowerCase().includes(searchQuery);
            return matchesCategory && matchesSearch;
        });

        // Show/hide no-results message
        if (filteredData.length === 0) {
            noResultsMsg.classList.remove('hidden');
        } else {
            noResultsMsg.classList.add('hidden');
        }

        // Update result count
        updateResultCount(filteredData.length);

        // Update filter badge counts
        updateFilterCounts();

        // Render cards
        filteredData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.setAttribute('role', 'listitem');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `${item.title || 'Uten tittel'} – ${item.categoryName}. Klikk for detaljer.`);

            card.innerHTML = `
                <span class="card-category">${item.categoryName}</span>
                <h3>${item.title || '(Uten tittel)'}</h3>
                <p><strong>Modellen:</strong> ${item.model || '–'}</p>
                <p><strong>Konseptet:</strong> ${item.concept || '–'}</p>
            `;

            // Open modal on click or Enter/Space
            card.addEventListener('click', () => openModal(item));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(item);
                }
            });

            grid.appendChild(card);
        });
    }

    // --- 4. RESULT COUNT ---
    function updateResultCount(count) {
        if (searchQuery || currentCategory !== 'all') {
            resultCount.textContent = `${count} resultat${count !== 1 ? 'er' : ''} funnet`;
        } else {
            resultCount.textContent = '';
        }
    }

    // --- 5. FILTER BADGE COUNTS ---
    function updateFilterCounts() {
        filterBtns.forEach(btn => {
            const filter = btn.getAttribute('data-filter');

            // Remove existing badge
            const existingBadge = btn.querySelector('.filter-count');
            if (existingBadge) existingBadge.remove();

            // Count matching items for this filter
            const count = filter === 'all'
                ? gestureData.filter(i => i.title.toLowerCase().includes(searchQuery) || i.concept.toLowerCase().includes(searchQuery)).length
                : gestureData.filter(i => i.category === filter && (i.title.toLowerCase().includes(searchQuery) || i.concept.toLowerCase().includes(searchQuery))).length;

            const badge = document.createElement('span');
            badge.className = 'filter-count';
            badge.textContent = count;
            btn.appendChild(badge);
        });
    }

    // --- 6. MODAL LOGIC ---
    let previouslyFocusedElement = null;

    function openModal(item) {
        previouslyFocusedElement = document.activeElement;

        document.getElementById('modal-category').textContent = item.categoryName;
        document.getElementById('modal-title').textContent = item.title || '(Uten tittel)';
        document.getElementById('modal-model').innerHTML = item.model || '–';
        document.getElementById('modal-concept').textContent = item.concept || '–';
        document.getElementById('modal-extra').textContent = item.extraInfo || '–';

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Focus the close button for accessibility
        closeModalBtn.focus();
    }

    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';

        // Return focus to the element that opened the modal
        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
        }
    }

    closeModalBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Trap focus within modal when open
    modal.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    });

    // --- 7. FILTERING LOGIC ---
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-filter');
            renderCards();
        });
    });

    // --- 8. SEARCH LOGIC ---
    searchBar.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        searchClear.classList.toggle('hidden', searchQuery.length === 0);
        renderCards();
    });

    searchClear.addEventListener('click', () => {
        searchBar.value = '';
        searchQuery = '';
        searchClear.classList.add('hidden');
        searchBar.focus();
        renderCards();
    });

    // --- 9. BACK TO TOP ---
    window.addEventListener('scroll', () => {
        backToTopBtn.classList.toggle('hidden', window.scrollY < 300);
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- 10. INITIALIZATION ---
    renderCards();
});
