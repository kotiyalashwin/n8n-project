export function generateRandomString(length = 12) {
	// Get current date-time as base (ISO string without special chars)
	const dateTime = new Date().toISOString().replace(/[-:.TZ]/g, "");

	// Random part
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let randomPart = "";
	for (let i = 0; i < length; i++) {
		randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
	}

	// Combine datetime + random part
	return dateTime + randomPart;
}


