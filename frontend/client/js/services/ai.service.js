async function analyzeImage(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);
  const res = await axios.post(`${AI_SERVICE_URL}/analyze`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 30000
  });
  return res.data;
}
async function analyzeText(description) {
  const res = await axios.post(`${AI_SERVICE_URL}/analyze-text`, { text: description });
  return res.data;
}
async function analyzeComplaint(imageFile, description) {
  const formData = new FormData();
  formData.append('image', imageFile);
  if (description) formData.append('description', description);
  const res = await axios.post(`${AI_SERVICE_URL}/analyze-complaint`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 45000
  });
  return res.data;
}