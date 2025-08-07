# IndiCASA Research Website

A modern, responsive React website showcasing the IndiCASA research project - a comprehensive dataset and bias evaluation framework for Large Language Models in Indian contexts.

## About IndiCASA

**IndiCASA** (**Indi**Bias-based **C**ontextually **A**ligned **S**tereotypes and **A**nti-stereotypes) is a groundbreaking research project that addresses bias evaluation in Large Language Models (LLMs) specifically for Indian socio-cultural contexts.

### Key Features

- 🏆 **AAAI 2025 Research Paper** - Cutting-edge AI research
- 📊 **2,575 Human-Validated Sentences** - Comprehensive dataset
- 🎯 **5 Bias Dimensions** - Caste, Gender, Religion, Disability, Socioeconomic
- 🧠 **Contrastive Learning Framework** - Advanced ML techniques
- 🌍 **Cultural Context-Aware** - Designed for Indian social structures

### Research Highlights

- First comprehensive bias evaluation framework for Indian contexts
- Novel contrastive learning approach for embedding-based bias detection
- Extensive evaluation across 8+ state-of-the-art language models
- Human-AI collaborative dataset creation with expert validation

## Website Features

### 🎨 Modern Design
- Responsive, mobile-first design
- Smooth scroll animations and interactions
- Professional academic styling
- Interactive visualizations

### 📱 Responsive Layout
- Optimized for desktop, tablet, and mobile devices
- Progressive Web App (PWA) support
- Fast loading and performance optimized

### 🔍 SEO Optimized
- Structured data markup
- Open Graph and Twitter meta tags
- Academic research-focused content

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/indicasa-research-website.git
   cd indicasa-research-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the website

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
src/
├── App.js          # Main React component with all sections
├── App.css         # Comprehensive styling
├── index.js        # Application entry point
├── index.css       # Global styles
└── ...

public/
├── index.html      # HTML template with SEO meta tags
├── manifest.json   # PWA configuration
└── ...
```

## Sections Overview

### 🏠 Hero Section
- Eye-catching introduction with animated elements
- Key statistics and call-to-action buttons
- Interactive embedding space visualization

### 📖 About Section
- Research problem and solution overview
- Key research highlights and impact
- Visual feature cards

### 🔬 Methodology Section
- Three-phase research approach visualization
- Detailed bias dimensions breakdown
- Process flow illustrations

### 📊 Results Section
- Key findings and insights
- Model comparison tables
- Interactive result visualizations

### 📂 Dataset Section
- Comprehensive dataset statistics
- Category-wise breakdown charts
- Example sentences and access information

## Customization

### Styling
The website uses custom CSS with CSS Grid and Flexbox for layout. Key design elements:

- **Color Scheme**: Purple gradient theme (`#667eea` to `#764ba2`)
- **Typography**: System font stack for optimal performance
- **Animations**: CSS transitions and transforms
- **Responsive**: Mobile-first approach with breakpoints

### Content Updates
To update research content:

1. Modify the data in `App.js`
2. Update statistics and findings
3. Add new sections as needed
4. Update meta tags in `public/index.html`

## Performance Features

- **Lazy Loading**: Optimized image and content loading
- **Code Splitting**: Automatic optimization by Create React App
- **Caching**: Service worker for offline capability
- **Compression**: Gzip compression for production builds

## SEO and Analytics

### Built-in SEO Features
- Semantic HTML structure
- Schema.org structured data
- Open Graph meta tags
- Twitter Card support
- Proper heading hierarchy

### Analytics Integration
To add analytics:

1. Add Google Analytics or similar tracking code
2. Update privacy policy if needed
3. Implement cookie consent if required

## Deployment Options

### Netlify (Recommended)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy automatically on push

### Vercel
1. Import your GitHub repository
2. Vercel auto-detects React configuration
3. Deploy with one click

### GitHub Pages
1. Install `gh-pages`: `npm install --save-dev gh-pages`
2. Add deploy script to `package.json`
3. Run `npm run deploy`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -am 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Create a Pull Request

## Research Links

- **GitHub Repository**: [IndiCASA Dataset & Code](https://github.com/santhosh-gnse/IndiCASA.git)
- **Research Paper**: AAAI 2025 (link to be updated)
- **Research Team**: Centre for Responsible AI, IIT Madras & UT Dallas

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Centre for Responsible AI, IIT Madras
- University of Texas at Dallas
- AAAI 2025 Conference
- React.js community for excellent documentation and tools

## Contact

For questions about the research:
- Research Team: [Contact Information]
- Website Issues: [GitHub Issues]

---

**Note**: This website is created to showcase academic research. The IndiCASA dataset and research are intended for academic and research purposes only.
