const fs = require('fs');
const path = require('path');

const root = __dirname;
const galleryRoot = path.join(root, 'img', 'galeria');
const outputPath = path.join(root, 'js', 'gallery-data.js');
const recognitionRoot = path.join(root, 'img', 'reconocimientos');
const descriptionsPath = path.join(root, 'descripciones-fotos.json');
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const descriptionGroups = fs.existsSync(descriptionsPath)
  ? JSON.parse(fs.readFileSync(descriptionsPath, 'utf8'))
  : {};
const descriptions = Object.values(descriptionGroups).reduce(
  (allDescriptions, group) => ({ ...allDescriptions, ...group }),
  {}
);
const monthNames = {
  enero: 'Enero',
  febrero: 'Febrero',
  marzo: 'Marzo',
  abril: 'Abril',
  mayo: 'Mayo',
  junio: 'Junio',
  julio: 'Julio',
  agosto: 'Agosto',
  septiembre: 'Septiembre',
  octubre: 'Octubre',
  noviembre: 'Noviembre',
  diciembre: 'Diciembre'
};

function getImages(folder) {
  if (!fs.existsSync(folder)) return [];

  return fs.readdirSync(folder, { withFileTypes: true })
    .filter(entry => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
    .map(entry => {
      const relativePath = path.relative(root, path.join(folder, entry.name)).split(path.sep).join('/');
      const title = path.parse(entry.name).name.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
      const customDescription = descriptions[relativePath];
      return {
        src: relativePath,
        description: customDescription?.description || (title ? `Recuerdo de la Tuna UNI: ${title}.` : 'Recuerdo de la Tuna UNI.')
      };
    })
    .sort((first, second) => first.src.localeCompare(second.src, 'es'));
}

function getMonthLabel(folderName) {
  return monthNames[folderName.toLowerCase()] || folderName;
}

function get2026Months() {
  const yearFolder = path.join(galleryRoot, '2026');
  if (!fs.existsSync(yearFolder)) return [];

  return fs.readdirSync(yearFolder, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => ({
      name: getMonthLabel(entry.name),
      order: Object.keys(monthNames).indexOf(entry.name.toLowerCase()),
      images: getImages(path.join(yearFolder, entry.name))
    }))
    .sort((first, second) => {
      if (first.order !== -1 && second.order !== -1) return first.order - second.order;
      return first.name.localeCompare(second.name, 'es');
    })
    .map(({ name, images }) => ({ name, images }));
}

const albums = {
  antiguas: {
    label: 'Fotos antiguas',
    months: [
      {
        name: 'Archivo histórico',
        images: getImages(path.join(galleryRoot, 'antiguas'))
      }
    ]
  },
  '2026': {
    label: '2026',
    months: get2026Months()
  }
};

const recognitions = getImages(recognitionRoot).map(image => ({
  ...image,
  description: image.description.startsWith('Recuerdo de la Tuna UNI:')
    ? `Reconocimiento obtenido: ${image.description.replace('Recuerdo de la Tuna UNI: ', '').replace(/\.$/, '')}.`
    : image.description
}));

const output = `window.galleryAlbums = ${JSON.stringify(albums, null, 2)};\nwindow.galleryRecognitions = ${JSON.stringify(recognitions, null, 2)};\n`;
fs.writeFileSync(outputPath, output, 'utf8');

const totalImages = Object.values(albums).reduce(
  (total, album) => total + album.months.reduce((monthTotal, month) => monthTotal + month.images.length, 0),
  0
);
console.log(`Galería generada: ${totalImages} fotos en ${outputPath}`);
