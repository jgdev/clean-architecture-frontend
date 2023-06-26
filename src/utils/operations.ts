export const stringGeneratorOptions = [
  ["Alphabetic", true],
  ["Uppercase", true],
  ["Lowercase", true],
  ["Numbers", true],
  ["Symbols", true],
];

export const mapConfiguration: { [key: string]: any } = {
  addition: {
    value: "addition",
    name: "Addition",
    input: {
      type: "number",
      multiple: true,
      minInput: 2,
      getLabel: (index: number) => (index === 0 ? "This number" : "Plus"),
      getPlaceholder: (index: number) => `Example: ${index + 1}`,
    },
  },
  subtraction: {
    value: "subtraction",
    name: "Subtract",
    input: {
      type: "number",
      multiple: true,
      minInput: 2,
      getLabel: (index: number) =>
        index === 0 ? "This number" : "Substracting",
      getPlaceholder: (index: number) => `Example: ${index + 1}`,
    },
  },
  multiplication: {
    value: "multiplication",
    name: "Multiply",
    input: {
      type: "number",
      multiple: true,
      minInput: 2,
      getLabel: (index: number) =>
        index === 0 ? "This number" : "Multiplied by",
      getPlaceholder: (index: number) => `Example: ${index + 1}`,
    },
  },
  division: {
    value: "division",
    name: "Divide",
    input: {
      type: "number",
      multiple: true,
      minInput: 2,
      getLabel: (index: number) => (index === 0 ? "This number" : "Divided by"),
      getPlaceholder: (index: number) => `Example: ${index + 1}`,
    },
  },
  square_root: {
    value: "square_root",
    name: "Square root",
    input: {
      type: "number",
      multiple: false,
      getLabel: () => "Square root of ...",
      getPlaceholder: () => "Type the base number",
    },
  },
  random_string: {
    value: "random_string",
    name: "Random String",
    input: {
      type: "number",
      multiple: false,
      options: stringGeneratorOptions,
      getLabel: () => "String length",
      getPlaceholder: () => "Example: 10",
    },
  },
  random_string_v2: {
    value: "random_string_v2",
    name: "Random String (Random.org)",
    input: {
      type: "number",
      multiple: false,
      options: stringGeneratorOptions,
      maxLength: 32,
      getLabel: () => "String length",
      getPlaceholder: () => "Example: 10",
    },
  },
};
