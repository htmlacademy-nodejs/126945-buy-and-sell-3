`use strict`;

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {getRandomInt, shuffle} = require(`../../utils`);
const {ExitCode} = require(`../../constants`);

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const readDataFromFile = async (pathToFile) => {
  try {
    const data = await fs.readFile(pathToFile, `utf8`);
    return data.trim().split(`\n`);
  } catch (e) {
    console.error(chalk.red(`Can't read the file`));
    console.error(chalk.red(e));
    process.exit(ExitCode.failure);
  }
};

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const getPictureFileName = (number) => {
  const id = (number < 10) ? `0` + number : String(number);
  return `item${id}.jpg`;
};

const generateOffers = (count, titles, sentences, categories) => (
  Array(count).fill({}).map(() => ({
    type: OfferType[Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)]],
    title: titles[getRandomInt(0, titles.length - 1)],
    description: shuffle(sentences).slice(1, 5).join(` `),
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    category: [categories[getRandomInt(0, categories.length - 1)]],
  }))
);

module.exports = {
  name: `--generate`,
  async run(count) {
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (count > 1000) {
      console.error(chalk.red(`Не больше 1000 объявлений`));
      process.exit(ExitCode.failure);
    }

    const titles = await readDataFromFile(FILE_SENTENCES_PATH);
    const sentences = await readDataFromFile(FILE_TITLES_PATH);
    const categories = await readDataFromFile(FILE_CATEGORIES_PATH);

    const content = JSON.stringify(generateOffers(countOffer, titles, sentences, categories));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit(ExitCode.success);

    } catch (e) {
      console.error(chalk.red(`Can't write data to file...`));
      console.error(chalk.red(e));
      process.exit(ExitCode.failure);
    }
  }
};
