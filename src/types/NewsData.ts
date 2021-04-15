export interface INewsData {
  title?: string;
  subtitle?: string;
  link?: string;
  cta?: string;
  cta_color?: string;
}

export interface IHomeNewsQuery {
  news_home: INewsData[];
}

export interface IValidatorsNewsQuery {
  news_validators: INewsData[];
}
