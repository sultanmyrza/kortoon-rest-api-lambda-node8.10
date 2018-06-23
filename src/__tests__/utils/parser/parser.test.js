const kortoonParser = require('../../../utils/parser');

const parserNames = kortoonParser.parserNames;

jest.setTimeout(60000);
for (let parser of parserNames) {
  describe(`Parser ${parser}`, () => {
    test(`fetch${parser}s`, async () => {
      console.log(`fetch${parser}s`);

      let kortoons = await kortoonParser[`fetch${parser}s`]();
      expect(Array.isArray(kortoons)).toBeTruthy();
      expect(kortoons.length).toBeGreaterThan(1);
      const kortoon = kortoons[0];
      expect(kortoon.title.length).toBeGreaterThan(3);
      expect(kortoon.url.includes('http')).toBeTruthy();
      expect(kortoon.thumbnailUrl.includes('http')).toBeTruthy();
    });

    test(`fetch${parser}`, async () => {
      console.log(`fetch${parser}`);

      let kortoon = await kortoonParser[`fetch${parser}`]();
      expect(kortoon.title.length).toBeGreaterThan(1);
      expect(kortoon.summary.length).toBeGreaterThan(1);
      expect(kortoon.photoUrl.includes('http')).toBeTruthy();
      expect(Array.isArray(kortoon.episodes)).toBeTruthy();
      expect(kortoon.episodes.length).toBe(kortoon.episodesCount);
    });

    test(`fetch${parser}scenes`, async () => {
      console.log(`fetch${parser}scenes`);

      let scenes = await kortoonParser[`fetch${parser}Scenes`]();
      expect(Array.isArray(scenes));
      expect(scenes.length).toBeGreaterThan(5);
      expect(scenes[1].src.includes('http')).toBeTruthy();
    });
  });
}
