// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like: expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import fetch from "node-fetch";
import { server } from "~/mocks/server";

// MSW 0.x setupServer intercepts XHR / Node ClientRequest, not undici fetch.
// node-fetch uses `http`, so mocked routes work the same way axios+XHR did in jsdom.
globalThis.fetch = fetch as unknown as typeof globalThis.fetch;

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
