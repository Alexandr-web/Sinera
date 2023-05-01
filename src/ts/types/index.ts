import { ILichaClass, } from "../interfaces/licha";

export type TGridFormat = "vertical" | "horizontal" | "default";
export type TCapType = "square" | "circle" | "rhomb" | "triangle";
export type TSort = "more-less" | "less-more";
export type TTypeChart = "line";
export type TTypeTheme = "dark" | "light";
export type TEmptyObject = Record<string, never>;
export type TAxisXPlace = "top" | "bottom";
export type TAxisYPlace = "right" | "left";
export type TLegendPlace = "left" | "center" | "right";
export type TChartTitlePlace = "left" | "center" | "right";
export type TUpdate = () => ILichaClass;
export type TEditValue = (value: number) => string;
export type TEditName = (name: number | string) => string;
export type TIgnoreNamesFunc = (name: string, index: number) => boolean;
export type TIgnoreNames = Array<string | number> | TIgnoreNamesFunc;
export type TMethodForCorrectText = (text: number | string) => number | string;
export type TColorFunc = (opacity?: number) => string;
export type TOnAimed = () => any;
export type TOnClick = () => any;