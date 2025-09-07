// Build script to convert Markdown files to HTML for GitHub Pages
import fs from 'fs';
import path from 'path';

// Simple markdown to HTML converter
function markdownToHtml(markdown) {
    let html = markdown
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')

    // Bold and italic
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')

    // Code blocks
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
        .replace(/`([^`]+)`/gim, '<code>$1</code>')

    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')

    // Lists
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>')

    // Line breaks
    .replace(/\n\n/gim, '</p><p>')
        .replace(/\n/gim, '<br>')

    // Wrap in paragraphs
    .replace(/^(?!<[h1-6]|<pre|<li)(.*)$/gim, '<p>$1</p>')

    // Clean up empty paragraphs
    .replace(/<p><\/p>/gim, '')
        .replace(/<p><br><\/p>/gim, '')

    // Fix list wrapping
    .replace(/<li>(.*?)<\/li>/gim, (match, content) => {
            return `<li>${content.replace(/<p>(.*?)<\/p>/gim, '$1')}</li>`;
        })
        .replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>')
        .replace(/<\/ul><ul>/gim, '');

    return html;
}

// HTML template
function createHtmlPage(title, content) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 2rem;
            background: white;
            min-height: 100vh;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            margin: -2rem -2rem 2rem -2rem;
            border-radius: 0 0 15px 15px;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }
        
        .header p {
            opacity: 0.9;
            font-size: 1.1rem;
        }
        
        .back-link {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 0.5rem 1rem;
            text-decoration: none;
            border-radius: 5px;
            margin-bottom: 2rem;
            transition: background 0.2s;
        }
        
        .back-link:hover {
            background: #5a67d8;
        }
        
        h1, h2, h3 {
            color: #2d3748;
            margin: 2rem 0 1rem 0;
        }
        
        h1 {
            font-size: 2.2rem;
            border-bottom: 3px solid #667eea;
            padding-bottom: 0.5rem;
        }
        
        h2 {
            font-size: 1.8rem;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 0.3rem;
        }
        
        h3 {
            font-size: 1.4rem;
            color: #4a5568;
        }
        
        p {
            margin-bottom: 1rem;
            color: #4a5568;
        }
        
        code {
            background: #f1f5f9;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.9rem;
            color: #e53e3e;
        }
        
        pre {
            background: #2d3748;
            color: #e2e8f0;
            padding: 1rem;
            border-radius: 8px;
            overflow-x: auto;
            margin: 1rem 0;
        }
        
        pre code {
            background: none;
            color: inherit;
            padding: 0;
        }
        
        ul, ol {
            margin: 1rem 0 1rem 2rem;
        }
        
        li {
            margin-bottom: 0.5rem;
            color: #4a5568;
        }
        
        a {
            color: #667eea;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
        }
        
        th, td {
            border: 1px solid #e2e8f0;
            padding: 0.75rem;
            text-align: left;
        }
        
        th {
            background: #f8f9fa;
            font-weight: 600;
            color: #2d3748;
        }
        
        .footer {
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #4a5568;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${title}</h1>
            <p>Algorithm Study Repository Documentation</p>
        </div>
        
        <a href="index.html" class="back-link">← Back to Home</a>
        
        <div class="content">
            ${content}
        </div>
        
        <div class="footer">
            <p>Algorithm Study Repository - Comprehensive Algorithm Learning Resource</p>
        </div>
    </div>
</body>
</html>`;
}

// Convert markdown files to HTML
const markdownFiles = [
    { input: 'README.md', output: 'README.html', title: 'Algorithm Reference' },
    { input: 'GETTING_STARTED.md', output: 'GETTING_STARTED.html', title: 'Getting Started Guide' },
    { input: 'BENCHMARK_GUIDE.md', output: 'BENCHMARK_GUIDE.html', title: 'Benchmark Guide' },
    { input: 'SUMMARY.md', output: 'SUMMARY.html', title: 'Project Summary' }
];

console.log('Building documentation for GitHub Pages...');

markdownFiles.forEach(file => {
    try {
        const markdown = fs.readFileSync(file.input, 'utf8');
        const html = markdownToHtml(markdown);
        const fullHtml = createHtmlPage(file.title, html);

        fs.writeFileSync(file.output, fullHtml);
        console.log(`✓ Created ${file.output}`);
    } catch (error) {
        console.error(`✗ Error processing ${file.input}:`, error.message);
    }
});

console.log('Documentation build complete!');
console.log('Files ready for GitHub Pages:');
markdownFiles.forEach(file => {
    console.log(`  - ${file.output}`);
});
console.log('  - index.html (main entry page)');