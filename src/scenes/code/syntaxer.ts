export type TokenKind =
  | "keyword"
  | "fn"
  | "ident"
  | "string"
  | "number"
  | "punct"
  | "comment"
  | "space";

export interface Token {
  kind: TokenKind;
  text: string;
}

const KEYWORDS = new Set([
  "const",
  "let",
  "function",
  "return",
  "if",
  "else",
  "for",
  "import",
  "export",
  "from",
  "async",
  "await",
  "new",
  "class",
  "this",
  "type",
  "interface",
  "true",
  "false",
  "null",
]);

const PUNCT = /[{}()[\];,.:=+\-*/<>!?&|]/;

export function tokenize(line: string): Token[] {
  if (line.trim().startsWith("//")) return [{ kind: "comment", text: line }];

  const out: Token[] = [];
  let i = 0;
  while (i < line.length) {
    const ch = line[i]!;

    if (ch === " " || ch === "\t") {
      let j = i;
      while (j < line.length && (line[j] === " " || line[j] === "\t")) j++;
      out.push({ kind: "space", text: line.slice(i, j) });
      i = j;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      let j = i + 1;
      while (j < line.length && line[j] !== quote) j++;
      j = Math.min(j + 1, line.length);
      out.push({ kind: "string", text: line.slice(i, j) });
      i = j;
      continue;
    }

    if (/\d/.test(ch)) {
      let j = i;
      while (j < line.length && /[\d_.]/.test(line[j]!)) j++;
      out.push({ kind: "number", text: line.slice(i, j) });
      i = j;
      continue;
    }

    if (PUNCT.test(ch)) {
      out.push({ kind: "punct", text: ch });
      i += 1;
      continue;
    }

    if (/[A-Za-z_$]/.test(ch)) {
      let j = i;
      while (j < line.length && /[A-Za-z0-9_$]/.test(line[j]!)) j++;
      const word = line.slice(i, j);
      if (KEYWORDS.has(word)) {
        out.push({ kind: "keyword", text: word });
      } else if (line[j] === "(") {
        out.push({ kind: "fn", text: word });
      } else {
        out.push({ kind: "ident", text: word });
      }
      i = j;
      continue;
    }

    // Fallback: single char as punct
    out.push({ kind: "punct", text: ch });
    i += 1;
  }
  return out;
}

export const TOKEN_STYLE: Record<TokenKind, React.CSSProperties> = {
  keyword: { color: "#c8a96a", fontStyle: "italic" },
  fn: { color: "#e9d4a8" },
  ident: { color: "#f4f1ea" },
  string: { color: "#9cb184" },
  number: { color: "#d9a66d" },
  punct: { color: "#6a6258" },
  comment: { color: "#57514a", fontStyle: "italic" },
  space: {},
};
