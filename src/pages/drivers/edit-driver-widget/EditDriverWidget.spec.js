import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import EditDriverWidget from "./EditDriverWidget";
import React from "react";

describe("EditDriverWidget test", () => {
  const adapter = new MockAdapter(axios);

  beforeEach(() => {
    adapter.reset();
    adapter.onGet("/accounts/driver/1").replyOnce(200, {
      id: 1,
      email: "email@example.com",
      firstName: "first",
      lastName: "last",
      DOB: "2000-07-20",
      password: "",
      phone: "5555555555",
      car: "very large car",
    });
  });

  it("gets driver", () => {
    render(<EditDriverWidget id={1} close={() => {}} />);
    return waitFor(() => {
      expect(screen.getByDisplayValue("email@example.com")).toBeInTheDocument();
      expect(screen.getByDisplayValue("first")).toBeInTheDocument();
      expect(screen.getByDisplayValue("last")).toBeInTheDocument();
      expect(screen.getByDisplayValue("5555555555")).toBeInTheDocument();
    });
  });

  it("updates driver without password", async () => {
    var httpSpy = false;
    var request;
    adapter.onPost("/accounts/driver").reply((req) => {
      request = req;
      httpSpy = true;
      return [
        200,
        {
          id: 1,
          email: "email@example.com",
          firstName: "first",
          lastName: "last",
          DOB: "2000-07-20",
          password: "",
          phone: "5555555555",
          car: "very large car",
        },
      ];
    });
    render(<EditDriverWidget id={1} close={() => {}} />);
    let email = await screen.findByDisplayValue("email@example.com"); //form data is loaded
    fireEvent.change(email, { target: { value: "newEmail@example.com" } });

    let submitButton = screen.getByTestId("submit");
    submitButton.click();
    await screen.findByDisplayValue("email@example.com"); //wait for async methods to finish
    expect(httpSpy).toBeTruthy();
    let data = JSON.parse(request.data);
    expect(data.email).toEqual("newEmail@example.com");
    expect(request.params["update-password"]).toEqual(false);
  });

  it("updates driver with password", async () => {
    var httpSpy = false;
    var request;
    adapter.onPost("/accounts/driver").reply((req) => {
      request = req;
      httpSpy = true;
      return [
        200,
        {
          id: 1,
          email: "email@example.com",
          firstName: "first",
          lastName: "last",
          DOB: "2000-07-20",
          password: "",
          phone: "5555555555",
          car: "very large car",
        },
      ];
    });
    render(<EditDriverWidget id={1} close={() => {}} />);
    let email = await screen.findByDisplayValue("email@example.com"); //form data is loaded
    fireEvent.change(email, { target: { value: "newEmail@example.com" } });
    let password = await screen.findByLabelText("Password");
    fireEvent.change(password, { target: { value: "newPassword" } });

    let submitButton = screen.getByTestId("submit");
    submitButton.click();
    await screen.findByDisplayValue("email@example.com"); //wait for async methods to finish
    expect(httpSpy).toBeTruthy();
    let data = JSON.parse(request.data);
    expect(data.email).toEqual("newEmail@example.com");
    expect(data.password).toEqual("newPassword");
    expect(request.params["update-password"]).toEqual(true);
  });

  it("deletes driver", async () => {
    var httpSpy = false;
    adapter.onDelete("/accounts/driver/1").reply(() => {
      httpSpy = true;
      return [200];
    });
    render(<EditDriverWidget id={1} close={() => {}} />);
    await screen.findByDisplayValue("email@example.com"); //form data is loaded

    let deleteButton = await screen.findByTestId("delete-button");
    fireEvent.click(deleteButton);
    await screen.findByText("Confirm Delete");
    fireEvent.click(deleteButton);
    await waitFor(() => expect(httpSpy).toBe(true));
  });

  it("delete requires double click", async () => {
    var httpSpy = jest.spyOn(axios, "delete");
    render(<EditDriverWidget id={1} close={() => {}} />);
    await screen.findByDisplayValue("email@example.com"); //form data is loaded

    let deleteButton = await screen.findByTestId("delete-button");
    fireEvent.click(deleteButton);
    await waitFor(() => expect(httpSpy).toHaveBeenCalledTimes(0));
  });

  it("delete requires spaced double click", async () => {
    var httpSpy = jest.spyOn(axios, "delete");
    render(<EditDriverWidget id={1} close={() => {}} />);
    await screen.findByDisplayValue("email@example.com"); //form data is loaded

    let deleteButton = await screen.findByTestId("delete-button");
    fireEvent.click(deleteButton);
    fireEvent.click(deleteButton);

    await waitFor(() => expect(httpSpy).toBeCalledTimes(0));
  });
});
