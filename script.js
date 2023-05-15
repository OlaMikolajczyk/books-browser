const data = [
  {
    title: "Day of the Dragon",
    author: "Richard A. Knaak",
    quantity: 10,
    unit_price: 9,
    total_value: null,
  },
  {
    title: "A Wizard of Earthsea",
    author: "Ursula K. Le Guin",
    quantity: null,
    unit_price: 10,
    total_value: 40,
  },
  {
    title: "Homeland",
    author: "Robert A. Salvatore",
    quantity: 8,
    unit_price: null,
    total_value: 96,
  },
  {
    title: "Canticle",
    author: "Robert A. Salvatore",
    quantity: 13,
    unit_price: 23,
    total_value: null,
  },
  {
    title: "Gamedec. Granica rzeczywistości",
    author: "Marcin Przybyłek",
    quantity: null,
    unit_price: 25,
    total_value: 50,
  },
  {
    title: "The Night Has Come",
    author: "Stephen King",
    quantity: 30,
    unit_price: null,
    total_value: 900,
  },
  {
    title: "The Sphinx",
    author: "Graham Masterton",
    quantity: 3,
    unit_price: null,
    total_value: 300,
  },
  {
    title: "Charnel House",
    author: "Graham Masterton",
    quantity: null,
    unit_price: 20,
    total_value: 60,
  },
  {
    title: "The Devils of D-Day",
    author: "Graham Masterton",
    quantity: 10,
    unit_price: 16,
    total_value: null,
  },
];
const metadata = [
  {
    id: "title",
    type: "string",
    label: "Title",
  },
  {
    id: "author",
    type: "string",
    label: "Author",
  },
  {
    id: "quantity",
    type: "number",
    label: "Quantity",
  },
  {
    id: "unit_price",
    type: "number",
    label: "Unit price",
  },
  {
    id: "total_value",
    type: "number",
    label: "Total (Quantity * Unit price)",
  },
  {
    id: "genre",
    type: "string",
    label: "Genre",
  },
];

const additionalDataFromBooksDB = [
  {
    title: "Day of the Dragon",
    author: "Richard A. Knaak",
    genre: "fantasy",
    pages: 378,
    rating: 3.81,
  },
  {
    title: "A Wizard of Earthsea",
    author: "Ursula K. Le Guin",
    genre: "fantasy",
    pages: 183,
    rating: 4.01,
  },
  {
    title: "Homeland",
    author: "Robert A. Salvatore",
    genre: "fantasy",
    pages: 343,
    rating: 4.26,
  },
  {
    title: "Canticle",
    author: "Robert A. Salvatore",
    genre: "fantasy",
    pages: 320,
    rating: 4.03,
  },
  {
    title: "Gamedec. Granica rzeczywistości",
    author: "Marcin Przybyłek",
    genre: "cyberpunk",
    pages: 364,
    rating: 3.89,
  },
  {
    title: "The Night Has Come",
    author: "Stephen King",
    genre: "post apocalyptic",
    pages: 186,
    rating: 4.55,
  },
  {
    title: "The Sphinx",
    author: "Graham Masterton",
    genre: "horror",
    pages: 207,
    rating: 3.14,
  },
  {
    title: "Charnel House",
    author: "Graham Masterton",
    genre: "horror",
    pages: 123,
    rating: 3.61,
  },
  {
    title: "The Devils of D-Day",
    author: "Graham Masterton",
    genre: "horror",
    pages: 243,
    rating: "3.62",
  },
];
const additionalMetadataFromBooksDB = [
  {
    id: "title",
    type: "string",
    label: "Title",
  },
  {
    id: "author",
    type: "string",
    label: "Author",
  },
  {
    id: "genre",
    type: "string",
    label: "Genre",
  },
  {
    id: "pages",
    type: "number",
    label: "Pages",
  },
  {
    id: "rating",
    type: "number",
    label: "Rating",
  },
];

const searchInputElement = document.body.querySelector("input.search-input");
const searchButtonElement = document.body.querySelector("button.search-go");
const searchResetElement = document.body.querySelector("button.search-reset");

