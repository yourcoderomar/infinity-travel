/** Heavy uppercase title in Galano Grotesque: destination names, heroes, section titles. */
export interface HeadlineProps {
  children: string;
  /** Optional regular-weight first line (THE LOGO / ANATOMY). */
  kicker?: string;
  /** xl 88px · l 56px · m 36px · s 24px. Default "xl". */
  size?: "xl" | "l" | "m" | "s";
  /** Text colour. "lime" and "white" only on blue or photos. Default "ink". */
  tone?: "ink" | "white" | "lime";
  /** Element to render. Default "h1". */
  as?: "h1" | "h2" | "h3" | "div" | "span";
  className?: string;
}
export declare function Headline(props: HeadlineProps): JSX.Element;

/** Flat pill button. Renders <a> when href is set. */
export interface ButtonProps {
  children: React.ReactNode;
  /** primary = action colour · highlight = lime · outline = ink line. Default "primary". */
  variant?: "primary" | "highlight" | "outline";
  href?: string;
  onClick?: (e: unknown) => void;
  disabled?: boolean;
  className?: string;
}
export declare function Button(props: ButtonProps): JSX.Element;

/** A date, trip length or short tag in a pill. */
export interface DatePillProps {
  children: string;
  /** lime (black text) · blue (white text) · white (black text). Default "lime". */
  tone?: "lime" | "blue" | "white";
  /** pill = fully round · tag = small rectangle ("Book by request"). Default "pill". */
  shape?: "pill" | "tag";
  className?: string;
}
export declare function DatePill(props: DatePillProps): JSX.Element;

/** Brand-blue panel listing departure dates under a trip-length label. */
export interface DateCardProps {
  /** e.g. "4 Days/3 Nights". */
  label?: string;
  /** e.g. "October". */
  month?: string;
  /** e.g. ["15/10", "22/10", "29/10"]. */
  dates: string[];
  className?: string;
}
export declare function DateCard(props: DateCardProps): JSX.Element;
