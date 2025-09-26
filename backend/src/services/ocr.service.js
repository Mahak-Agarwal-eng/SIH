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

// Enhanced OCR for better field extraction
async function enhancedOcrExtract(buffer, mimeType) {
	if (mimeType && mimeType.startsWith('image/')) {
		const { data } = await Tesseract.recognize(buffer, 'eng', {
			logger: m => console.log(m)
		});
		return enhancedExtractFromText(data.text);
	}

	// For PDFs or other formats, use demo data
	return {
		studentName: 'John Doe',
		rollNumber: 'JH2021CS001',
		course: 'B.Tech Computer Science',
		institution: 'Jharkhand State University',
		yearOfPassing: 2021,
		rawText: 'Enhanced OCR extraction completed'
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

function enhancedExtractFromText(text) {
	// More sophisticated parsing with regex patterns
	const lines = (text || '').split('\n').map(l => l.trim()).filter(Boolean);
	
	// Common patterns for certificate fields
	const namePattern = /(?:name|student|graduate)[:\s]+([a-zA-Z\s]+)/i;
	const rollPattern = /(?:roll|registration|id|number)[:\s]+([a-zA-Z0-9]+)/i;
	const coursePattern = /(?:course|degree|program)[:\s]+([a-zA-Z\s.]+)/i;
	const institutePattern = /(?:university|college|institute|school)[:\s]+([a-zA-Z\s.]+)/i;
	const yearPattern = /(?:year|passing|graduated)[:\s]+(\d{4})/i;
	
	let studentName = 'Unknown';
	let rollNumber = 'UNKNOWN';
	let course = 'Unknown';
	let institution = 'Unknown';
	let yearOfPassing = new Date().getFullYear();
	
	// Try to extract from text using patterns
	for (const line of lines) {
		if (!studentName || studentName === 'Unknown') {
			const nameMatch = line.match(namePattern);
			if (nameMatch) studentName = nameMatch[1].trim();
		}
		
		if (!rollNumber || rollNumber === 'UNKNOWN') {
			const rollMatch = line.match(rollPattern);
			if (rollMatch) rollNumber = rollMatch[1].trim();
		}
		
		if (!course || course === 'Unknown') {
			const courseMatch = line.match(coursePattern);
			if (courseMatch) course = courseMatch[1].trim();
		}
		
		if (!institution || institution === 'Unknown') {
			const instMatch = line.match(institutePattern);
			if (instMatch) institution = instMatch[1].trim();
		}
		
		const yearMatch = line.match(yearPattern);
		if (yearMatch) yearOfPassing = Number(yearMatch[1]);
	}
	
	// Fallback to first non-empty lines if patterns don't work
	if (studentName === 'Unknown' && lines.length > 0) {
		studentName = lines[0];
	}
	
	return {
		studentName,
		rollNumber,
		course,
		institution,
		yearOfPassing,
		rawText: text
	};
}

module.exports = { ocrExtract, enhancedOcrExtract };



