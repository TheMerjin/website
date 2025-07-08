import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to extract book metadata from filename
function parseBookFilename(filename) {
  // Remove .xhtml extension
  const name = filename.replace('.xhtml', '');
  
  // Split by underscore to separate author and title
  const parts = name.split('_');
  
  if (parts.length >= 2) {
    const author = parts[0].split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    const title = parts.slice(1).join('_').split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    return { author, title, filename: name };
  }
  
  return { author: 'Unknown', title: name, filename: name };
}

// Function to categorize books
function categorizeBook(author, title) {
  const titleLower = title.toLowerCase();
  const authorLower = author.toLowerCase();
  
  // Philosophy
  if (authorLower.includes('plato') || authorLower.includes('aristotle') || 
      authorLower.includes('marcus aurelius') || authorLower.includes('epictetus') ||
      titleLower.includes('meditations') || titleLower.includes('republic') ||
      titleLower.includes('ethics') || titleLower.includes('philosophy')) {
    return 'philosophy';
  }
  
  // Science
  if (authorLower.includes('darwin') || authorLower.includes('newton') ||
      titleLower.includes('origin of species') || titleLower.includes('wealth of nations') ||
      titleLower.includes('theory') || titleLower.includes('science')) {
    return 'science';
  }
  
  // Literature
  if (authorLower.includes('dickens') || authorLower.includes('austen') || 
      authorLower.includes('shakespeare') || authorLower.includes('twain') ||
      titleLower.includes('pride and prejudice') || titleLower.includes('pickwick')) {
    return 'literature';
  }
  
  // History
  if (authorLower.includes('thucydides') || authorLower.includes('franklin') ||
      titleLower.includes('history') || titleLower.includes('autobiography') ||
      titleLower.includes('war')) {
    return 'history';
  }
  
  // Fiction
  if (authorLower.includes('conan doyle') || authorLower.includes('christie') ||
      titleLower.includes('sherlock') || titleLower.includes('mystery') ||
      titleLower.includes('adventure')) {
    return 'fiction';
  }
  
  // Default to nonfiction
  return 'nonfiction';
}

// Function to generate book descriptions
function generateDescription(author, title, category) {
  const descriptions = {
    philosophy: 'A foundational work of philosophical thought and wisdom.',
    science: 'A groundbreaking scientific work that shaped our understanding of the world.',
    literature: 'A timeless literary masterpiece that continues to resonate with readers.',
    history: 'An important historical account that provides insight into the past.',
    fiction: 'An engaging work of fiction that showcases the author\'s storytelling prowess.',
    nonfiction: 'A valuable work of non-fiction that offers knowledge and insights.'
  };
  
  return descriptions[category] || 'A classic work of literature and thought.';
}

// Main scanning function
function scanBooks() {
  const booksDir = path.join(__dirname, '..', 'public', 'standard-ebooks-output');
  const outputFile = path.join(__dirname, '..', 'src', 'data', 'books.json');
  
  try {
    // Read all files in the directory
    const files = fs.readdirSync(booksDir);
    const xhtmlFiles = files.filter(file => file.endsWith('.xhtml'));
    
    console.log(`Found ${xhtmlFiles.length} book files`);
    
    const books = [];
    
    xhtmlFiles.forEach(filename => {
      const { author, title, filename: bookId } = parseBookFilename(filename);
      const category = categorizeBook(author, title);
      const description = generateDescription(author, title, category);
      
      books.push({
        id: bookId,
        title,
        author,
        category,
        description,
        filename: filename,
        year: 'Unknown', // Could be extracted from content if needed
        added: new Date().toISOString().split('T')[0]
      });
    });
    
    // Sort books by author, then by title
    books.sort((a, b) => {
      if (a.author !== b.author) {
        return a.author.localeCompare(b.author);
      }
      return a.title.localeCompare(b.title);
    });
    
    // Group by category
    const booksByCategory = {};
    books.forEach(book => {
      if (!booksByCategory[book.category]) {
        booksByCategory[book.category] = [];
      }
      booksByCategory[book.category].push(book);
    });
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the catalog
    const catalog = {
      totalBooks: books.length,
      lastUpdated: new Date().toISOString(),
      books,
      booksByCategory
    };
    
    fs.writeFileSync(outputFile, JSON.stringify(catalog, null, 2));
    
    console.log(`Catalog written to ${outputFile}`);
    console.log(`Total books: ${books.length}`);
    
    // Print summary by category
    Object.entries(booksByCategory).forEach(([category, categoryBooks]) => {
      console.log(`${category}: ${categoryBooks.length} books`);
    });
    
  } catch (error) {
    console.error('Error scanning books:', error);
  }
}

// Run the scanner
scanBooks(); 