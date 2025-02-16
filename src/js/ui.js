import ClientController from "./clientController";

class Ui {
  // mothod to open modal
  static openModal(button, modal) {
    const inputFields = document.querySelectorAll(".form__input");
    const form = document.querySelector(".form");
    const formErrorSelect = document.querySelector(".form__error--select");
    form.dataset.mode = "add";

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        modal.style.display = "none";
      }
    });

    button.addEventListener("click", () => {
      modal.style.display = "flex";
      formErrorSelect.style.visibility = "hidden";

      inputFields.forEach((input) => {
        if (input.name !== "type") {
          input.value = "";
          input.placeholder = "";
        } else {
          input.value = "none";
        }
      });
    });
  }

  static currentId = null;

  static openEditModal(modal, product) {
    const prescriptionSection = document.querySelector(
      ".form__group--prescription"
    );
    const otcSection = document.querySelector(".form__group--otc");
    const form = document.querySelector(".form");
    form.dataset.mode = "edit";
    Ui.currentProductId = product.id;

    const inputFields = document.querySelectorAll(".form__input");
    modal.style.display = "flex";

    console.log(product);
    console.log(inputFields);
    inputFields.forEach((input) => {
      Object.keys(product).forEach((key) => {
        if (key === input.name) {
          console.log(product[key]);
          input.value = product[key];
        }
        if (key === "type")
          if (product[key] === "prescription") {
            prescriptionSection.style.display = "inherit";
          } else if (product[key] === "otc") {
            otcSection.style.display = "inherit";
          } else {
            prescriptionSection.style.display = "none";
            otcSection.style.display = "none";
          }
      });
    });
  }

  static closeModal(button, modal, prescriptionSection, otcSection) {
    const submitEdit = document.querySelector(".button--submit-edit");
    const submitAdd = document.querySelector(".button--submit");

    button.addEventListener("click", (e) => {
      e.preventDefault();
      modal.style.display = "none";
      submitEdit.style.display = "none";
      submitAdd.style.display = "block";
      if (prescriptionSection && otcSection) {
        prescriptionSection.style.display = "none";
        otcSection.style.display = "none";
      }
    });
  }

  static closeOnSubmit(modal, prescriptionSection, otcSection) {
    modal.style.display = "none";
    prescriptionSection.style.display = "none";
    otcSection.style.display = "none";
  }

  static toggleMedicineSection(
    prescriptionSection,
    prescriptionFields,
    otcSection,
    otcFields,
    select
  ) {
    prescriptionSection.style.display = "none";
    otcSection.style.display = "none";
    prescriptionFields.forEach((field) => {
      field.value = "";
    });
    otcFields.forEach((field) => {
      field.value = "";
    });

    if (select.value === "prescription") {
      prescriptionSection.style.display = "inherit";
    } else if (select.value === "otc") {
      otcSection.style.display = "inherit";
    } else {
      prescriptionSection.style.display = "none";
      otcSection.style.display = "none";
    }
  }

  static renderData() {
    const data =
      JSON.parse(localStorage.getItem("products")) ||
      "There is currently no products";
    const allProducts = data.all ? [...data.all] : [];
    const dataContainer = document.querySelector(".data");

    dataContainer.innerHTML = "";

    if (!allProducts.length > 0) {
      const noProduct = document.createElement("p");
      noProduct.className = "data__no-data";
      noProduct.innerHTML = "There are no products added yet";
      dataContainer.append(noProduct);
    }

    allProducts.forEach((product) => {
      const card = document.createElement("div");
      const cardDataGroup = document.createElement("div");
      const cardheader = document.createElement("div");
      const cardTitle = document.createElement("h3");
      const cardFooter = document.createElement("div");
      const cardText = document.createElement("p");
      const cardButtons = document.createElement("div");
      const editButton = document.createElement("button");
      const editImg = document.createElement("img");
      const deleteButton = document.createElement("button");
      const deleteImg = document.createElement("img");
      const formModal = document.querySelector(".form-modal");
      const submitEdit = document.querySelector(".button--submit-edit");
      const submitAdd = document.querySelector(".button--submit");

      card.className = "data__card card";
      cardDataGroup.className = "card__data-group";
      cardheader.className = "card__header";
      cardTitle.className = "card__title";
      cardFooter.className = "card__footer";
      cardText.className = "card__text";
      cardButtons.className = "card__button-group";
      editButton.className = "button button--edit button--card";
      deleteButton.className = "button button--delete button--card";
      editImg.className = "button__image button__image--edit";
      deleteImg.className = "button__image on__image--delete";

      cardTitle.innerText = `${product.name}`;
      cardText.innerText = `Mfr. ${product.manufacturer} | Exp. ${product.expiryDate} | Qty. ${product.quantity}`;

      editImg.src = `./src/assets/icons/edit.svg`;
      deleteImg.src = `./src/assets/icons/delete.svg`;

      cardheader.append(cardTitle);
      cardFooter.append(cardText);

      cardDataGroup.append(cardheader, cardFooter);
      editButton.append(editImg, `Edit`);
      deleteButton.append(deleteImg, `Delete`);
      cardButtons.append(editButton, deleteButton);
      card.append(cardDataGroup, cardButtons);
      dataContainer.append(card);

      editButton.addEventListener("click", (e) => {
        Ui.openEditModal(formModal, product);
        submitEdit.style.display = "block";
        submitAdd.style.display = "none";
      });

      deleteButton.addEventListener("click", () => {
        ClientController.deleteProducts(product.id);
        Ui.renderData(Ui.currentTab);
      });
    });
  }

  static currentTab = "all";

  // renders data
  static renderData(type) {
    Ui.currentTab = type;

    const data =
      JSON.parse(localStorage.getItem("products")) ||
      "There is currently no products";

    if (Ui.currentTab === "all") {
      const allData = data.all ? data.all : [];
      this.createElements(allData);
    } else if (Ui.currentTab === "otc") {
      const otcData = data.all.filter((item) => {
        return item.type === "otc";
      });
      this.createElements(otcData);
    } else if (Ui.currentTab === "prescription") {
      const prescriptionData = data.all.filter((item) => {
        return item.type === "prescription";
      });
      this.createElements(prescriptionData);
    } else {
      console.log("Invalid type");
    }
  }

  static renderDataOnClick(tabs) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Removes any active tab indicator
        tabs.forEach((tab) => {
          if (tab.classList.contains("tab--active"))
            tab.classList.remove("tab--active");
        });

        //Renders data for the current tab.
        Ui.renderData(tab.dataset.id);

        //Makes the current tab active
        tab.classList.add("tab--active");
      });
    });
  }
}

export default Ui;
