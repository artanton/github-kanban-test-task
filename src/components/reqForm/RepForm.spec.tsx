import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { RequestForm } from "./ReqForm";
import { vi, it, expect, describe } from "vitest";
import "@testing-library/jest-dom/vitest";
import { store } from "./../../redux/store";
import { Provider as ChakraProvider } from "./../ui/provider";

// Mock window.matchMedia
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

vi.mock("@/redux/operators", () => ({
  fetchTasks: vi.fn(),
}));

describe("RequestForm component", () => {
  render(
    <Provider store={store}>
      <ChakraProvider>
        <RequestForm />
      </ChakraProvider>
    </Provider>
  );
  it("renders input and button", () => {
    expect(screen.getByPlaceholderText("Enter repo URL")).toBeInTheDocument();
    expect(screen.getByText("Load issues")).toBeInTheDocument();
  });

  it("updates input value on change", () => {
    const input = screen.getByPlaceholderText(
      "Enter repo URL"
    ) as HTMLInputElement;
    fireEvent.change(input, {
      target: { value: "https://github.com/example/repo" },
    });

    expect(input.value).toBe("https://github.com/example/repo");
  });

  it("dispatch fetchTasks on form submit", () => {
    const input = screen.getByPlaceholderText("Enter repo URL");
    const button = screen.getByText("Load issues");

    fireEvent.change(input, {
      target: { value: "https://github.com/user/repo" },
    });
    fireEvent.click(button);
  });
});

