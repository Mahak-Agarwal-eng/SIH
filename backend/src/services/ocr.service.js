const Tesseract = require('tesseract.js');

async function ocrExtract(buffer, mimeType) {
	// Simple heuristic: if image, run Tesseract; if PDF, return demo JSON
	if (mimeType && mimeType.startsWith('image/')) {
		const { data } = await Tesseract.recognize(buffer, 'eng');
		return basicExtractFromText(data.text);
	}

	if (mimeType === 'application/pdf') {
		// Demo JSON for PDFs
		return {
			studentName: 'Demo Student',
			rollNumber: 'DEMO12345',
			course: 'Demo Course',
			institution: 'Demo Institution',
			yearOfPassing: new Date().getFullYear(),
			rawText: 'PDF OCR not implemented in demo; using placeholder values.'
		};
	}

	// Fallback
	return {
		studentName: 'Unknown',
		rollNumber: 'UNKNOWN',
		course: 'Unknown',
		institution: 'Unknown',
		yearOfPassing: new Date().getFullYear(),
		rawText: ''
	};
}

function basicExtractFromText(text) {
	// Extremely naive parsing; in a real system you'd use regexes/LLMs/templates
	const lines = (text || '').split('\n').map(l => l.trim()).filter(Boolean);
	return {
		studentName: lines[0] || 'Unknown',
		rollNumber: lines.find(l => /roll|reg|id/i.test(l)) || 'UNKNOWN',
		course: lines.find(l => /b\.?tech|bachelor|master|course/i.test(l)) || 'Unknown',
		institution: lines.find(l => /university|college|institute/i.test(l)) || 'Unknown',
		yearOfPassing: detectYear(lines) || new Date().getFullYear(),
		rawText: text
	};
}

function detectYear(lines) {
	for (const l of lines) {
		const m = l.match(/(20\d{2}|19\d{2})/);
		if (m) return Number(m[1]);
	}
	return null;
}

module.exports = { ocrExtract };


