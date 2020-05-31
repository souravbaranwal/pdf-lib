import fontkit from '@pdf-lib/fontkit';
import {
  clip,
  clipEvenOdd,
  closePath,
  cmyk,
  degrees,
  drawRectangle,
  endPath,
  grayscale,
  LineCapStyle,
  LineJoinStyle,
  lineTo,
  typedArrayFor,
  moveTo,
  PDFDocument,
  popGraphicsState,
  pushGraphicsState,
  rgb,
  setDashPattern,
  setLineCap,
  setLineJoin,
  StandardFonts,
} from 'pdf-lib';

import { fetchAsset } from './assets';

const ipsumLines = [
  'Eligendi est pariatur quidem in non excepturi et.',
  'Consectetur non tenetur magnam est corporis tempor.',
  'Labore nisi officiis quia ipsum qui voluptatem omnis.',
];

// This test creates a new PDF document and inserts pages to it.
// Each page is testing different features of pdf-lib.
export default async () => {
  const pdfDoc = await PDFDocument.create();

  pdfDoc.setTitle('🥚 The Life of an Egg 🍳');
  pdfDoc.setAuthor('Humpty Dumpty');
  pdfDoc.setSubject('📘 An Epic Tale of Woe 📖');
  pdfDoc.setKeywords(['eggs', 'wall', 'fall', 'king', 'horses', 'men']);
  pdfDoc.setProducer('PDF App 9000 🤖');
  pdfDoc.setCreator('PDF App 9000 🤖');
  pdfDoc.setCreationDate(new Date('2018-06-24T01:58:37.228Z'));
  pdfDoc.setModificationDate(new Date('2018-12-21T07:00:11.000Z'));

  pdfDoc.registerFontkit(fontkit);

  await pdfDoc.attach(
    await fetchAsset('images/greyscale_bird.png'),
    'bird.png',
    {
      mimeType: 'image/png',
      description: 'A bird in greyscale 🐦',
      creationDate: new Date('2006/06/06'),
      modificationDate: new Date('2007/07/07'),
    },
  );

  const csvString = [
    'Year,Make,Model',
    '1997,Ford,E350',
    '2000,Mercury,Cougar',
  ].join('\n');
  await pdfDoc.attach(typedArrayFor(csvString), 'cars.csv', {
    mimeType: 'text/csv',
    description: 'Some car info 🚗',
    creationDate: new Date('2000/01/13'),
    modificationDate: new Date('2012/12/12'),
  });

  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  const size = 750;

  /********************** Page 1 **********************/

  // This page tests different drawing operations as well as adding custom
  // operators to the page content.

  const page1 = pdfDoc.addPage([size, size]);

  // Upper-left Quadrant
  page1.moveTo(0, size / 2);
  page1.drawSquare({ size: size / 2, color: rgb(1, 0, 0) });
  page1.pushOperators(
    pushGraphicsState(),
    moveTo(0, size / 2),
    lineTo(0, size),
    lineTo(size / 2, size),
    closePath(),
    clip(),
    endPath(),
    ...drawRectangle({
      x: size / 8,
      y: size / 2 + size / 8,
      width: size / 4,
      height: size / 4,
      borderWidth: 50,
      borderColor: rgb(1, 1, 0),
      rotate: degrees(0),
      xSkew: degrees(0),
      ySkew: degrees(0),
      color: undefined,
    }),
    popGraphicsState(),
  );

  // Upper-right quadrant
  page1.pushOperators(pushGraphicsState());
  page1.moveTo(size / 2, size / 2);
  page1.drawSquare({ size: size / 2, color: rgb(0, 1, 0) });
  page1.drawEllipse({
    x: size / 2 + size / 4,
    y: size / 2 + size / 4,
    xScale: 25,
    yScale: 150,
    color: rgb(255 / 255, 153 / 255, 51 / 255),
  });
  page1.drawEllipse({
    x: size / 2 + size / 4,
    y: size / 2 + size / 4,
    xScale: 75,
    yScale: 50,
    color: undefined,
  });
  page1.drawEllipse({
    x: size / 2 + size / 4,
    y: size / 2 + size / 4,
    xScale: 150,
    yScale: 100,
    color: undefined,
  });
  page1.pushOperators(clipEvenOdd(), endPath());
  page1.setFont(timesRomanFont);
  page1.setFontColor(rgb(1, 0, 1));
  page1.setFontSize(32);
  page1.setLineHeight(32);
  page1.moveTo(size / 2 + 5, size - 5 - 25);
  page1.drawText(
    [...ipsumLines, ...ipsumLines, ...ipsumLines, ...ipsumLines].join('\n'),
  );
  page1.pushOperators(popGraphicsState());

  // Lower-left quadrant
  page1.moveTo(0, 0);
  page1.drawSquare({ size: size / 2, color: cmyk(1, 0, 0, 0) });
  page1.pushOperators(
    pushGraphicsState(),
    setDashPattern([25], 25),
    setLineCap(LineCapStyle.Round),
  );
  page1.drawCircle({
    x: size / 4,
    y: size / 4,
    size: 150,
    borderWidth: 10,
    borderColor: cmyk(0, 1, 0, 0),
  });
  page1.pushOperators(popGraphicsState());

  // Lower-right quadrant
  page1.moveTo(size / 2, 0);
  page1.drawSquare({ size: size / 2, color: grayscale(0.8) });
  page1.pushOperators(pushGraphicsState(), setLineJoin(LineJoinStyle.Round));
  page1.drawSquare({
    x: size / 2 + size / 4,
    y: 25,
    size: size / 2.25 - 2 * 50,
    rotate: degrees(45),
    borderColor: grayscale(0.6),
    borderWidth: 15,
  });
  page1.pushOperators(setLineJoin(LineJoinStyle.Bevel));
  page1.drawSquare({
    x: size / 2 + 54,
    y: size / 4 + 1,
    size: size / 2.25 - 2 * 100,
    rotate: degrees(-45),
    xSkew: degrees(45 / 2),
    ySkew: degrees(45 / 2),
    color: grayscale(1),
    borderColor: grayscale(0),
    borderWidth: 15,
  });
  page1.pushOperators(popGraphicsState());

  /********************** Page 2 **********************/

  // This page tests placement of text with different fonts

  const page2 = pdfDoc.addPage([size, size]);

  page2.drawSquare({ size, color: rgb(253 / 255, 246 / 255, 227 / 255) });
  page2.setFontColor(rgb(101 / 255, 123 / 255, 131 / 255));

  const [
    ubuntuBytes,
    fantasqueBytes,
    indieFlowerBytes,
    greatVibesBytes,
    appleStormBytes,
    bioRhymeBytes,
    pressStart2PBytes,
    hussar3DBytes,
  ] = await Promise.all([
    fetchAsset('fonts/ubuntu/Ubuntu-R.ttf'),
    fetchAsset('fonts/fantasque/OTF/FantasqueSansMono-BoldItalic.otf'),
    fetchAsset('fonts/indie_flower/IndieFlower.ttf'),
    fetchAsset('fonts/great_vibes/GreatVibes-Regular.ttf'),
    fetchAsset('fonts/apple_storm/AppleStormCBo.otf'),
    fetchAsset('fonts/bio_rhyme/BioRhymeExpanded-Regular.ttf'),
    fetchAsset('fonts/press_start_2p/PressStart2P-Regular.ttf'),
    fetchAsset('fonts/hussar_3d/Hussar3DFour.otf'),
  ]);

  const ubuntuFont = await pdfDoc.embedFont(ubuntuBytes, { subset: true });
  page2.drawText(ipsumLines.join('\n'), {
    y: size - 20,
    size: 20,
    font: ubuntuFont,
    lineHeight: 20,
  });

  const fantasqueFont = await pdfDoc.embedFont(fantasqueBytes);
  page2.drawText(ipsumLines.join('\n'), {
    y: size - 105,
    size: 25,
    font: fantasqueFont,
    lineHeight: 25,
  });

  const indieFlowerFont = await pdfDoc.embedFont(indieFlowerBytes, {
    subset: true,
  });
  page2.drawText(ipsumLines.join('\n'), {
    y: size - 200,
    size: 25,
    font: indieFlowerFont,
    lineHeight: 25,
  });

  const greatVibesFont = await pdfDoc.embedFont(greatVibesBytes, {
    subset: true,
  });
  page2.drawText(ipsumLines.join('\n'), {
    y: size - 300,
    size: 30,
    font: greatVibesFont,
    lineHeight: 30,
  });

  const appleStormFont = await pdfDoc.embedFont(appleStormBytes);
  page2.drawText(ipsumLines.join('\n'), {
    y: size - 425,
    size: 25,
    font: appleStormFont,
    lineHeight: 25,
  });

  const bioRhymeFont = await pdfDoc.embedFont(bioRhymeBytes, {
    subset: true,
  });
  page2.drawText(ipsumLines.join('\n'), {
    y: size - 500,
    size: 15,
    font: bioRhymeFont,
    lineHeight: 15,
  });

  const pressStart2PFont = await pdfDoc.embedFont(pressStart2PBytes, {
    subset: true,
  });
  page2.drawText(ipsumLines.join('\n'), {
    y: size - 575,
    size: 15,
    font: pressStart2PFont,
    lineHeight: 15,
  });

  const hussar3DFont = await pdfDoc.embedFont(hussar3DBytes);
  page2.drawText(ipsumLines.join('\n'), {
    y: size - 650,
    size: 25,
    font: hussar3DFont,
    lineHeight: 25,
  });

  /********************** Page 3 **********************/

  // This page tests embedding and placing different images.

  const page3Height = 1750;
  const page3 = pdfDoc.addPage([size, page3Height]);

  const [
    catRidingUnicornBytes,
    minionsLaughingBytes,
    greyscaleBirdBytes,
    minionsBananaAlphaBytes,
    minionsBananaNoAlphaBytes,
    smallMarioBytes,
  ] = await Promise.all([
    fetchAsset('images/cat_riding_unicorn_resized.jpg'),
    fetchAsset('images/minions_laughing.jpg'),
    fetchAsset('images/greyscale_bird.png'),
    fetchAsset('images/minions_banana_alpha.png'),
    fetchAsset('images/minions_banana_no_alpha_resized.png'),
    fetchAsset('images/small_mario_resized.png'),
  ]);

  const catRidingUnicornImage = await pdfDoc.embedJpg(catRidingUnicornBytes);
  const minionsLaughingImage = await pdfDoc.embedJpg(minionsLaughingBytes);
  const greyscaleBirdImage = await pdfDoc.embedPng(greyscaleBirdBytes);
  const minionsBananaAlphaImage = await pdfDoc.embedPng(
    minionsBananaAlphaBytes,
  );
  const minionsBananaNoAlphaImage = await pdfDoc.embedPng(
    minionsBananaNoAlphaBytes,
  );
  const smallMarioImage = await pdfDoc.embedPng(smallMarioBytes);

  const catRidingUnicornDims = catRidingUnicornImage.scale(0.52);
  const minionsLaughingDims = minionsLaughingImage.scale(0.75);
  const greyscaleBirdDims = greyscaleBirdImage.scale(0.75);
  const minionsBananaAlphaDims = minionsBananaAlphaImage.scale(0.5);
  const minionsBananaNoAlphaDims = minionsBananaNoAlphaImage.scale(0.75);
  const smallMarioDims = smallMarioImage.scale(0.75);

  // const {
  //   setTextRenderingMode,
  //   setStrokingColor,
  //   TextRenderingMode,
  // } = PDFLib;
  // page3.pushOperators(
  //   setTextRenderingMode(TextRenderingMode.OutlineAndClip),
  //   setStrokingColor(rgb(0.5, 0.5, 0.5)),
  // );
  // page3.drawText('Unicornz!', {
  //   x: 75,
  //   y: page3Height - catRidingUnicornDims.height + 75,
  //   font: ubuntuFont,
  //   size: 50,
  // });
  // page3.pushOperators(clip(), endPath());

  page3.moveTo(0, 0);
  page3.drawRectangle({
    width: minionsBananaAlphaDims.width,
    height:
      minionsBananaAlphaDims.height +
      minionsBananaNoAlphaDims.height +
      smallMarioDims.height,
    color: rgb(0, 1, 0),
  });

  page3.moveTo(0, page3Height);
  page3.moveDown(catRidingUnicornDims.height);
  page3.drawImage(catRidingUnicornImage, catRidingUnicornDims);

  page3.moveDown(minionsLaughingDims.height);
  page3.drawImage(minionsLaughingImage, minionsLaughingDims);

  page3.moveDown(greyscaleBirdDims.height);
  page3.drawImage(greyscaleBirdImage, greyscaleBirdDims);

  page3.moveDown(minionsBananaAlphaDims.height);
  page3.drawImage(minionsBananaAlphaImage, minionsBananaAlphaDims);

  page3.moveDown(minionsBananaNoAlphaDims.height);
  page3.drawImage(minionsBananaNoAlphaImage, minionsBananaNoAlphaDims);

  page3.moveDown(smallMarioDims.height);
  page3.drawImage(smallMarioImage, smallMarioDims);

  /********************** Page 4 **********************/

  // This page tests embedding other PDF pages. First we embed page 3 of
  // this document but rotate and scale it. Then we take an external PDF
  // document and embed two pages of it next to each other.

  const page4 = pdfDoc.addPage([size, size]);

  const embeddedPage3 = await pdfDoc.embedPage(page3);
  page4.drawPage(embeddedPage3, {
    x: 10,
    y: size - 10,
    xScale: 1.52,
    yScale: 0.42,
    rotate: degrees(-90),
  });

  const [normalPdfBytes] = await Promise.all([fetchAsset('pdfs/normal.pdf')]);

  const [embeddedPage1, embeddedPage2] = await pdfDoc.embedPdf(normalPdfBytes, [
    0,
    1,
  ]);
  page4.drawPage(embeddedPage1, {
    x: 40,
    y: 100,
    xScale: 0.5,
    yScale: 0.5,
  });
  page4.drawPage(embeddedPage2, {
    x: 400,
    y: 100,
    xScale: 0.5,
    yScale: 0.5,
  });

  /********************** Print Metadata **********************/

  console.log('Title:', pdfDoc.getTitle());
  console.log('Author:', pdfDoc.getAuthor());
  console.log('Subject:', pdfDoc.getSubject());
  console.log('Creator:', pdfDoc.getCreator());
  console.log('Keywords:', pdfDoc.getKeywords());
  console.log('Producer:', pdfDoc.getProducer());
  console.log('Creation Date:', pdfDoc.getCreationDate());
  console.log('Modification Date:', pdfDoc.getModificationDate());

  /********************** Export PDF **********************/

  const base64Pdf = await pdfDoc.saveAsBase64({ dataUri: true });

  return { base64Pdf };
};
