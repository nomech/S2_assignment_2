import Ui from "./ui";
import ClientController from "./clientController";

const showButton = document.querySelector(".button--show-form");
const formModal = document.querySelector(".form-modal");
const form = document.querySelector(".form");
const deleteButton = document.querySelector(".button--delete");
const deleteModal = document.querySelector(".delete-modal");

const cancelButton = document.querySelector(".button--cancel");
const deleteCancelButton = document.querySelector(
  ".delete-modal__button--cancel"
);

const name = document.querySelector(".form__input--name");
const manufacturer = document.querySelector(".form__input--manufacturer");
const expiryDate = document.querySelector(".form__input--expire");
const quantity = document.querySelector(".form__input--quantity");
const dosage = document.querySelector(".form__input--dosage");
const frequency = document.querySelector(".form__input--frequency");
const price = document.querySelector(".form__input--price");
const age = document.querySelector(".form__input--age");
const typeField = document.querySelector(".form__input--type");
const prescriptionSection = document.querySelector(
  ".form__group--prescription"
);

const prescriptionFields = [
  document.querySelector(".form__input--dosage"),
  document.querySelector(".form__input--frequency"),
];

const otcSection = document.querySelector(".form__group--otc");
const otcFields = [
  document.querySelector(".form__input--price"),
  document.querySelector(".form__input--age"),
];

const formValidator = () => {
  const nameValue = name.value.trim();
  const manufacturerValue = manufacturer.value.trim();
  const expiryDateValue = expiryDate.value.trim();
  const quantityValue = quantity.value.trim();
  const typeValue = typeField.value.trim();
  const ageValue = age.value.trim();
  const priceValue = price.value.trim();
  const dosageValue = dosage.value.trim();
  const frequencyValue = frequency.value.trim();
  const formErrorSelect = document.querySelector(".form__error--select");

  let isValid = true;
  if (!nameValue) {
    name.placeholder = "Name is reqired";
    isValid = false;
  }

  if (!manufacturerValue) {
    manufacturer.placeholder = "Manufacturer is reqired";
    isValid = false;
  }

  if (!expiryDateValue) {
    expiryDate.placeholder = "Name is reqired";
    isValid = false;
  }

  if (!quantityValue) {
    quantity.placeholder = "Quantity is reqired";
    isValid = false;
  }

  if (typeValue === "none") {
    formErrorSelect.style.visibility = "visible";
    isValid = false;
  }

  if (typeValue === "otc") {
    if (!ageValue) {
      age.placeholder = "Age is reqired";
      isValid = false;
    }

    if (!priceValue) {
      price.placeholder = "Price is reqired";
      isValid = false;
    }
  }

  if (typeValue === "prescription") {
    if (!dosageValue) {
      dosage.placeholder = "Dosage is reqired";
      isValid = false;
    }

    if (!frequencyValue) {
      frequency.placeholder = "Frequency is reqired";
      isValid = false;
    }
  }
  return isValid;
};

document.addEventListener("DOMContentLoaded", () => {
  Ui.renderData();
  Ui.openModal(showButton, formModal);
  Ui.closeModal(cancelButton, formModal, prescriptionSection, otcSection);

  Ui.openModal(deleteButton, deleteModal);
  Ui.closeModal(
    deleteCancelButton,
    deleteModal,
    prescriptionSection,
    prescriptionFields
  );

  typeField.addEventListener("change", () => {
    Ui.toggleMedicineSection(
      prescriptionSection,
      prescriptionFields,
      otcSection,
      otcFields,
      typeField
    );
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let product = {
      name: name.value.trim(),
      manufacturer: manufacturer.value.trim(),
      expiryDate: expiryDate.value.trim(),
      quantity: quantity.value.trim(),
      type: typeField.value.trim(),
      age: age.value.trim(),
      price: price.value.trim(),
      dosage: dosage.value.trim(),
      frequency: frequency.value.trim(),
    };

    console.log(price.value.trim());

    if (formValidator()) {
      if (form.dataset.mode === "add") {
        ClientController.addProduct(product);
      } else if (form.dataset.mode === "edit") {
        product.id = Ui.currentProductId;
        ClientController.editProduct(product);
      } else {
        console.error("Invalid mode");
        return;
      }
      Ui.closeOnSubmit(formModal, prescriptionSection, otcSection);
      Ui.renderData(Ui.currentTab);
    }
  });
});
