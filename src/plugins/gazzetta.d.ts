interface GazzettaResponse {
  properties: Properties;
  data: GazzettaArticle[];
}

interface GazzettaArticle {
  image: Image[];
  contentId: string;
  standFirst: string;
  section: string[];
  collection: "gzAudioVideo" | "gzPrimiPiani";
  lastPublicationDate: Date;
  type: string;
  url: string;
  headband: string;
  provider: string;
  paywallCategory: number;
  bylineName: string;
  shortHeadline: string;
  headline: string;
  firstPublicationDate: Date;
  firstPublicationDateFormatted: string;
  firstPublicationDateRFC822: string;
  firstPublicationDateRFC822WithTimeZone: string;
  json?: string;
  reference?: string;
  videoId?: string;
  tags?: string;
  subType?: string[];
  shortHeadband?: string;
  livestatus?: string;
  bylineAuthorImage?: string;
}

interface Image {
  w: number;
  h: number;
  u: string;
  count: number;
  p?: string;
}

interface Properties {
  requestCatogorization: string;
  elementTotal: number;
  elementInPage: number;
  page: number;
  maxPages: number;
}
