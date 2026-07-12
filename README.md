# Terminal Portfolio - Dang-Khoa N. Nguyen

A static web-based terminal emulator designed as an interactive academic portfolio. 
Engineered with modular Vanilla JavaScript, semantic HTML5, and CSS variables.

## Architecture

The project requires no build pipeline. It strictly utilizes native ES modules.

- **`js/data/FileSystem.js`**: Contains static portfolio text content structured as a virtual file hierarchy.
- **`js/core/CommandProcessor.js`**: Parses terminal commands and computes string outputs.
- **`js/core/AutoPresenter.js`**: Orchestrates the automated typing sequence for presentation purposes.
- **`js/core/TerminalController.js`**: Handles DOM manipulation and user input events.
- **`css/`**: Separated by concern (variables, reset, components).

## Local Development

Ensure you are utilizing a local web server to prevent browser CORS restrictions with ES modules.

Using Python:
\`\`\`bash
python3 -m http.server 8000
\`\`\`
Navigate to `http://localhost:8000`.

## GitHub Pages Deployment

1. Initialize repository and commit source files.
2. Push to branch `main`.
3. Navigate to **Settings > Pages** in your GitHub repository.
4. Set source to `Deploy from a branch` selecting `main` and `/ (root)`.
5. The application will deploy natively without build actions.

## Presentation Mode

To initiate the automated sequence during a presentation:
1. Set browser to full screen (`F11`).
2. Input `./intro.sh` and press `Enter`.
3. The system will automatically execute a predefined command sequence to present the portfolio content.1