class MemoryGame {
    constructor() {
        this.grid = document.querySelector('.game-grid');
        this.movesDisplay = document.getElementById('moves');
        this.totalMovesDisplay = document.getElementById('total-moves');
        this.difficultyButtons = document.querySelectorAll('.difficulty button');
        this.moves = 0;
        this.totalMoves = 0;
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.canFlip = true;
        this.gridSize = 4;
        
        // Extended shapes array with unique combinations for 8x8 grid (32 pairs)
        this.shapes = [
            { type: 'circle', color: '#FF5252' },
            { type: 'square', color: '#4CAF50' },
            { type: 'triangle', color: '#FFC107' },
            { type: 'diamond', color: '#2196F3' },
            { type: 'pentagon', color: '#9C27B0' },
            { type: 'hexagon', color: '#FF9800' },
            { type: 'star', color: '#607D8B' },
            { type: 'heart', color: '#E91E63' },
            { type: 'octagon', color: '#795548' },
            { type: 'cross', color: '#009688' },
            { type: 'moon', color: '#673AB7' },
            { type: 'oval', color: '#3F51B5' },
            { type: 'rectangle', color: '#8BC34A' },
            { type: 'trapezoid', color: '#CDDC39' },
            { type: 'parallelogram', color: '#FF4081' },
            { type: 'rhombus', color: '#00BCD4' },
            // Additional shapes with different colors for hard mode
            { type: 'circle', color: '#D32F2F' },
            { type: 'square', color: '#388E3C' },
            { type: 'triangle', color: '#FFA000' },
            { type: 'diamond', color: '#1976D2' },
            { type: 'pentagon', color: '#7B1FA2' },
            { type: 'hexagon', color: '#F57C00' },
            { type: 'star', color: '#455A64' },
            { type: 'heart', color: '#C2185B' },
            { type: 'octagon', color: '#5D4037' },
            { type: 'cross', color: '#00796B' },
            { type: 'moon', color: '#512DA8' },
            { type: 'oval', color: '#303F9F' },
            { type: 'rectangle', color: '#689F38' },
            { type: 'trapezoid', color: '#AFB42B' },
            { type: 'parallelogram', color: '#EC407A' },
            { type: 'rhombus', color: '#0097A7' }
        ];

        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.grid.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        this.moves = 0;
        this.movesDisplay.textContent = '0';
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.canFlip = true;
        this.createCards();
    }

    createCards() {
        this.grid.innerHTML = '';
        const pairs = (this.gridSize * this.gridSize) / 2;
        const selectedShapes = this.shapes.slice(0, pairs);
        const cards = [...selectedShapes, ...selectedShapes]
            .map((shape, index) => ({ shape, sortKey: Math.random() }))
            .sort((a, b) => a.sortKey - b.sortKey)
            .map(({ shape }) => shape);

        cards.forEach((shape, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = index;
            card.dataset.shape = shape.type;
            card.dataset.color = shape.color;

            card.innerHTML = `
                <div class="card-front"></div>
                <div class="card-back">
                    ${this.getShapeSVG(shape.type, shape.color)}
                </div>
            `;

            card.addEventListener('click', () => this.flipCard(card));
            this.grid.appendChild(card);
        });
    }

    getShapeSVG(type, color) {
        const svgs = {
            circle: `<svg class="shape" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="${color}"/></svg>`,
            square: `<svg class="shape" viewBox="0 0 100 100"><rect x="5" y="5" width="90" height="90" fill="${color}"/></svg>`,
            triangle: `<svg class="shape" viewBox="0 0 100 100"><polygon points="50,5 95,95 5,95" fill="${color}"/></svg>`,
            diamond: `<svg class="shape" viewBox="0 0 100 100"><polygon points="50,5 95,50 50,95 5,50" fill="${color}"/></svg>`,
            pentagon: `<svg class="shape" viewBox="0 0 100 100"><polygon points="50,5 95,40 80,95 20,95 5,40" fill="${color}"/></svg>`,
            hexagon: `<svg class="shape" viewBox="0 0 100 100"><polygon points="25,5 75,5 95,50 75,95 25,95 5,50" fill="${color}"/></svg>`,
            star: `<svg class="shape" viewBox="0 0 100 100"><polygon points="50,5 61,40 95,40 68,62 79,95 50,75 21,95 32,62 5,40 39,40" fill="${color}"/></svg>`,
            heart: `<svg class="shape" viewBox="0 0 100 100"><path d="M50,80 C0,40 20,-10 50,20 C80,-10 100,40 50,80" fill="${color}"/></svg>`,
            octagon: `<svg class="shape" viewBox="0 0 100 100"><polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="${color}"/></svg>`,
            cross: `<svg class="shape" viewBox="0 0 100 100"><path d="M35,5 H65 V35 H95 V65 H65 V95 H35 V65 H5 V35 H35 Z" fill="${color}"/></svg>`,
            moon: `<svg class="shape" viewBox="0 0 100 100"><path d="M50,5 C25,5 5,25 5,50 C5,75 25,95 50,95 C75,95 95,75 95,50 C95,25 75,5 50,5 C50,5 75,20 75,50 C75,80 50,95 50,95" fill="${color}"/></svg>`,
            oval: `<svg class="shape" viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="45" ry="30" fill="${color}"/></svg>`,
            rectangle: `<svg class="shape" viewBox="0 0 100 100"><rect x="5" y="20" width="90" height="60" fill="${color}"/></svg>`,
            trapezoid: `<svg class="shape" viewBox="0 0 100 100"><polygon points="20,80 80,80 95,20 5,20" fill="${color}"/></svg>`,
            parallelogram: `<svg class="shape" viewBox="0 0 100 100"><polygon points="20,80 80,80 95,20 35,20" fill="${color}"/></svg>`,
            rhombus: `<svg class="shape" viewBox="0 0 100 100"><polygon points="50,5 95,50 50,95 5,50" fill="${color}"/></svg>`
        };
        
        // If shape type is not found, use a fallback shape with the provided color
        if (!svgs[type]) {
            console.error(`Shape type "${type}" not found`);
            return `<svg class="shape" viewBox="0 0 100 100"><rect x="5" y="5" width="90" height="90" fill="${color || '#FF5252'}"/></svg>`;
        }
        return svgs[type];
    }

    flipCard(card) {
        if (!this.canFlip || card.classList.contains('flipped') || this.flippedCards.includes(card)) {
            return;
        }

        card.classList.add('flipped');
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.totalMoves++;
            this.movesDisplay.textContent = this.moves;
            this.totalMovesDisplay.textContent = this.totalMoves;
            this.checkMatch();
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const match = card1.dataset.shape === card2.dataset.shape && 
                     card1.dataset.color === card2.dataset.color;

        this.canFlip = false;
        setTimeout(() => {
            if (!match) {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            } else {
                this.matchedPairs++;
                if (this.matchedPairs === (this.gridSize * this.gridSize) / 2) {
                    alert(`Congratulations! You won in ${this.moves} moves!\nTotal moves in all games: ${this.totalMoves}`);
                }
            }
            this.flippedCards = [];
            this.canFlip = true;
        }, 1000);
    }

    setupEventListeners() {
        this.difficultyButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.difficultyButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.gridSize = parseInt(button.dataset.size);
                this.initializeGame();
            });
        });
    }
}

// Initialize the game
new MemoryGame();