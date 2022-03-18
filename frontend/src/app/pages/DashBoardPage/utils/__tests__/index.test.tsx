import {
  adaptBoardImageUrl,
  convertImageUrl,
  fillPx,
  getBackgroundImage,
  getRGBAColor,
} from '..';
import { BOARD_FILE_IMG_PREFIX } from '../../constants';
const oldBoardId = 'xxxBoardIdXxx555';
const boardId = 'xxxBoardIdXxx666';
describe('dashboard.utils.index', () => {
  it(' should convertImageUrl get url', () => {
    const str1 = '';
    const str2 = 'http://www.qq.png';
    expect(convertImageUrl(str1)).toBe(str1);
    expect(convertImageUrl(str2)).toBe(str2);

    const str3 = BOARD_FILE_IMG_PREFIX + 'www.pan';
    const origin = window.location.origin;
    expect(convertImageUrl(str3)).toBe(`${origin}/${str3}`);
  });
  it('should getBackgroundImage ', () => {
    const str1 = '';
    const str2 = '123';
    expect(getBackgroundImage(str1)).toBe('none');
    expect(getBackgroundImage(str2)).toBe(`url(${convertImageUrl(str2)})`);
  });

  it('should adaptBoardImageUrl', () => {
    const str1 = `resources/image/dashboard/${oldBoardId}/fileID123`;
    const str2 = `resources/image/dashboard/${boardId}/fileID123`;
    const str3 = `resources/image/chart/343/fileID123`;
    const boardId2 = ``;
    expect(adaptBoardImageUrl(str1, boardId)).toBe(str2);
    expect(adaptBoardImageUrl(str3, boardId)).toBe(str3);
    expect(adaptBoardImageUrl(str1, boardId2)).toBe(str1);
  });

  it('should fillPx', () => {
    expect(fillPx(0)).toBe(0);
    expect(fillPx(2)).toBe('2px');
  });

  it('should getRGBAColor', () => {
    const val = `rgba(0, 0, 0, 1)`;
    expect(getRGBAColor('')).toBe(val);
    expect(getRGBAColor(null)).toBe(val);
    expect(getRGBAColor(undefined)).toBe(val);
    expect(getRGBAColor(0)).toBe(val);
    const color = {
      rgb: { r: 10, g: 111, b: 123, a: 0.3 },
    };
    const tColor = `rgba(10, 111, 123, 0.3)`;
    expect(getRGBAColor(color)).toBe(tColor);
    expect(getRGBAColor('#ccc')).toBe('#ccc');
  });
});
