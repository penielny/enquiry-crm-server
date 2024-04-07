export function parseTicketMessage({ message, enquiry, link }) {
  const templatePath = "./ticket/index.html"; // Path to the HTML template file
  const template = fs.readFileSync(templatePath, "utf8"); // Read the template file

  // Replace placeholders in the template with provided parameters
  const formattedMessage = template
    .replace("{{message}}", message)
    .replace("{{enquiry}}", enquiry)
    .replace("{{link}}", link)
    .replace("{{date}}", new Date().toLocaleString());
}
