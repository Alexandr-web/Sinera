import Axis from "./Axis";
import Text from "../elements/Text";
import getTextSize from "../../helpers/getTextSize";
import getStyleByIndex from "../../helpers/getStyleByIndex";

class AxisX extends Axis {
  constructor(
    ctx,
    data,
    line,
    title,
    bounds,
    font,
    editName,
    sortNames,
    ignoreNames = [],
    themeForTitle = {},
    themeForPoint = {},
    themeForLine = {}
  ) {
    super(ctx, line, title, bounds, sortNames, null, font);

    this.ignoreNames = ignoreNames;
    this.data = data;
    this.editName = editName;
    this.themeForTitle = themeForTitle;
    this.themeForPoint = themeForPoint;
    this.themeForLine = themeForLine;
  }

  getIgnoreNames() {
    if (this.ignoreNames instanceof Function) {
      return this.getAxesData(this.data).names.filter(this.ignoreNames);
    }

    if (Array.isArray(this.ignoreNames)) {
      return this.ignoreNames;
    }

    return [];
  }

  drawTitle(gaps = {}) {
    if (!Object.keys(this.title).length) {
      return this;
    }

    const { size, weight = 600, color = this.themeForTitle.color, text, } = this.title.font;
    const font = {
      size,
      color,
      text,
      weight,
      str: `${weight} ${size}px Arial, sans-serif`,
    };
    const bounds = this.bounds;
    const sizes = getTextSize(size, weight, text, this.ctx);
    const startX = bounds.horizontal.start + (gaps.left || 0);
    const endX = bounds.horizontal.end - sizes.width;
    const posTitle = {
      x: startX + (endX - startX) / 2,
      y: bounds.vertical.end,
    };

    new Text(
      font,
      this.ctx,
      posTitle.x,
      posTitle.y
    ).draw();

    this.title = {
      ...this.title,
      ...sizes,
      ...posTitle,
    };

    return this;
  }

  getCorrectName(name) {
    return this.editName instanceof Function ? this.editName(name) : name;
  }

  drawPoints(gaps = {}) {
    const names = this.getAxesData(this.data).names;
    const bounds = this.bounds;
    const ignoreNames = this.getIgnoreNames();
    const { size, weight = 400, showText = Boolean(Object.keys(this.font).length), color = this.themeForPoint.color, } = this.font;

    names.map((name, index) => {
      // Начальная точка для отрисовки элементов
      const startPoint = bounds.horizontal.start + (gaps.left || 0);
      // Конечная точка для отрисовки элементов
      const endPoint = bounds.horizontal.end - (gaps.right || 0) - startPoint;
      // Шаг, с которым отрисовываем элементы
      const step = endPoint / (names.length - 1);
      // Содержит размеры названия
      const nameSizes = getTextSize(size, weight, this.getCorrectName(name), this.ctx);
      // Координаты элемента для отрисовки
      const posXItem = {
        x: step * index + startPoint,
        y: bounds.vertical.end - (gaps.bottom || 0),
      };

      // Если это уникальное название присутствует в какой-либо группе,
      // то мы добавляем его вместе с его значением
      for (const group in this.data) {
        const groupData = this.data[group].data;
        const dataKeys = Object.keys(this.data);
        const idx = dataKeys.indexOf(group);
        const colorByTheme = getStyleByIndex(idx, dataKeys.length, this.themeForLine.color);

        groupData.map((groupDataItem) => {
          if (groupDataItem.name === name) {
            const { line = {}, } = this.data[group];

            this.points.push({
              name,
              color: (line.color || (this.line || {}).color || line.fill || (this.line || {}).fill) || colorByTheme,
              value: groupDataItem.value,
              group,
              ...posXItem,
              ...nameSizes,
            });
          }
        });
      }

      // Рисуем текст
      if (showText && !ignoreNames.includes(name)) {
        const font = {
          ...this.font,
          color,
          str: `${weight} ${size}px Arial, sans-serif`,
          text: this.getCorrectName(name),
        };

        new Text(
          font,
          this.ctx,
          posXItem.x - nameSizes.width / 2,
          posXItem.y
        ).draw();
      }
    });

    return this;
  }
}

export default AxisX;