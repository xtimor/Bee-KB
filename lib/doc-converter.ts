import { docs_v1 } from 'googleapis';

export interface DocumentElement {
    type: 'paragraph' | 'heading' | 'list' | 'table' | 'image';
    content: string;
    level?: number; // For headings
    style?: string;
}

/**
 * Convert Google Docs content to HTML-renderable format
 */
export function convertDocToHtml(doc: docs_v1.Schema$Document): string {
    if (!doc.body?.content) {
        return '<p>Document is empty</p>';
    }

    let html = '';

    for (const element of doc.body.content) {
        if (element.paragraph) {
            html += convertParagraph(element.paragraph);
        } else if (element.table) {
            html += convertTable(element.table);
        }
    }

    return html || '<p>No content available</p>';
}

function convertParagraph(paragraph: docs_v1.Schema$Paragraph): string {
    if (!paragraph.elements) {
        return '';
    }

    let text = '';
    for (const element of paragraph.elements) {
        if (element.textRun?.content) {
            const content = element.textRun.content;
            const style = element.textRun.textStyle;

            let styledText = escapeHtml(content);

            // Apply text styles
            if (style?.bold) {
                styledText = `<strong>${styledText}</strong>`;
            }
            if (style?.italic) {
                styledText = `<em>${styledText}</em>`;
            }
            if (style?.underline) {
                styledText = `<u>${styledText}</u>`;
            }
            if (style?.link?.url) {
                styledText = `<a href="${escapeHtml(style.link.url)}" target="_blank" rel="noopener noreferrer">${styledText}</a>`;
            }

            text += styledText;
        }
    }

    // Determine paragraph style
    const style = paragraph.paragraphStyle;
    const namedStyleType = style?.namedStyleType || 'NORMAL_TEXT';

    if (namedStyleType.startsWith('HEADING_')) {
        const level = parseInt(namedStyleType.replace('HEADING_', '')) || 1;
        return `<h${level}>${text}</h${level}>`;
    } else if (namedStyleType === 'TITLE') {
        return `<h1>${text}</h1>`;
    } else if (namedStyleType === 'SUBTITLE') {
        return `<h2>${text}</h2>`;
    } else {
        // Check if it's a list item
        if (paragraph.bullet) {
            return `<li>${text}</li>`;
        }
        return `<p>${text}</p>`;
    }
}

function convertTable(table: docs_v1.Schema$Table): string {
    if (!table.tableRows) {
        return '';
    }

    let html = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 1em 0;">';

    for (const row of table.tableRows) {
        html += '<tr>';
        if (row.tableCells) {
            for (const cell of row.tableCells) {
                html += '<td style="padding: 8px; border: 1px solid #ddd;">';
                if (cell.content) {
                    for (const element of cell.content) {
                        if (element.paragraph) {
                            html += convertParagraph(element.paragraph);
                        }
                    }
                }
                html += '</td>';
            }
        }
        html += '</tr>';
    }

    html += '</table>';
    return html;
}

function escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Extract plain text from Google Doc for search purposes
 */
export function extractPlainText(doc: docs_v1.Schema$Document): string {
    if (!doc.body?.content) {
        return '';
    }

    let text = '';

    for (const element of doc.body.content) {
        if (element.paragraph?.elements) {
            for (const textElement of element.paragraph.elements) {
                if (textElement.textRun?.content) {
                    text += textElement.textRun.content;
                }
            }
        }
    }

    return text;
}