const columnHideElement = document.body.querySelector("button.column-hide");
const columnShowElement = document.body.querySelector("button.column-show");
const columnResetElement = document.body.querySelector("button.column-reset");

const markButtonElement = document.body.querySelector("button.function-mark");
const fillButtonElement = document.body.querySelector("button.function-fill");
const countButtonElement = document.body.querySelector("button.function-count");
const computeTotalsButtonElement = document.body.querySelector(
  "button.function-totals"
);
const resetFunctionButtonElement = document.body.querySelector(
  "button.functiofn-reset"
);

let books = [];

let book = data.map((book) => {
  return {
    title: book.title,
    author: book.author,
    genre: book.genre,
  };
});

class Grid {
  constructor() {
    this.data = data.map((item) => {
      const additionalData = additionalDataFromBooksDB.find(
        (data) => data.title === item.title && data.author === item.author
      );
      return { ...item, genre: additionalData ? additionalData.genre : "" };
    });
    this.metadata = metadata;

    // HINT: below map can be useful for view operations ;))
    this.dataViewRef = new Map();

    Object.freeze(this.data);
    Object.freeze(this.metadata);

    this.render();
    this.live();
  }

  render() {
    this.table = document.createElement("table");

    this.head = this.table.createTHead();
    this.body = this.table.createTBody();

    this.renderHead();
    this.renderBody();

    document.body.append(this.table);
  }

  renderHead() {
    const row = this.head.insertRow();

    for (const column of this.metadata) {
      const cell = row.insertCell();

      cell.innerText = column.label;
    }
  }

  renderBody() {
    for (const dataRow of this.data) {
      const row = this.body.insertRow();

      for (const column of this.metadata) {
        const cell = row.insertCell();

        cell.classList.add(column.type);
        cell.innerText = dataRow[column.id];
      }

      // connect data row reference with view row reference
      this.dataViewRef.set(dataRow, row);
    }
  }

  live() {
    searchButtonElement.addEventListener("click", this.onSearchGo.bind(this));
    searchInputElement.addEventListener(
      "keydown",
      this.onSearchChange.bind(this)
    );
    searchResetElement.addEventListener("click", this.onSearchReset.bind(this));

    columnHideElement.addEventListener(
      "click",
      this.onColumnHideClick.bind(this)
    );
    columnShowElement.addEventListener(
      "click",
      this.onColumnShowClick.bind(this)
    );
    columnResetElement.addEventListener("click", this.onColumnReset.bind(this));

    markButtonElement.addEventListener(
      "click",
      this.onMarkEmptyClick.bind(this)
    );
    fillButtonElement.addEventListener(
      "click",
      this.onFillTableClick.bind(this)
    );
    countButtonElement.addEventListener(
      "click",
      this.onCountEmptyClick.bind(this)
    );
    computeTotalsButtonElement.addEventListener(
      "click",
      this.onComputeTotalsClick.bind(this)
    );
    resetFunctionButtonElement.addEventListener(
      "click",
      this.onFunctionsResetClick.bind(this)
    );
  }

  onSearchGo(event) {}

  onSearchChange(event) {
    const value = event.target.value.toLowerCase();
    const filteredBooks = data.filter((book) => {
      return (
        book.title.toLowerCase().includes(value) ||
        book.author.toLowerCase().includes(value)
      );
    });

    while (this.body.firstChild) {
      this.body.firstChild.remove();
    }

    for (const dataRow of filteredBooks) {
      const row = this.body.insertRow();

      for (const column of this.metadata) {
        const cell = row.insertCell();
        cell.classList.add(column.type);
        cell.innerText = dataRow[column.id];
      }

      this.dataViewRef.set(dataRow, row);
    }
  }

  onSearchReset(event) {
    searchInputElement.value = "";

    while (this.body.firstChild) {
      this.body.firstChild.remove();
    }

    for (const dataRow of this.data) {
      const row = this.body.insertRow();

      for (const column of this.metadata) {
        const cell = row.insertCell();
        cell.classList.add(column.type);
        cell.innerText = dataRow[column.id];
      }

      this.dataViewRef.set(dataRow, row);
    }
  }

