/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import ROUTES from "../constants/routes"
import store from "../app/Store"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then the form should appear", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy()
    })
    describe("When I change the file with a correct format", () => {
      test("It should change the file", () => {
        document.body.innerHTML = NewBillUI()
        const userTest = '{"email":"employee@test.tld"}'
        localStorage.setItem("user", userTest)
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const NewBillTest = new NewBill({document, onNavigate, store, localStorage:window.localStorage})
        fireEvent.change(screen.getByTestId("file"), {
          target: {
            files: [new File([''], 'test.png', {type: 'image/png'})],
          }
        })
        expect(screen.getByTestId("file").files[0].name).toBe("test.png")
      })
    })
    describe("When I submit the form with correct informations", () => {
      test("It creates a new Bill with the right informations, and we go to Bill page", () => {
        document.body.innerHTML = NewBillUI()
        const userTest = '{"email":"employee@test.tld"}'
        localStorage.setItem("user", userTest)
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const NewBillTest = new NewBill({document, onNavigate, store, localStorage:window.localStorage})
        new File([''], 'test.png', {type: 'image/png'})
        screen.getByTestId("expense-type").value = "Transports"
        expect(screen.getByTestId("expense-type").value).toBe("Transports")
        screen.getByTestId("expense-name").value = "Test"
        expect(screen.getByTestId("expense-name").value).toBe("Test")
        screen.getByTestId("amount").value = 666
        expect(screen.getByTestId("amount").value).toBe("666")
        screen.getByTestId("datepicker").value = "2022-04-06"
        expect(screen.getByTestId("datepicker").value).toBe("2022-04-06")
        screen.getByTestId("vat").value = 60
        expect(screen.getByTestId("vat").value).toBe("60")
        screen.getByTestId("pct").value = 60
        expect(screen.getByTestId("pct").value).toBe("60")
        screen.getByTestId("commentary").value = "Test"
        expect(screen.getByTestId("commentary").value).toBe("Test")
        document.getElementById("btn-send-bill").click()
        console.log("screen",screen)
        expect(screen.getAllByText("Mes notes de frais")).toBeTruthy()
      })
    })
  })
})