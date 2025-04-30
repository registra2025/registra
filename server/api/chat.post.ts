import { defineEventHandler, readBody } from 'h3';

// Stub chat API to prevent errors and allow site to load
export default defineEventHandler(async (event) => {
  const { message, product } = await readBody(event);
  // Simple echo response
  return { text: `Echo from server: '${message}' about '${product?.itemName || 'unknown'}'` };
});
