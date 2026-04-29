import sharp from 'sharp';

sharp('public/og-image.svg')
  .resize(1200, 630)
  .png()
  .toFile('public/og-image.png')
  .then(() => console.log('✅ og-image.png criado!'))
  .catch(console.error);