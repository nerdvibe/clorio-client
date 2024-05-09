export interface INewsData {
  title?: string;
  subtitle?: string;
  link?: string;
  cta?: string;
  cta_color?: string;
  visible?: boolean;
}

export interface IHomeNewsQuery {
  newsHome: INewsData[];
}

export interface IValidatorsNewsQuery {
  newsValidators: INewsData[];
}
