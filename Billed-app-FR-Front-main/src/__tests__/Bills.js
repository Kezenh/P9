/**
 * @jest-environment jsdom
 */

import {fireEvent, screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import Bill from "../containers/Bills.js";
import { ROUTES } from "../constants/routes";
import mockStore from "../__mocks__/store"


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.className).toBe("active-icon")

    })
    test("Then bills should be ordered from earliest to latest", () => {

      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    describe("When I click the eye icon", () => {
      test("Then the modal should be open", () => {

        $.fn.modal = jest.fn();
        document.body.innerHTML = BillsUI({ data: bills })
        const BillTest = new Bill({document, onNavigate, store:null, localStorage:window.localStorage});
        BillTest.handleClickIconEye(document.querySelectorAll(`div[data-testid="icon-eye"]`)[3]);
        expect(screen.getAllByText(("Justificatif"))).toBeTruthy()
      })
    })
    describe("When I click the new bill button", () => {
      test("Then it should navigate to the new bills page", () => {

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        document.body.innerHTML = BillsUI({ data: bills })
        const BillTest = new Bill({document, onNavigate, store:null, localStorage:window.localStorage});
        BillTest.handleClickNewBill();
        expect(screen.getAllByText(("Envoyer une note de frais"))).toBeTruthy()
      })
    })
  })
})

// test d'int??gration GET
describe("Given I am a user connected as Employee", () => {
  test("It should fetch bills from the api",async () => {
    document.body.innerHTML = BillsUI({ data: bills })
    localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByText("Mes notes de frais"))
      const billName1  = screen.getByText("encore")
      expect(billName1).toBeTruthy()
      const billName2  = screen.getByText("test1")
      expect(billName2).toBeTruthy()
      const billName3  = screen.getByText("test2")
      expect(billName3).toBeTruthy()
      const billName4  = screen.getByText("test3")
      expect(billName4).toBeTruthy()
  })
})