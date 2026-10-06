import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CustomerShell } from "./customer-shell";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

function mount(desktop: boolean) {
  vi.stubGlobal("matchMedia", () => ({ matches: desktop }));
  const onNavigate = vi.fn();
  render(<CustomerShell activeView="Home" onNavigate={onNavigate}><h1>Customer home</h1></CustomerShell>);
  return onNavigate;
}

describe("Customer navigation", () => {
  it("keeps all four destinations clickable when desktop navigation is collapsed", () => {
    const onNavigate = mount(true);
    const toggle = screen.getByRole("button", { name: "Toggle navigation" });
    const sidebar = document.getElementById("customer-navigation");
    expect(sidebar).toHaveAttribute("data-expanded", "true");
    fireEvent.click(toggle);
    expect(sidebar).toHaveAttribute("data-expanded", "false");
    for (const name of ["Home", "Restaurants", "Orders", "Contact Us"]) {
      fireEvent.click(screen.getByRole("button", { name, exact: true }));
      expect(onNavigate).toHaveBeenLastCalledWith(name);
      expect(sidebar).toHaveAttribute("data-expanded", "false");
    }
    fireEvent.click(toggle);
    expect(sidebar).toHaveAttribute("data-expanded", "true");
  });

  it("opens and closes the mobile drawer without changing desktop expansion", () => {
    const onNavigate = mount(false);
    const sidebar = document.getElementById("customer-navigation");
    expect(screen.queryByRole("button", { name: "Orders", exact: true })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Toggle navigation" }));
    fireEvent.click(screen.getByRole("button", { name: "Orders", exact: true }));
    expect(onNavigate).toHaveBeenCalledWith("Orders");
    expect(screen.queryByRole("button", { name: "Orders", exact: true })).toBeNull();
    expect(sidebar).toHaveAttribute("data-expanded", "true");
  });
});