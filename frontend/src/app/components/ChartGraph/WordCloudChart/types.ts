export interface WordCloudConfig {
  drawOutOfBound: boolean;
  shape: string;
  width: string;
  height: string;
  left: string;
  top: string;
  right: string;
  bottom: string;
}

export interface WordCloudLabelConfig {
  sizeRange: number[];
  rotationRange: number[];
  rotationStep: number;
  gridSize: number;
  textStyle: {
    fontFamily: string;
    fontWeight: string;
    color: (v) => string;
  };
  emphasis: {
    focus: string;
    textStyle: {
      textShadowBlur: number;
      textShadowColor: string;
    };
  };
}
