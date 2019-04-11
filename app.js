// Storage controller

const StorageCtrl = (function() {

  // public methods
  return {
    storeItem: function(item) {
      let items = [];
      // check if any items in ls
      if (localStorage.getItem("items") === null) {
        items = [];
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: function() {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach(function(item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach(function(item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsFromStorage: function() {
      localStorage.removeItem("items");
    }
  }
})();


// Item controller

const ItemCtrl = (function() {

  // item constructor

  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // state

  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }

  // public methods
  return {
    getItems: function() {
      return data.items;
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    addItem: function(name, calories) {
      let ID;
      //create id
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // calories to number
      calories = parseInt(calories);
      newItem = new Item(ID, name, calories);
      // add to items array
      data.items.push(newItem);
      return newItem;
    },
    deleteItem: function(id) {
      const ids = data.items.map(function(item) {
        return item.id;
      });

      // get index
      const index = ids.indexOf(id);

      // remove
      data.items.splice(index, 1);
    },

    // delete all items
    clearAllItems: function() {
      data.items = [];
    },


    getItemById: function(id) {
      let found = null;
      data.items.forEach(function(item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories) {
      calories = parseInt(calories);
      let found = null;
      data.items.forEach(function(item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    logData: function() {
      return data;
    },
    getTotalCalories: function() {
      let total = 0;
      data.items.forEach(function(item) {
        total += item.calories;
      });
      data.totalCalories = total;
      return data.totalCalories;
    }
  }

})();

// UI controller

const UiCtrl = (function() {

  const UISelectors = {
    itemList: "#item-list",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories",
    addBtn: ".add-btn",
    clearBtn: ".clear-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    listItems: "#item-list li"
  }

  return {
    populateItemsList: function(items) {
      let html = "";
      items.forEach(function(item) {
        html += `<li class="collection-item" id="item-${item.id}">
      <strong>${item.name}: </strong> <em>${item.calories}</em>
      <a href="" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>
    </li>`
      });
      // insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item) {
      // unhide list
      document.querySelector(UISelectors.itemList).style.display = "block";

      // create li element
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = `  <strong>${item.name}: </strong> <em>${item.calories}</em>
        <a href="" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`;
      // insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li);
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    getSelectors: function() {
      return UISelectors;
    },
    clearFields: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    clearEditState: function() {
      UiCtrl.clearFields();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    showTotalCalories: function(total) {
      document.querySelector(UISelectors.totalCalories).textContent = total;
    },
    addItemToForm: function() {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UiCtrl.showEditState();
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // turn nodelist into an array

      listItems = Array.from(listItems);
      listItems.forEach(function(listItem) {
        let itemId = listItem.getAttribute("id");
        if (itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories}</em>
            <a href="" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;
        }
      });
    },
    deleteListItem: function(id) {

      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();

    },
    removeItems: function() {
      let listItems = document.querySelector(UISelectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach(function(item) {
        item.remove;
      });
    }
  }

})();

// App controller

const App = (function(ItemCtrl, UiCtrl, StorageCtrl) {

  // load event listeners
  const loadEventListeners = function() {
    const UISelectors = UiCtrl.getSelectors();
    // add button
    document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);
    //edit button
    document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);

    //update item
    document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);

    //delete item
    document.querySelector(UISelectors.deleteBtn).addEventListener("click", itemDeleteSubmit);

    // back button event
    document.querySelector(UISelectors.backBtn).addEventListener("click", function(e) {
      UiCtrl.clearEditState();
      e.preventDefault();
    });

    // clear all event
    document.querySelector(UISelectors.clearBtn).addEventListener("click", clearAllItemsClick);

    // disable enter button
    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
  }

  // add item submit

  const itemAddSubmit = function(e) {
    // get input from ui controller

    const input = UiCtrl.getInput();

    // check for input existence

    if (input.name !== "" && input.calories !== "") {
      // add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      UiCtrl.addListItem(newItem);
      // add total Calories
      const totalCalories = ItemCtrl.getTotalCalories();
      UiCtrl.showTotalCalories(totalCalories);

      // store in local storate
      StorageCtrl.storeItem(newItem);

      // clear fields
      UiCtrl.clearFields();

    }


    e.preventDefault();
  }

  const itemEditClick = function(e) {

    if (e.target.classList.contains("edit-item")) {
      // get the list item id
      const listId = e.target.parentNode.parentNode.id;
      // break into array
      const listIdArr = listId.split("-");
      // get the actual id
      const id = parseInt(listIdArr[1]);
      // get the entire item
      const itemToEdit = ItemCtrl.getItemById(id);
      ItemCtrl.setCurrentItem(itemToEdit);
      UiCtrl.addItemToForm();
    }

    e.preventDefault();
  }

  const itemUpdateSubmit = function(e) {
    const input = UiCtrl.getInput();
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // update ui

    UiCtrl.updateListItem(updatedItem);
    // update total Calories
    const totalCalories = ItemCtrl.getTotalCalories();
    UiCtrl.showTotalCalories(totalCalories);

    // Update local storage

    StorageCtrl.updateItemStorage(updatedItem);


    // clear edit state
    UiCtrl.clearEditState();

    e.preventDefault();
  }

  const itemDeleteSubmit = function(e) {

    // get current item
    const currentItem = ItemCtrl.getCurrentItem();
    ItemCtrl.deleteItem(currentItem.id);

    // delete from ui
    UiCtrl.deleteListItem(currentItem.id);
    const totalCalories = ItemCtrl.getTotalCalories();
    UiCtrl.showTotalCalories(totalCalories);

    // delete from local Storage

    StorageCtrl.deleteItemFromStorage(currentItem.id);


    // clear edit state
    UiCtrl.clearEditState();

    e.preventDefault();
  }


  // clear all items
  const clearAllItemsClick = function() {

    // deletes all items from the data structure
    ItemCtrl.clearAllItems();
    UiCtrl.removeItems();

    const totalCalories = ItemCtrl.getTotalCalories();
    UiCtrl.showTotalCalories(totalCalories);

    // clear ls
    StorageCtrl.clearItemsFromStorage();

    UiCtrl.hideList();

  }


  return {
    init: function() {
      // clear edit state
      UiCtrl.clearEditState();
      // add total Calories
      const totalCalories = ItemCtrl.getTotalCalories();
      UiCtrl.showTotalCalories(totalCalories);
      // fetching items from item controller
      const items = ItemCtrl.getItems();
      // check if any items and hide list
      if (items.length === 0) {
        UiCtrl.hideList();
      } else {
        // populate list with items
        UiCtrl.populateItemsList(items);
      }
      // load event listeners
      loadEventListeners();
    }
  }

})(ItemCtrl, UiCtrl, StorageCtrl);

App.init();