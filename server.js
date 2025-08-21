import express from 'express';
import { createCanvas, loadImage } from 'canvas';
import path from 'path';

const app = express();
const port = 3001;

app.get('/api/og', async (req, res) => {
  try {
    const title = req.query.title || 'Shah Syed — Product Manager';
    const description = req.query.description || 'Product manager that can innovate, engineer, and grow any solution.';

    // Create canvas
    const width = 1200;
    const height = 630;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Dark background (matching your site's theme)
    ctx.fillStyle = '#0d0d0d'; // hsl(0 0% 5%) dark theme background
    ctx.fillRect(0, 0, width, height);

    // Card background with subtle border (matching your glass card design)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'; // Dark theme card background
    ctx.roundRect(60, 60, width - 120, height - 120, 16);
    ctx.fill();
    
    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'; // Dark theme border
    ctx.lineWidth = 1;
    ctx.roundRect(60, 60, width - 120, height - 120, 16);
    ctx.stroke();

    // Set text properties for dark theme
    ctx.fillStyle = '#ffffff'; // White text
    ctx.textAlign = 'left';

    // Title
    const maxTitleWidth = width - 200;
    let fontSize = 48;
    ctx.font = `600 ${fontSize}px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    
    // Adjust font size if title is too long
    while (ctx.measureText(title).width > maxTitleWidth && fontSize > 28) {
      fontSize -= 2;
      ctx.font = `600 ${fontSize}px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    }
    
    // Word wrap title
    const words = title.split(' ');
    const lines = [];
    let currentLine = words[0];
    
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxTitleWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);

    // Draw title lines
    let y = 150;
    lines.forEach((line, index) => {
      ctx.fillText(line, 120, y + (index * (fontSize + 12)));
    });

    // Description
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'; // Muted white for dark theme
    ctx.font = '24px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    
    // Word wrap description
    const descWords = description.split(' ');
    const descLines = [];
    let descCurrentLine = descWords[0];
    const maxDescWidth = width - 200;
    
    for (let i = 1; i < descWords.length; i++) {
      const word = descWords[i];
      const width = ctx.measureText(descCurrentLine + ' ' + word).width;
      if (width < maxDescWidth && descLines.length < 2) { // Limit to 2 lines
        descCurrentLine += ' ' + word;
      } else {
        descLines.push(descCurrentLine);
        if (descLines.length < 2) {
          descCurrentLine = word;
        } else {
          break; // Stop if we already have 2 lines
        }
      }
    }
    if (descLines.length < 2) {
      descLines.push(descCurrentLine);
    }

    // Draw description lines
    let descY = y + (lines.length * (fontSize + 12)) + 30;
    descLines.forEach((line, index) => {
      // Truncate if too long and add ellipsis
      if (index === descLines.length - 1 && ctx.measureText(line).width > maxDescWidth) {
        while (ctx.measureText(line + '...').width > maxDescWidth && line.length > 0) {
          line = line.slice(0, -1);
        }
        line += '...';
      }
      ctx.fillText(line, 120, descY + (index * 32));
    });

    // Load and draw actual headshot
    let profileImage = null;
    try {
      profileImage = await loadImage(path.join(process.cwd(), 'public', 'headhsot.jpg'));
    } catch (error) {
      console.log('Could not load headshot, using fallback');
    }

    // Author section
    const authorY = height - 100;
    
    if (profileImage) {
      // Draw actual headshot as circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(150, authorY, 35, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();
      
      // Scale and center the image
      const imageSize = 70;
      ctx.drawImage(profileImage, 150 - imageSize/2, authorY - imageSize/2, imageSize, imageSize);
      ctx.restore();
      
      // Add subtle border around profile image
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(150, authorY, 35, 0, 2 * Math.PI);
      ctx.stroke();
    } else {
      // Fallback: colored circle with initials
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.arc(150, authorY, 35, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 20px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('SS', 150, authorY + 6);
    }
    
    // Author name and website
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 22px Inter';
    ctx.fillText('Shah Syed', 200, authorY - 8);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '16px Inter';
    ctx.fillText('shahsyed.com', 200, authorY + 15);

    // Send the image
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    const buffer = canvas.toBuffer('image/png');
    res.send(buffer);

  } catch (e) {
    console.error('Error generating OG image:', e.message);
    res.status(500).send('Failed to generate the image');
  }
});

app.listen(port, () => {
  console.log(`OG Image API server running at http://localhost:${port}`);
});