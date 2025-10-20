import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Searchbar from "./Searchbar";

describe("Searchbar component", () => {
  test("prikazuje input i placeholder", () => {
    render(
      <Searchbar
        value=""
        onChange={() => {}}
        onClear={() => {}}
        placeholder="Pretraga..."
      />
    );
    const inputElement = screen.getByPlaceholderText("Pretraga...");
    expect(inputElement).toBeInTheDocument();
  });

  test("poziva onChange kada se unese tekst", () => {
    const handleChange = jest.fn();
    render(<Searchbar value="" onChange={handleChange} onClear={() => {}} />);
    const inputElement = screen.getByRole("textbox");
    fireEvent.change(inputElement, { target: { value: "test" } });
    expect(handleChange).toHaveBeenCalledWith("test");
  });

  test("prikazuje dugme za brisanje kada postoji vrednost", () => {
    const handleClear = jest.fn();
    render(
      <Searchbar value="tekst" onChange={() => {}} onClear={handleClear} />
    );
    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    expect(handleClear).toHaveBeenCalled();
  });
});
