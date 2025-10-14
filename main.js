// LumiLedger Brochure Site - Main JavaScript
// No tracking, no analytics, just functionality

(function() {
    'use strict';

    let comparisonData = [];
    let sortState = { column: null, direction: 'asc' };

    // Load comparison data
    async function loadComparisonData() {
        try {
            const response = await fetch('data/comparison.json');
            comparisonData = await response.json();
            renderTable(comparisonData);
        } catch (error) {
            console.error('Error loading comparison data:', error);
            // Fallback data in case JSON fails to load
            comparisonData = [
                {
                    feature: "Data Entry Method",
                    lumiledger: "Link + Load from bank/card",
                    traditional: "Manual entry required",
                    other: "Manual or CSV import"
                }
            ];
            renderTable(comparisonData);
        }
    }

    // Render comparison table
    function renderTable(data) {
        const tbody = document.getElementById('comparison-body');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${escapeHtml(row.feature)}</strong></td>
                <td>${escapeHtml(row.lumiledger)}</td>
                <td>${escapeHtml(row.traditional)}</td>
                <td>${escapeHtml(row.other)}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Sort table by column
    function sortTable(column) {
        // Toggle direction if clicking same column, otherwise reset to ascending
        if (sortState.column === column) {
            sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
        } else {
            sortState.column = column;
            sortState.direction = 'asc';
        }

        // Sort data
        const sortedData = [...comparisonData].sort((a, b) => {
            const aVal = a[column].toLowerCase();
            const bVal = b[column].toLowerCase();
            
            if (sortState.direction === 'asc') {
                return aVal.localeCompare(bVal);
            } else {
                return bVal.localeCompare(aVal);
            }
        });

        // Update sort icons
        updateSortIcons(column, sortState.direction);
        
        // Re-render table
        renderTable(sortedData);
    }

    // Update sort icons in table headers
    function updateSortIcons(activeColumn, direction) {
        const headers = document.querySelectorAll('.comparison-table th.sortable');
        headers.forEach(header => {
            const column = header.getAttribute('data-sort');
            const icon = header.querySelector('.sort-icon');
            if (icon) {
                icon.className = 'sort-icon';
                if (column === activeColumn) {
                    icon.classList.add(direction);
                }
            }
        });
    }

    // Convert table data to CSV
    function tableToCSV() {
        const headers = ['Feature', 'LumiLedger', 'Traditional Software', 'Other Solutions'];
        const rows = comparisonData.map(row => [
            row.feature,
            row.lumiledger,
            row.traditional,
            row.other
        ]);

        // Escape and quote CSV values
        const escapeCsvValue = (val) => {
            if (val.includes(',') || val.includes('"') || val.includes('\n')) {
                return '"' + val.replace(/"/g, '""') + '"';
            }
            return val;
        };

        const csvContent = [
            headers.map(escapeCsvValue).join(','),
            ...rows.map(row => row.map(escapeCsvValue).join(','))
        ].join('\n');

        return csvContent;
    }

    // Download CSV file
    function downloadCSV() {
        const csv = tableToCSV();
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'lumiledger-comparison.csv');
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }

    // Generate PDF from comparison table
    function downloadPDF() {
        // Create a simple PDF-like HTML structure
        const pdfWindow = window.open('', '_blank');
        
        const headers = ['Feature', 'LumiLedger', 'Traditional Software', 'Other Solutions'];
        const rows = comparisonData.map(row => [
            row.feature,
            row.lumiledger,
            row.traditional,
            row.other
        ]);

        let tableHTML = '<table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif;">';
        tableHTML += '<thead><tr>';
        headers.forEach(header => {
            tableHTML += `<th style="border: 1px solid #000; padding: 10px; background: #000; color: #fff; text-align: left;">${escapeHtml(header)}</th>`;
        });
        tableHTML += '</tr></thead><tbody>';
        
        rows.forEach(row => {
            tableHTML += '<tr>';
            row.forEach((cell, idx) => {
                const style = idx === 0 ? 'font-weight: bold;' : '';
                tableHTML += `<td style="border: 1px solid #000; padding: 10px; ${style}">${escapeHtml(cell)}</td>`;
            });
            tableHTML += '</tr>';
        });
        tableHTML += '</tbody></table>';

        pdfWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>LumiLedger Comparison</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 40px;
                        color: #000;
                    }
                    h1 {
                        font-size: 24px;
                        margin-bottom: 20px;
                    }
                    @media print {
                        body { margin: 20px; }
                    }
                </style>
            </head>
            <body>
                <h1>LumiLedger Comparison Matrix</h1>
                ${tableHTML}
                <script>
                    window.onload = function() {
                        window.print();
                    };
                </script>
            </body>
            </html>
        `);
        pdfWindow.document.close();
    }

    // Initialize when DOM is ready
    function init() {
        // Load comparison data
        loadComparisonData();

        // Add sort event listeners to table headers
        const headers = document.querySelectorAll('.comparison-table th.sortable');
        headers.forEach(header => {
            header.addEventListener('click', function() {
                const column = this.getAttribute('data-sort');
                sortTable(column);
            });
        });

        // Add download button event listeners
        const csvButton = document.getElementById('download-csv');
        const pdfButton = document.getElementById('download-pdf');
        
        if (csvButton) {
            csvButton.addEventListener('click', downloadCSV);
        }
        
        if (pdfButton) {
            pdfButton.addEventListener('click', downloadPDF);
        }

        // Smooth scroll for anchor links (additional enhancement)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
