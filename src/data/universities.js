// University/institution metadata: maps the names used in researchers.js
// (`universities: [...]`) to a logo, how to fit it, and the background colour of
// the circular badge it's rendered in.
//
// Most logos are the proper brand marks from /public/carousel (transparent PNGs,
// shown "contain" on a white badge). A few institutions fall back to a favicon in
// /public/unis. Opaque square favicons use "cover" so they fill the circle with no
// square outline; Meta's mark sits on its own black badge.

export const universities = {
  "Cambridge": { logo: "/carousel/Cambridge.png", short: "Cambridge" },
  "Harvard": { logo: "/carousel/Harvard.png", short: "Harvard" },
  "Oxford": { logo: "/carousel/Oxford.png", short: "Oxford" },
  "Meta AI": { logo: "/carousel/Meta.png", short: "Meta AI", bg: "#000000" },
  "Cornell": { logo: "/carousel/Cornell.png", short: "Cornell" },
  "Imperial College London": { logo: "/carousel/Imperial.png", short: "Imperial" },
  "NTU": { logo: "/carousel/NTU.png", short: "NTU" },
  "Stanford": { logo: "/carousel/Stanford.png", short: "Stanford" },
  "Duke": { logo: "/carousel/Duke.png", short: "Duke" },
  "MIT": { logo: "/carousel/MIT.png", short: "MIT" },
  "Caltech": { logo: "/carousel/Caltech.png", short: "Caltech" },
  "UCL": { logo: "/carousel/UCL.png", short: "UCL" },
  "NUS": { logo: "/carousel/NUS.png", short: "NUS" },
  // favicon fallbacks
  "QUT": { logo: "/unis/qut.png", short: "QUT", fit: "cover" },
  "Yale": { logo: "/unis/yale.png", short: "Yale", fit: "cover" },
  "University of Surrey": { logo: "/unis/surrey.png", short: "Surrey", fit: "cover" },
  "INSA Strasbourg": { logo: "/unis/insa-strasbourg.png", short: "INSA Strasbourg" },
  "University of Edinburgh": { logo: "/unis/edinburgh.png", short: "Edinburgh" },
  "Universiti Malaya": { logo: "/unis/universiti-malaya.png", short: "Universiti Malaya" },
};

// Logo path for a university name, or null if we don't have one.
export function uniLogo(name) {
  return universities[name]?.logo ?? null;
}

// How to fit the logo image: "contain" (default) or "cover".
export function uniFit(name) {
  return universities[name]?.fit ?? "contain";
}

// Badge background colour for a university (white unless the mark needs its own).
export function uniBg(name) {
  return universities[name]?.bg ?? "#ffffff";
}

// Short display label for a university name (falls back to the name itself).
export function uniShort(name) {
  return universities[name]?.short ?? name;
}
