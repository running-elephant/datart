// spacing
export const SPACE_UNIT = 4;
export const SPACE_TIMES = (multiple?: number) =>
  `${SPACE_UNIT * (multiple || 1)}px`;
export const SPACE = SPACE_TIMES(1); // 4
export const SPACE_XS = SPACE_TIMES(2); // 8
export const SPACE_SM = SPACE_TIMES(3); // 12
export const SPACE_MD = SPACE_TIMES(4); // 16
export const SPACE_LG = SPACE_TIMES(5); // 20
export const SPACE_XL = SPACE_TIMES(9); // 36 = 16 + 20
export const SPACE_XXL = SPACE_TIMES(14); // 56 = 20 + 36

// z-index
export const BACKGROUND_LEVEL = -1;
export const STICKY_LEVEL = 1;
export const NAV_LEVEL = 10;
export const EMPHASIS_LEVEL = 10;
export const MODAL_LEVEL = 1000;

// base color
export const BLUE = '#1B9AEE';
export const GREEN = '#15AD31';
export const ORANGE = '#FA8C15';
export const YELLOW = '#FAD414';
export const RED = '#E62412';

/* gray
 *
 * as reference
 * G10 - body background
 * G20 - split line light
 * G30 - split line dark
 * G40 - border
 * G50 - disabled font
 * G60 - light font
 * G70 - secondary font
 * G80 - font
 */
export const WHITE = '#FFFFFF';
export const G10 = '#f8f9fa';
export const G20 = '#e9ecef';
export const G30 = '#dee2e6';
export const G40 = '#ced4da';
export const G50 = '#adb5bd';
export const G60 = '#6c757d';
export const G70 = '#495057';
export const G80 = '#343a40';
export const G90 = '#212529';
export const BLACK = '#000000';

// theme color
export const PRIMARY = BLUE;
export const INFO = PRIMARY;
export const SUCCESS = GREEN;
export const PROCESSING = BLUE;
export const ERROR = RED;
export const HIGHLIGHT = RED;
export const WARNING = ORANGE;
export const NORMAL = G40;

// font
export const FONT_SIZE_BASE = 16;

export const FONT_SIZE_LABEL = `${FONT_SIZE_BASE * 0.75}px`;
export const FONT_SIZE_SUBTITLE = `${FONT_SIZE_BASE * 0.8125}px`;
export const FONT_SIZE_BODY = `${FONT_SIZE_BASE * 0.875}px`;
export const FONT_SIZE_SUBHEADING = `${FONT_SIZE_BASE * 0.9375}px`;
export const FONT_SIZE_TITLE = `${FONT_SIZE_BASE}px`;
export const FONT_SIZE_HEADING = `${FONT_SIZE_BASE * 1.125}px`;
export const FONT_SIZE_ICON_SM = `${FONT_SIZE_BASE * 1.25}px`;
export const FONT_SIZE_ICON_MD = `${FONT_SIZE_BASE * 1.5}px`;
export const FONT_SIZE_ICON_LG = `${FONT_SIZE_BASE * 1.75}px`;
export const FONT_SIZE_ICON_XL = `${FONT_SIZE_BASE * 2}px`;
export const FONT_SIZE_ICON_XXL = `${FONT_SIZE_BASE * 2.25}px`;

export const LINE_HEIGHT_LABEL = `${FONT_SIZE_BASE * 1.25}px`;
export const LINE_HEIGHT_BODY = `${FONT_SIZE_BASE * 1.375}px`;
export const LINE_HEIGHT_TITLE = `${FONT_SIZE_BASE * 1.5}px`;
export const LINE_HEIGHT_HEADING = `${FONT_SIZE_BASE * 1.625}px`;
export const LINE_HEIGHT_ICON_SM = `${FONT_SIZE_BASE * 1.75}px`;
export const LINE_HEIGHT_ICON_MD = `${FONT_SIZE_BASE * 2}px`;
export const LINE_HEIGHT_ICON_LG = `${FONT_SIZE_BASE * 2.25}px`;
export const LINE_HEIGHT_ICON_XL = `${FONT_SIZE_BASE * 2.5}px`;
export const LINE_HEIGHT_ICON_XXL = `${FONT_SIZE_BASE * 2.75}px`;

export const FONT_FAMILY =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
export const CODE_FAMILY =
  '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace';
export const FONT_WEIGHT_LIGHT = 300;
export const FONT_WEIGHT_REGULAR = 400;
export const FONT_WEIGHT_MEDIUM = 500;
export const FONT_WEIGHT_BOLD = 600;

// border

export const BORDER_RADIUS = '4px';