  onColumnHideClick(event) {
    const visibleColumns = Array.from(this.head.rows[0].cells).filter(
      (cell) => !cell.classList.contains("hide")
    );

    if (visibleColumns.length > 0) {
      const columnHideElement = visibleColumns[0];
      const columnIndex = columnHideElement.cellIndex;

      columnHideElement.classList.add("hide");

      for (const row of this.body.rows) {
        row.cells[columnIndex].classList.add("hide");
      }
    }
  }

  onColumnShowClick(event) {
    const hiddenColumns = Array.from(this.head.rows[0].cells).filter((cell) =>
      cell.classList.contains("hide")
    );

    if (hiddenColumns.length > 0) {
      const columnToShow = hiddenColumns[0];
      const columnIndex = columnToShow.cellIndex;

      columnToShow.classList.remove("hide");

      for (const row of this.body.rows) {
        row.cells[columnIndex].classList.remove("hide");
      }
    }
  }

  onColumnReset(event) {
    while (this.body.firstChild) {
      this.body.firstChild.remove();
    }

    for (const dataRow of this.data) {
      const row = this.body.insertRow();

      for (const column of this.metadata) {
        const cell = row.insertCell();
        cell.classList.add(column.type);
        cell.innerText = dataRow[column.id];
      }

      this.dataViewRef.set(dataRow, row);
    }
  }

  onMarkEmptyClick(event) {
    const emptyCells = Array.from(this.body.rows).filter((row) => {
      return Array.from(row.cells).some((cell) => cell.innerText.trim() === "");
    });

    for (const row of emptyCells) {
      for (const cell of row.cells) {
        if (cell.innerText.trim() === "") {
          cell.classList.add("mark");
        } else {
          cell.classList.remove("mark");
        }
      }
    }
  }

  onFillTableClick(event) {
    const markedCells = Array.from(this.body.rows).filter((row) => {
      return Array.from(row.cells).some((cell) => cell.innerHTML.trim() === "");
    });

    markedCells.forEach((cell) => {
      const columnIndex = cell.cellIndex;
      const columnId = this.metadata[columnIndex].id;

      const dependencyValues = this.getDependencyValues(columnId, cell);
      const newValue = this.calculateValue(columnId, dependencyValues);
      cell.innerText = newValue;
      cell.classList.remove("mark");
    });
  }

  calculateValue(columnId, dependencyValues) {
    if (columnId === "total_value") {
      const [quantity, unitPrice] = dependencyValues;
      return quantity * unitPrice;
    } else if (columnId === "quantity") {
      const [totalValue, unitPrice] = dependencyValues;
      return totalValue / unitPrice;
    } else if (columnId === "unit_price") {
      const [totalValue, quantity] = dependencyValues;
      return totalValue / quantity;
    }
  }

  onCountEmptyClick(event) {
    const emptyCells = Array.from(this.body.rows).filter((row) => {
      return Array.from(row.cells).some((cell) => cell.innerText.trim() === "");
    });

    const emptyCellCount = emptyCells.length;

    alert(`There are ${emptyCellCount} empty cells in the table.`);
  }

  onComputeTotalsClick(event) {
    const totalValueCells = Array.from(this.body.rows).map((row) => {
      return row.cells[row.cells.length - 2].innerText.trim();
    });

    const visibleTotalValues = totalValueCells
      .filter((value) => value !== "")
      .map(parseFloat);

    const sum = visibleTotalValues.reduce(
      (accumulator, value) => accumulator + value,
      0
    );

    alert(`Total: ${sum}`);
  }

  onFunctionsResetClick(event) {
    const table = document.querySelector("table");
    const markedCells = Array.from(table.querySelectorAll(".mark"));
    markedCells.forEach((cell) => {
      cell.classList.remove("mark");
    });
  }
}

new Grid();
