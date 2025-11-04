import "@testing-library/jest-dom";
import { toHaveNoViolations } from "jest-axe";
import React from "react";

expect.extend(toHaveNoViolations);

jest.mock("@/shared/lib/i18n/client", () => ({}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { [key: string]: string | number }) => {
      if (!options) {
        return key;
      }
      return `${key}_${Object.values(options).join("_")}`;
    },
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: "",
      asPath: "",
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null),
    };
  },
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return React.createElement("a", { href }, children);
  };
});
