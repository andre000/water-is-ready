/* eslint-disable no-use-before-define */
const { Recorder } = require('node-rtsp-recorder');
require('@tensorflow/tfjs-node');
const deeplab = require('@tensorflow-models/deeplab');
const inkjet = require('inkjet');
const fs = require('fs');
const rimraf = require('rimraf');

const loadModel = async () => {
  const modelName = 'pascal'; // set to your preferred model, either `pascal`, `cityscapes` or `ade20k`
  const quantizationBytes = 2; // either 1, 2 or 4
  return deeplab.load({ base: modelName, quantizationBytes });
};

const getImage = () => {
  const rec = new Recorder({
    url: process.env.RSTP_PATH,
    folder: './data/',
    name: 'bebedouro',
    type: 'image',
  });

  rec.captureImage(() => {
    console.clear();
    console.log('Image Captured!');
    detectPeople(rec.writeStream.spawnargs.splice(-1)[0].replace(/\\/g, '/'));
  });
};

const detectPeople = (imgPath) => {
  inkjet.decode(fs.readFileSync(imgPath), async (err, decode) => {
    const model = await loadModel();
    const output = await model.segment(decode);

    const fileExists = fs.existsSync('./log.json');

    const log = fileExists ? JSON.parse(fs.readFileSync('log.json')) : [];

    if (output.legend.person) {
      log.push({ info: 'Pessoas no bebedouro', data: new Date() });
      fs.writeFileSync('log.json', JSON.stringify(log));
    }

    const lastPerson = log.length ? log.splice(-1)[0].data : null;
    const diffDate = lastPerson
      ? new Date(lastPerson) - new Date()
      : '';

    console.log('Detected:', Object.keys(output.legend).join(', '));
    console.log(diffDate);

    rimraf('data/**/*.jpg', () => {
      getImage();
    });
  });
};

module.exports = getImage;
