export const processGcpVertexData = (imageData) => {
  let resultData = {};
  const { requiredData, rawData} = imageData;
  let cleanedString = rawData.replace(/```json\n([\s\S]*?)\n```\/"}/g, '');

  resultData.requiredData = requiredData;
  resultData.rawData = cleanedString;
  return resultData;
}